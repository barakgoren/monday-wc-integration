/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataPerDay, DataPerMonth, ProjectIndicatorType } from "@/types/table.type";
import http from "@/utils/http";
import { projectsMap } from "@/utils/projectsMap";

type TimeEntry = {
    started_at: string;
    ended_at: string;
};

type SubItem = {
    name: string; // Project name
    column_values: {
        id: string;
        text: string; // Time spent in HH:mm:ss
        history: TimeEntry[];
    }[];
};

type BoardItem = {
    name: string; // Month (MM/YYYY)
    subitems: SubItem[];
};

type InputObject = {
    boards: {
        items_page: {
            items: BoardItem[];
        };
    }[];
};

type ReducedResult = Record<
    string, // Month (MM/YYYY)
    Record<
        string, // Day in the month (DD)
        {
            [project: string]: number; // Hours per project
            total: number; // Total hours for the day
        }
    >
>;

export type MondayData = {
    defaultOrder: ReducedResult;
    byMonthOrder: DataPerMonth[];
    byDayOrder: DataPerDay;
}

const queries = {
    wc: `{
  me {
    name
  }
  boards(ids: 7076561027) {
    name
    id
    items_page {
      items {
        name
        subitems {
          name
          column_values(types: time_tracking) {
            id
            text
            value
            ... on TimeTrackingValue {
              history {
                started_at
                ended_at
              }
            }
          }
        }
      }
    }
  }
}`,
}

const mondayService = {
    getWCData,
};

async function getWCData() {
    const res = await http.post('', { query: queries.wc });
    const input = res.data;
    const result = reduceObjectToMonthlyData(input);
    return result;
}


function reduceObjectToMonthlyData(input: InputObject): MondayData {
    const result: ReducedResult = {};
    const returnData: MondayData = {} as MondayData;

    // Iterate over all boards
    input.boards.forEach((board) => {
        board.items_page.items.forEach((monthItem) => {
            const month = monthItem.name; // Extract MM/YYYY
            if (!result[month]) {
                result[month] = {};
            }

            // Iterate over all subitems (projects)
            monthItem.subitems.forEach((subItem) => {
                const projectName = subItem.name;

                subItem.column_values.forEach((column) => {
                    if (column.id === "time_tracking") {
                        column.history.forEach(({ started_at, ended_at }) => {
                            const start = new Date(started_at);
                            const end = new Date(ended_at);
                            const day = start.getDate().toString().padStart(2, "0"); // Extract day (DD)

                            // Calculate hours worked
                            const hoursWorked =
                                (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                            // Initialize data for the day if not present
                            if (!result[month][day]) {
                                result[month][day] = { total: 0 };
                            }

                            // Add hours to the project and update the total
                            if (!result[month][day][projectName]) {
                                result[month][day][projectName] = 0;
                            }
                            result[month][day][projectName] += hoursWorked;
                            result[month][day].total += hoursWorked;
                        });
                    }
                });
            });
        });
    });

    returnData.defaultOrder = result;
    const obj: DataPerDay = {};
    Object.keys(result).forEach((month) => {
        Object.keys(result[month]).forEach((day) => {
            obj[`${day}/${month}`] = {
                hours: Number(result[month][day].total.toFixed(1)),
                projects: Object.keys(result[month][day])
                    .filter((project) => project !== "total")
                    .map((project) => {
                        const color = projectsMap[project]?.color
                        return {
                            id: Math.random(),
                            projectName: project,
                            hours: Number(result[month][day][project].toFixed(1)),
                            color
                        };
                    }),
            }
        });
    });

    // Sort the keys of the obj from the most recent date to the most past date
    const sortedKeys = Object.keys(obj).sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('-'));
        const dateB = new Date(b.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
    });

    const sortedObj: DataPerDay = sortedKeys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {} as DataPerDay);

    returnData.byDayOrder = sortedObj;

    const months: DataPerMonth[] = Object.keys(result).map((month) => {
        const daysForMonth: DataPerDay = Object.keys(returnData.byDayOrder)
            .filter((key) => key.endsWith(`/${month}`))
            .reduce((acc, key) => {
                acc[key] = returnData.byDayOrder[key];
                return acc;
            }, {} as DataPerDay);
        const totalTime = Number(Object.values(daysForMonth).reduce((sum, day) => sum + day.hours, 0).toFixed(1));
        const projectHours: Record<string, number> = {};
        Object.values(daysForMonth).forEach((day) => {
            day.projects.forEach((project) => {
                if (!projectHours[project.projectName]) {
                    projectHours[project.projectName] = 0;
                }
                projectHours[project.projectName] += Number(project.hours.toFixed(1));
            });
        });

        const projects: ProjectIndicatorType[] = Object.keys(projectHours).map((projectName) => ({
            id: Math.random(), // Generate a unique ID for the project
            projectName,
            hours: Number(projectHours[projectName].toFixed(1)),
            color: projectsMap[projectName]?.color
        }));

        return {
            id: Math.random(),
            month,
            days: daysForMonth,
            totalTime,
            projects,
        };
    });

    months.sort((a, b) => {
        const [aMonth, aYear] = a.month.split("/");
        const [bMonth, bYear] = b.month.split("/")
        return new Date(Number(bYear), Number(bMonth), 1).getTime() - new Date(Number(aYear), Number(aMonth), 1).getTime();
    }).reverse();

    returnData.byMonthOrder = months;

    return returnData;

}

export default mondayService;
