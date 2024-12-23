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
                      <p key={project.id}>
                        {project.projectName}: {project.hours} hours
                      </p>
                    ))}
                  </div>
                ),
              },
              { title: "Hours Worked", dataIndex: "hours", key: "hours" },
            ]}
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
