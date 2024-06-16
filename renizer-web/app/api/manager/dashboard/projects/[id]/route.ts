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
            SELECT 
                a.project_id, name, description, location, start_date, end_date, status, energy_rate_kwh AS energy_rate, produced_energy_kwh AS energy_produced, energy_sold_kwh AS energy_sold, total_cost, org_restricted, m_p_user_id, creation_date, SUM(investment_amount) AS investment_received
            FROM 
                Project_T AS a
                INNER JOIN Investor_Invest_Project_T AS b ON a.project_id = b.project_id
            WHERE 
                a.project_id = '${id}';
            --

            SELECT 
                a.p_user_id, CONCAT(first_name, ' ', last_name) AS contributor, a.project_id, start_date, end_date, role, GROUP_CONCAT(c.task_name ORDER BY c.task_name SEPARATOR ',') AS tasks
            FROM 
                Collaboration_T AS a 
                INNER JOIN User_T AS b ON a.p_user_id = b.user_id
                INNER JOIN Collaboration_Task_T AS c ON a.p_user_id = c.p_user_id AND a.project_id = c.project_id
            WHERE 
                a.project_id = '${id}'
            GROUP BY
                a.p_user_id, role, contributor, a.project_id, start_date, end_date;

            --

            SELECT 
                i_user_id, CONCAT(first_name, ' ', last_name) AS investor, project_id, investment_amount, investment_date
            FROM 
                Investor_Invest_Project_T AS a
                INNER JOIN User_T AS b ON a.i_user_id = b.user_id
            WHERE
                project_id = '${id}'
            ORDER BY
                investment_date DESC;

            --

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
