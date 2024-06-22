import { NextRequest } from "next/server";
import { NewTaskPriorityFormSchema } from "@/lib/schemas";
import { pool } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const validatedData = await NewTaskPriorityFormSchema.safeParseAsync({
        pUserId: body.pUserId,
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

    try {
        await pool.query(
            `
            UPDATE
            Collaboration_Task_T
            SET priority = ?     
            WHERE project_id = ? AND p_user_id = ? AND assigned_date = ? AND task_name = ?
        `,
            [
                validatedData.data.newPriority,
                validatedData.data.projectId,
                validatedData.data.pUserId,
                validatedData.data.assignedDate,
                validatedData.data.taskName,
            ]
        );
        return Response.json({
            newPriority: validatedData.data.newPriority,
        });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
