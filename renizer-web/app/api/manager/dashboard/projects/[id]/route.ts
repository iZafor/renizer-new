import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export async function GET(_: NextRequest, { params: { id } }: Params) {
    try {
        const queryRes = await pool
            .query<RowDataPacket[][]>(
                `
            -- ProjectDetails
            SELECT 
                a.project_id, name, description, location, start_date, end_date, status, energy_rate_kwh AS energy_rate, produced_energy_kwh AS energy_produced, energy_sold_kwh AS energy_sold, total_cost, org_restricted, m_p_user_id, creation_date, SUM(investment_amount) AS investment_received
            FROM 
                Project_T AS a
                INNER JOIN Investor_Invest_Project_T AS b ON a.project_id = b.project_id
            WHERE 
                a.project_id = '${id}';

            -- ProjectCollaboration[]
            SELECT 
                a.p_user_id, CONCAT(first_name, ' ', last_name) AS contributor, a.project_id, start_date, end_date, role, COUNT(c.task_name) AS total_assigned_tasks, tasks_in_progress, tasks_completed
            FROM 
                Collaboration_T AS a 
                INNER JOIN User_T AS b ON a.p_user_id = b.user_id
                INNER JOIN Collaboration_Task_T AS c ON a.p_user_id = c.p_user_id AND a.project_id = c.project_id
                LEFT JOIN (
                    SELECT project_id, p_user_id, COUNT(task_name) AS tasks_in_progress 
                    FROM Collaboration_Task_T
                    WHERE status = "In Progress"
                    GROUP BY p_user_id, project_id
                ) AS dt1 ON a.p_user_id = dt1.p_user_id AND a.project_id = dt1.project_id 
                LEFT JOIN (
                    SELECT project_id, p_user_id, COUNT(task_name) AS tasks_completed 
                    FROM Collaboration_Task_T
                    WHERE status = "Done"
                    GROUP BY p_user_id, project_id
                ) AS dt2 ON a.p_user_id = dt2.p_user_id AND a.project_id = dt2.project_id
            WHERE 
                a.project_id = '${id}'
            GROUP BY
                a.p_user_id, role, contributor, a.project_id, start_date, end_date, tasks_in_progress, tasks_completed
            ORDER BY
                start_date DESC;

            -- InvestorDetails[]
            SELECT
                a.i_user_id, CONCAT(first_name, ' ', last_name) AS investor, investor_type, SUM(investment_amount) AS total_investment, COUNT(DISTINCT(project_id)) AS invested_in_projects
            FROM 
                Investor_T AS a
                INNER JOIN User_T AS b ON a.i_user_id = b.user_id
                INNER JOIN Investor_Invest_Project_T AS c ON a.i_user_id = c.i_user_id
            GROUP BY
                a.i_user_id, investor, investor_type
            ORDER BY 
                total_investment DESC;

            -- ProjectInvestment[]
            SELECT 
                a.i_user_id, CONCAT(first_name, ' ', last_name) AS investor, a.project_id, a.investment_amount, proposal_date, investment_date, proposal_status
            FROM 
                Investment_Proposal_T AS a
                INNER JOIN User_T AS b ON a.i_user_id = b.user_id
                LEFT JOIN Investor_Invest_Project_T AS c ON a.i_user_id = c.i_user_id AND a.project_id = c.project_id AND a.investment_amount = c.investment_amount
            WHERE
                a.project_id = '${id}'
            ORDER BY
                investment_date DESC;

            -- ProjectTask[]
            SELECT 
                project_id, p_user_id, CONCAT(first_name, ' ', last_name) AS assignee, task_name AS task, status, assigned_date, expected_hour, expected_delivery_date, hour_taken, delivery_date, priority
            FROM 
                Collaboration_Task_T AS a INNER JOIN User_T AS b ON a.p_user_id = b.user_id
            WHERE 
                project_id = '${id}';
            `
            )
            .then(([rows, _]) => rows);
        return Response.json(queryRes);
    } catch (error) {
        console.error(error);
        return Response.json([]);
    }
}
