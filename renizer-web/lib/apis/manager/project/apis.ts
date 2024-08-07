"use server";

import { parseToPlainObject, db, QueryResult } from "@/lib/db";
import {
    CollaboratorDetails,
    InvestorDetails,
    ProjectCollaboration,
    ProjectDetails,
    ProjectInvestment,
    ProjectTask,
} from "@/lib/definitions";

export async function getProjectDetails(projectId: string) {
    try {
        const res = await db
            .query<QueryResult[]>(
                `
            SELECT 
                a.project_id, name, description, location, start_date, end_date, status, energy_rate_kwh AS energy_rate, produced_energy_wh AS energy_produced, energy_sold_wh AS energy_sold, total_cost, org_restricted, m_p_user_id, creation_date, SUM(IF(investment_date IS NOT NULL, investment_amount, 0)) AS investment_received
            FROM 
                Project_T AS a
                LEFT JOIN Project_Investment_T AS b ON a.project_id = b.project_id
            WHERE 
                a.project_id = '${projectId}';
        `
            )
            .then(
                (rows) =>
                    parseToPlainObject(rows)[0] as unknown as
                        | ProjectDetails
                        | undefined
            );
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

// TODO: Filter collaborators based on organization
export async function getCollaboratorsDetails(projectId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT
                c_p_user_id, CONCAT(first_name, ' ', last_name) AS name, working_department, hourly_rate, working_experience
            FROM 
                Project_Contributor_T AS a
                INNER JOIN User_T AS b ON a.c_p_user_id = b.user_id
                INNER JOIN Project_Associate_T AS c ON a.c_p_user_id = c.p_user_id
                WHERE c_p_user_id NOT IN (
                    SELECT DISTINCT(c_p_user_id)
                    FROM Collaboration_T
                    WHERE project_id = '${projectId}'
                );
        `
            )
            .then(parseToPlainObject)) as CollaboratorDetails[];
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProjectCollaborations(projectId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT 
                a.c_p_user_id, CONCAT(first_name, ' ', last_name) AS name, a.project_id, start_date, end_date, role, COUNT(c.task_name) AS total_assigned_tasks, tasks_in_progress, tasks_completed, hourly_rate, working_experience
            FROM 
                Collaboration_T AS a 
                INNER JOIN User_T AS b ON a.c_p_user_id = b.user_id
                LEFT JOIN Collaboration_Task_T AS c ON a.c_p_user_id = c.c_p_user_id AND a.project_id = c.project_id
                LEFT JOIN (
                    SELECT project_id, c_p_user_id, COUNT(task_name) AS tasks_in_progress 
                    FROM Collaboration_Task_T
                    WHERE status = "In Progress"
                    GROUP BY c_p_user_id, project_id
                ) AS dt1 ON a.c_p_user_id = dt1.c_p_user_id AND a.project_id = dt1.project_id 
                LEFT JOIN (
                    SELECT project_id, c_p_user_id, COUNT(task_name) AS tasks_completed 
                    FROM Collaboration_Task_T
                    WHERE status = "Completed"
                    GROUP BY c_p_user_id, project_id
                ) AS dt2 ON a.c_p_user_id = dt2.c_p_user_id AND a.project_id = dt2.project_id
                INNER JOIN Project_Associate_T AS d ON a.c_p_user_id = d.p_user_id
            WHERE 
                a.project_id = '${projectId}'
            GROUP BY
                a.c_p_user_id, role, name, a.project_id, start_date, end_date, tasks_in_progress, tasks_completed, hourly_rate, working_experience
            ORDER BY
                start_date DESC;
        `
            )
            .then(parseToPlainObject)) as ProjectCollaboration[];
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getInvestorsDetails() {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT
                a.i_user_id, CONCAT(first_name, ' ', last_name) AS investor, investor_type, SUM(investment_amount) AS total_investment, COUNT(DISTINCT(project_id)) AS invested_in_projects
            FROM 
                Investor_T AS a
                INNER JOIN User_T AS b ON a.i_user_id = b.user_id
                INNER JOIN Project_Investment_T AS c ON a.i_user_id = c.i_user_id
            WHERE
                c.investment_date IS NOT NULL
            GROUP BY
                a.i_user_id, investor, investor_type
            ORDER BY 
                total_investment DESC;
        `
            )
            .then(parseToPlainObject)) as InvestorDetails[];
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProjectInvestments(projectId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT 
                i_user_id, CONCAT(first_name, ' ', last_name) AS investor, project_id, investment_amount, proposal_date, investment_date, proposal_status
            FROM 
                Project_Investment_T AS a
                INNER JOIN User_T AS b ON a.i_user_id = b.user_id
            WHERE
                a.project_id = '${projectId}'
            ORDER BY
                investment_date DESC;
        `
            )
            .then(parseToPlainObject)) as ProjectInvestment[];
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProjectTasks(projectId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT 
                a.project_id, a.c_p_user_id, CONCAT(first_name, ' ', last_name) AS assignee, role, task_name AS task, status, assigned_date, expected_hour, expected_delivery_date, hour_taken, delivery_date, priority
            FROM 
                Collaboration_Task_T AS a 
                INNER JOIN User_T AS b ON a.c_p_user_id = b.user_id
                INNER JOIN Collaboration_T AS c ON a.c_p_user_id = c.c_p_user_id AND a.project_id = c.project_id
            WHERE 
                a.project_id = '${projectId}'
            `
            )
            .then(parseToPlainObject)) as ProjectTask[];
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function updateEnergyRate({
    projectId,
    newRate,
}: {
    projectId: string;
    newRate: number;
}) {
    await db.query(`
            UPDATE Project_T
            SET energy_rate_kwh = ${newRate}
            WHERE project_id = '${projectId}'    
        `);
    await db.query(`
        INSERT INTO Project_Energy_Rate_Update_History_T (project_id, energy_rate_kwh, updated_on)
        VALUES ('${projectId}', ${newRate}, ${new Date().toISOString()});
    `);
}

export async function getMatchingRoles(project_id: string, role: string) {
    try {
        const queryRes = await db
            .query<QueryResult[]>({
                sql: `
                SELECT role
                FROM Collaboration_T
                WHERE role = '${role}' AND project_id = '${project_id}';
                `,
                rowsAsArray: true,
            })
            .then(parseToPlainObject);
        await db.end();
        return queryRes as unknown as string[];
    } catch (error) {
        console.error(error);
        return [];
    }
}
