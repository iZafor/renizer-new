import { NextRequest } from "next/server";
import { NewTaskStatusFormSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const validatedData = await NewTaskStatusFormSchema.safeParseAsync({
        cpUserId: body.cpUserId,
        projectId: body.projectId,
        taskName: body.taskName,
        assignedDate: new Date(body.assignedDate),
        newStatus: body.newStatus,
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    const { projectId, cpUserId, assignedDate, taskName, newStatus } =
        validatedData.data;
    const updatedOn = new Date();
    const deliveryDate = newStatus === "Completed" ? updatedOn : null;
    try {
        await db.query(
            `
            UPDATE Collaboration_Task_T
            SET status = ?, delivery_date = ?
            WHERE project_id = ? AND c_p_user_id = ? AND assigned_date = ? AND task_name = ?;

            INSERT INTO Collaboration_Task_Status_Update_History_T VALUES (?, ?, ?, ?, ?);
        `,
            [
                newStatus,
                deliveryDate,
                projectId,
                cpUserId,
                assignedDate,
                taskName,
                cpUserId,
                projectId,
                taskName,
                updatedOn,
                newStatus,
            ]
        );
        await db.end();
        return Response.json({ newStatus, deliveryDate });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
