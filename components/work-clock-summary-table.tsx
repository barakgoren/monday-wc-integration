/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateRange } from "react-day-picker";
import { Table, TableColumnsType } from "antd";
import ProjectIndicator from "./ui/project-indicator";
import { DataPerMonth, ProjectIndicatorType } from "@/types/table.type";

const mainTableColumns: TableColumnsType<DataPerMonth> = [
  { title: "Month", dataIndex: "month", key: "month" },
  { title: "Total Time", dataIndex: "totalTime", key: "totalTime" },
  {
    title: "Projects",
    dataIndex: "projects",
    key: "projects",
    render: (projects: ProjectIndicatorType[]) => {
      return <ProjectIndicator projects={projects} />;
    },
  },
];

interface WorkClockSummaryTableProps {
  view: string;
  dateRange: DateRange | undefined;
  data: DataPerMonth[];
}

export function WorkClockSummaryTable({
  view,
  dateRange,
  data,
}: WorkClockSummaryTableProps) {
  return (
    <Table
      className="w-full"
      columns={mainTableColumns}
      dataSource={data}
      bordered
      pagination={false}
      size="small"
      rowKey={(record) => record.id.toString()}
      expandable={{
        expandedRowRender: (record) => (
          <Table
            bordered
            size="small"
            columns={[
              { title: "Date", dataIndex: "date", key: "date" },
              {
                title: "Project",
                dataIndex: "project",
                key: "project",
                render: (projects: ProjectIndicatorType[]) => (
                  <div>
                    {projects.map((project) => (
                      <p
                        key={project.id}
                        style={{
                          fontWeight:
                            project.projectName === "dailyGap"
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {project.projectName === "dailyGap"
                          ? "Breaks"
                          : project.projectName}
                        : {project.hours} hours
                      </p>
                    ))}
                  </div>
                ),
              },
              { title: "Hours Worked", dataIndex: "hours", key: "hours" },
            ]}
            summary={(items) => {
              const totalHours = items.reduce((acc: number, item: any) => {
                return acc + item.hours;
              }, 0);
              const averageHours = totalHours / items.length;
              const totalBreaks = items
                .reduce((acc: number, item: any) => {
                  const breakHours =
                    item.project.find((p: any) => p.projectName === "dailyGap")
                      ?.hours || 0;
                  return acc + breakHours;
                }, 0)
                .toFixed(1);
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <b>Average</b>
                    <br />
                    <b>Total Days</b>
                    <br />
                    <b>Total Breaks</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <b>{averageHours.toFixed(2)}</b>
                    <br />
                    <b>{items.length}</b>
                    <br />
                    <b>{totalBreaks}</b>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
            dataSource={Object.keys(record.days || {}).map((day) => ({
              key: day,
              date: day,
              project: record.days?.[day].projects,
              hours: record.days?.[day].hours,
            }))}
            pagination={false}
          />
        ),
      }}
    />
  );
}
