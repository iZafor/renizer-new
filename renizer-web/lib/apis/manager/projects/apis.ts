"use server";

import { pool } from "@/lib/db";
import { Project } from "@/lib/definitions";
import { RowDataPacket } from "mysql2";

export async function getProjects(managerId: string) {
    try {
        return (await pool
            .query<RowDataPacket[]>(
                `
            SELECT project_id, name, description, status, produced_energy_kwh AS energy_produced, energy_sold_kwh AS energy_sold, creation_date 
            FROM Project_T
            WHERE m_p_user_id = '${managerId}'
            ORDER BY creation_date DESC;
            `
            )
            .then(([rows]) => rows)) as Project[];
    } catch (error) {
        console.error(error);
        return [];
    }
}
