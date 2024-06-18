"use server";

import { pool } from "@/lib/db";

export async function getMatchingRoles(project_id: string, role: string) {
    try {
        const queryRes = await pool
            .query({
                sql: `
                SELECT role
                FROM Collaboration_T
                WHERE role = '${role}' AND project_id = '${project_id}';
                `,
                rowsAsArray: true,
            })
            .then(([rows, _]) => rows);
        return queryRes as unknown as string[];
    } catch (error) {
        console.error(error);
        return [];
    }
}
