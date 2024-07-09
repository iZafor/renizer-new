"use server";

import { parseToPlainObject, db, QueryResult } from "@/lib/db";
import { Project } from "@/lib/definitions";

export async function getProjects(managerId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT project_id, name, description, energy_source AS source, status, produced_energy_wh AS energy_produced, energy_sold_wh AS energy_sold, creation_date 
            FROM Project_T
            WHERE m_p_user_id = '${managerId}'
            ORDER BY creation_date DESC;
            `
            )
            .then(parseToPlainObject)) as Project[];
        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}
