import { NextRequest } from "next/server";
import { NewTaskPriorityFormSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const validatedData = await NewTaskPriorityFormSchema.safeParseAsync({
        cpUserId: body.cpUserId,
        projectId: body.projectId,
        taskName: body.taskName,
        assignedDate: new Date(body.assignedDate),
        newPriority: body.newPriority,
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    const { projectId, cpUserId, assignedDate, taskName, newPriority } =
        validatedData.data;
    try {
        await db.query(
            `
            UPDATE
            Collaboration_Task_T
            SET priority = ?     
            WHERE project_id = ? AND c_p_user_id = ? AND assigned_date = ? AND task_name = ?;

            INSERT INTO Collaboration_Task_Priority_Update_History_T VALUES (?, ?, ?, ?, ?);
        `,
            [
                newPriority,
                projectId,
                cpUserId,
                assignedDate,
                taskName,
                cpUserId,
                projectId,
                taskName,
                new Date(),
                newPriority,
            ]
        );
        await db.end();
        return Response.json({ newPriority });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
