import { ProjectIndicatorType } from "@/types/table.type";
import { Tooltip } from "antd";
import React from "react";

type ProjectIndicatorProps = {
  projects: ProjectIndicatorType[];
};

export default function ProjectIndicator({ projects }: ProjectIndicatorProps) {
  const totalHours = projects
    .filter((project) => project.projectName !== "dailyGap")
    .filter((project) => project.hours > 2)
    .reduce((sum, project) => sum + project.hours, 0);

  const totalProjects = projects.filter(
    (project) => project.projectName !== "dailyGap" && project.hours > 2
  ).length;

  return (
    <div className="w-full h-6 rounded-md flex">
      {projects
        .filter((project) => project.projectName !== "dailyGap")
        .filter((project) => project.hours > 2)
        .map((project, index) => {
          return (
            <Tooltip
              placement="topLeft"
              title={
                <div className="text-center">
                  <div>{project.projectName}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    {project.hours} hours
                  </div>
                </div>
              }
              key={project.id}
            >
              <div
                className="hover:scale-110"
                key={project.id}
                style={{
                  width: `${(project.hours / totalHours) * 100}%`,
                  backgroundColor: project.color,
                  borderRadius:
                    index === 0
                      ? "4px 0 0 4px"
                      : index === totalProjects - 1
                      ? "0 4px 4px 0"
                      : "0",
                }}
              ></div>
            </Tooltip>
          );
        })}
    </div>
  );
}
