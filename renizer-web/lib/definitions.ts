export interface Project {
    project_id: string;
    name: string;
    description?: string;
    status: string;
    energy_produced?: string;
    energy_sold?: string;
    creation_date: string;
}

export interface InvestorDetails {
    i_user_id: string;
    investor: string;
    investor_type: string;
    total_investment: string;
    invested_in_projects: string;
}

export interface CollaboratorDetails {
    c_p_user_id: string;
    name: string;
    working_department: string;
    hourly_rate: string;
    working_experience: string;
}

export interface ProjectDetails {
    project_id: string;
    name: string;
    description?: string;
    location?: string;
    start_date?: string;
    end_date: string;
    status: string;
    energy_rate?: string;
    energy_produced?: string;
    energy_sold?: string;
    total_cost: string;
    org_restricted: number;
    m_p_user_id: string;
    creation_date: string;
    investment_received: string;
}

export interface ProjectInvestment {
    i_user_id: string;
    investor: string;
    project_id: string;
    investment_amount: string;
    proposal_date: string;
    investment_date: string;
    proposal_status: string;
}

export interface ProjectCollaboration {
    p_user_id: string;
    name: string;
    project_id: string;
    start_date?: string;
    end_date?: string;
    role: string;
    total_assigned_tasks: string;
    tasks_in_progress: string;
    tasks_completed: string;
}

export interface ProjectTask {
    project_id: string;
    p_user_id: string;
    assignee: string;
    role: string;
    task: string;
    status: string;
    assigned_date: string;
    expected_hour: string;
    expected_delivery_date: string;
    hour_taken: string;
    delivery_date: string;
    priority: string;
}
