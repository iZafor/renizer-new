export interface Project {
    project_id: string;
    name: string;
    description?: string;
    status: string;
    energy_produced: number;
    energy_sold: number;
    creation_date: Date;
}

export interface InvestorDetails {
    i_user_id: string;
    investor: string;
    investor_type: string;
    total_investment: number;
    invested_in_projects: number;
}

export interface CollaboratorDetails {
    c_p_user_id: string;
    name: string;
    working_department: string;
    hourly_rate: number;
    working_experience: number;
}

export interface ProjectDetails {
    project_id: string;
    name: string;
    description?: string;
    location?: string;
    start_date?: Date;
    end_date?: Date;
    status: string;
    energy_rate?: string;
    energy_produced?: string;
    energy_sold?: string;
    total_cost: number;
    org_restricted: number;
    m_p_user_id: string;
    creation_date: Date;
    investment_received: number;
}

export interface ProjectInvestment {
    i_user_id: string;
    investor: string;
    project_id: string;
    investment_amount: number;
    proposal_date: Date;
    investment_date?: Date;
    proposal_status: string;
}

export interface ProjectCollaboration {
    p_user_id: string;
    name: string;
    project_id: string;
    start_date?: Date;
    end_date?: Date;
    role: string;
    total_assigned_tasks: number;
    tasks_in_progress: number;
    tasks_completed: number;
}

export interface ProjectTask {
    project_id: string;
    p_user_id: string;
    assignee: string;
    role: string;
    task: string;
    status: string;
    assigned_date: Date;
    expected_hour: number;
    expected_delivery_date: Date;
    hour_taken?: number;
    delivery_date?: Date;
    priority: string;
}

export interface ProjectData {
    projectDetails?: ProjectDetails;
    collaborators?: CollaboratorDetails[];
    collaborations?: ProjectCollaboration[];
    investors?: InvestorDetails[];
    investments?: ProjectInvestment[];
    tasks?: ProjectTask[];
}
