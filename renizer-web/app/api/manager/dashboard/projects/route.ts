import { pool } from "@/lib/db";

export async function GET() {
    try {
        const res = await pool
            .query(
                `
            SELECT project_id, name, description, status, produced_energy_kwh AS energy_produced, energy_sold_kwh AS energy_sold, creation_date 
            FROM Project_T
            ORDER BY creation_date DESC;
            `
            )
            .then(([rows, _]) => rows);
        return Response.json(res);
    } catch (error) {
        console.error(error);
        return Response.json([]);
    }
}
