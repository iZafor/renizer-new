import { ProjectOverviewAnalytics } from "@/lib/definitions";
import { parseToPlainObject, db, QueryResult } from "@/lib/db";

export async function GET() {
    try {
        const queryRes = await db
            .query<QueryResult[][]>(
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
            .then((rows) => rows.map(parseToPlainObject));

        const res: ProjectOverviewAnalytics = {
            activeProjects: queryRes[0][0].activeProjects,
            completedProjects: queryRes[1][0].completedProjects,
            projectsInProgress: queryRes[2][0].projectsInProgress,
            projectsInOverdue: queryRes[3][0].projectsInOverdue,
        };

        await db.end();
        return Response.json(res);
    } catch (error) {
        console.error(error);
        return Response.json([-1, -1, -1, -1]);
    }
}
