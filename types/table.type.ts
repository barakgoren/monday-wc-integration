export type DataPerMonth = {
    id: number;
    month: string;
    days?: DataPerDay;
    totalTime: number;
    projects: ProjectIndicatorType[];
}

export type ProjectIndicatorType = {
    id: number;
    projectName: string;
    hours: number;
    color: string;
};

export type DataPerDay = Record<string, { hours: number; projects: ProjectIndicatorType[] }>;