import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { TaskStatusAnalytics } from "@/lib/definitions";

export async function GET() {
    try {
        const queryRes = await pool
            .query<RowDataPacket[][]>(
                `
            SELECT b.name, COUNT(*) AS inProgressTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'In Progress'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS doneTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Done'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS cancelledTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Cancelled'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS notStartedYetTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Not Started Yet'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS overdueTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Overdue'
            GROUP BY b.name;
            `
            )
            .then(([rows, _]) => rows);

        const res: TaskStatusAnalytics = {};
        for (const row of queryRes[0]) {
            const { name, inProgressTasks } = row as {
                name: string;
                inProgressTasks: number;
            };
            res[name] = { "In Progress": inProgressTasks };
        }

        for (const row of queryRes[1]) {
            const { name, doneTasks } = row as {
                name: string;
                doneTasks: number;
            };
            res[name]["Done"] = doneTasks;
        }

        for (const row of queryRes[2]) {
            const { name, cancelledTasks } = row as {
                name: string;
                cancelledTasks: number;
            };
            res[name]["Cancelled"] = cancelledTasks;
        }

        for (const row of queryRes[3]) {
            const { name, notStartedYetTasks } = row as {
                name: string;
                notStartedYetTasks: number;
            };
            res[name]["Not Started Yet"] = notStartedYetTasks;
        }

        for (const row of queryRes[4]) {
            const { name, overdueTasks } = row as {
                name: string;
                overdueTasks: number;
            };
            res[name]["Overdue"] = overdueTasks;
        }

        return Response.json(res);
    } catch (error) {
        console.error(error);
        return Response.json({});
    }
}
