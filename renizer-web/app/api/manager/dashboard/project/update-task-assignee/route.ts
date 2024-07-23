import { NextRequest } from "next/server";
import { db, parseToPlainObject, QueryResult } from "@/lib/db";
import { NewTaskAssigneeFormSchema } from "@/lib/schemas";

// TODO: keep track of hour_taken for the previous assignee 
export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const validatedData = await NewTaskAssigneeFormSchema.safeParseAsync({
        cpUserId: body.cpUserId,
        projectId: body.projectId,
        taskName: body.taskName,
        assignedDate: new Date(body.assignedDate),
        newAssigneeId: body.newAssigneeId,
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    const { cpUserId, projectId, taskName, assignedDate, newAssigneeId } =
        validatedData.data;
    const newAssignedDate = new Date();
    try {
        const res = await db
            .query<QueryResult[]>(
                `
            SELECT CONCAT(first_name, ' ', last_name) AS assignee, role
            FROM Collaboration_T AS a INNER JOIN User_T AS b ON a.c_p_user_id = b.user_id
            WHERE project_id = ? AND user_id = ?
        `,
                [projectId, newAssigneeId]
            )
            .then(parseToPlainObject);
        if (!res || !res[0]) {
            return Response.json({ message: "Invalid assignee." });
        }
        await db.query(
            `
            UPDATE Collaboration_Task_T 
            SET c_p_user_id = ?, assigned_date = ?, hour_taken = 0
            WHERE c_p_user_id = ? AND project_id = ? AND task_name = ? AND assigned_date = ?;

            INSERT INTO Collaboration_Task_Collaborator_Update_History_T VALUES (?, ?, ?, ?);
            `,
            [
                newAssigneeId,
                newAssignedDate,
                cpUserId,
                projectId,
                taskName,
                assignedDate,
                newAssigneeId,
                projectId,
                taskName,
                newAssignedDate,
            ]
        );
        await db.end();
        return Response.json({
            newAssigneeId,
            newAssignedDate,
            newAssigneeName: res[0].assignee,
            newAssigneeRole: res[0].role,
        });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
