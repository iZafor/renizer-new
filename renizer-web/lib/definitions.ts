export interface Project {
    project_id: string;
    name: string;
    description?: string;
    status: string;
    energy_produced?: number;
    energy_sold?: number;
    creation_date: Date;
}
