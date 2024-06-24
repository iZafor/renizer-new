import { NextRequest } from "next/server";
import { NewExpectedDeliveryDateFormSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const validatedData =
        await NewExpectedDeliveryDateFormSchema.safeParseAsync({
            pUserId: body.pUserId,
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

    try {
        await db.query(
            `
            UPDATE
            Collaboration_Task_T
            SET expected_delivery_date = ?     
            WHERE project_id = ? AND p_user_id = ? AND assigned_date = ? AND task_name = ?
        `,
            [
                validatedData.data.newExpectedDeliveryDate,
                validatedData.data.projectId,
                validatedData.data.pUserId,
                validatedData.data.assignedDate,
                validatedData.data.taskName,
            ]
        );
        await db.end();
        return Response.json({
            newExpectedDeliveryDate: validatedData.data.newExpectedDeliveryDate,
        });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
