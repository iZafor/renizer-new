import { ProjectOverviewAnalytics } from "@/lib/definitions";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
    try {
        const queryRes = await pool
            .query<RowDataPacket[][]>(
                `
                SELECT COUNT(*) AS activeProjects
                FROM Project_T
                WHERE status NOT IN ('Not Started Yet', 'Cancelled', 'On Hold', 'Completed', 'Closed');    

                SELECT COUNT(*) AS completedProjects
                FROM Project_T
                WHERE status = 'Done';

                SELECT COUNT(DISTINCT(project_id)) AS projectsInProgress 
                FROM Collaboration_Task_T
                WHERE status = 'In Progress';

                SELECT COUNT(DISTINCT(project_id)) AS projectsInOverdue 
                FROM Collaboration_Task_T
                WHERE status = 'Overdue';
            `
            )
            .then(([rows, _]) => rows);

        const res: ProjectOverviewAnalytics = {
            activeProjects: queryRes[0][0].activeProjects,
            completedProjects: queryRes[1][0].completedProjects,
            projectsInProgress: queryRes[2][0].projectsInProgress,
            projectsInOverdue: queryRes[3][0].projectsInOverdue,
        };

        return Response.json(res);
    } catch (error) {
        console.error(error);
        return Response.json([-1, -1, -1, -1]);
    }
}
