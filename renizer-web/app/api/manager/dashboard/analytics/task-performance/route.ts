import { parseToPlainObject, db, QueryResult } from "@/lib/db";
import { TaskPerformanceAnalytics } from "@/lib/definitions";

export async function GET() {
    try {
        const queryRes = await db
            .query<QueryResult[][]>(
                `
            SELECT b.name, COUNT(*) AS totalTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            GROUP BY b.name;

            SELECT b.name, COUNT(DISTINCT(a.p_user_id)) AS contributors
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            GROUP BY b.name;

            SELECT b.name, SUM(ABS(DATEDIFF(a.expected_delivery_date, a.delivery_date))) AS daysTaken
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            GROUP BY b.name;
            `
            )
            .then((rows) => rows.map(parseToPlainObject));

        const res: TaskPerformanceAnalytics = {};
        for (const row of queryRes[0]) {
            const { name, totalTasks } = row as unknown as {
                name: string;
                totalTasks: number;
            };
            res[name] = { "Total Tasks": totalTasks };
        }
        for (const row of queryRes[1]) {
            const { name, contributors } = row as unknown as {
                name: string;
                contributors: number;
            };
            res[name]["Tasks Per Contributor"] =
                res[name]["Total Tasks"] / contributors;
        }
        for (const row of queryRes[2]) {
            const { name, daysTaken } = row as unknown as {
                name: string;
                daysTaken: number;
            };
            res[name]["Avg. Completion Day"] =
                res[name]["Total Tasks"] / daysTaken;
        }

        await db.end();
        return Response.json(res);
    } catch (error) {
        console.error(error);
        return Response.json({});
    }
}
