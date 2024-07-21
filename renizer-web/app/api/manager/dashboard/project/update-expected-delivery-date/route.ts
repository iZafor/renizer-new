import { NextRequest } from "next/server";
import { NewExpectedDeliveryDateFormSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const validatedData =
        await NewExpectedDeliveryDateFormSchema.safeParseAsync({
            cpUserId: body.cpUserId,
            projectId: body.projectId,
            taskName: body.taskName,
            assignedDate: new Date(body.assignedDate),
            newExpectedDeliveryDate: new Date(body.newExpectedDeliveryDate),
        });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    const {
        projectId,
        cpUserId,
        assignedDate,
        taskName,
        newExpectedDeliveryDate,
    } = validatedData.data;
    try {
        await db.query(
            `
            UPDATE Collaboration_Task_T
            SET expected_delivery_date = ?     
            WHERE project_id = ? AND c_p_user_id = ? AND assigned_date = ? AND task_name = ?;

            INSERT INTO Collaboration_Task_Expected_Delivery_Date_Update_History_T VALUES (?, ?, ?, ?, ?);
        `,
            [
                newExpectedDeliveryDate,
                projectId,
                cpUserId,
                assignedDate,
                taskName,
                cpUserId,
                projectId,
                taskName,
                new Date(),
                newExpectedDeliveryDate,
            ]
        );
        await db.end();
        return Response.json({ newExpectedDeliveryDate });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
