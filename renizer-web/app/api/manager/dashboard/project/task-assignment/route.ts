import { NextRequest } from "next/server";
import { db, parseToPlainObject, QueryResult } from "@/lib/db";
import { TaskAssignmentFormSchema } from "@/lib/schemas";
import { isNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validatedData = await TaskAssignmentFormSchema.safeParseAsync({
        projectId: body.projectId,
        cpUserId: body.cpUserId,
        taskName: body.taskName,
        assignedDate: new Date(body.assignedDate),
        expectedHour: isNumber(body.expectedHour)
            ? Number(body.expectedHour)
            : body.expectedHour,
        expectedDeliveryDate: new Date(body.expectedDeliveryDate),
        priority: body.priority,
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    const {
        projectId,
        cpUserId,
        taskName,
        assignedDate,
        expectedHour,
        expectedDeliveryDate,
        priority,
    } = validatedData.data;
    const status = "Not Started Yet";
    const deliveryDate = null;
    const hourTaken = 0;

    try {
        const res = await db
            .query<QueryResult[]>(
                `
            SELECT CONCAT(first_name, ' ', last_name) AS assignee, role
            FROM Collaboration_T AS a INNER JOIN User_T AS b ON a.c_p_user_id = b.user_id
            WHERE project_id = ? AND user_id = ?
            `,
                [projectId, cpUserId]
            )
            .then(parseToPlainObject);
        if (!res || !res[0]) {
            return Response.json({ message: "Assignee doesn't exist." });
        }
        const { assignee, role } = res[0];
        await db.query(
            `
            INSERT INTO Collaboration_Task_T VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

            INSERT INTO Collaboration_Task_Collaborator_Update_History_T VALUES (?, ?, ?, ?);

            INSERT INTO Collaboration_Task_Status_Update_History_T VALUES (?, ?, ?, ?, ?);

            INSERT INTO Collaboration_Task_Priority_Update_History_T VALUES (?, ?, ?, ?, ?);

            INSERT INTO Collaboration_Task_Expected_Delivery_Date_Update_History_T VALUES (?, ?, ?, ?, ?);
            `,
            [
                cpUserId,
                projectId,
                taskName,
                assignedDate,
                status,
                expectedHour,
                expectedDeliveryDate,
                hourTaken,
                deliveryDate,
                priority,
                cpUserId,
                projectId,
                taskName,
                assignedDate,
                cpUserId,
                projectId,
                taskName,
                assignedDate,
                status,
                cpUserId,
                projectId,
                taskName,
                assignedDate,
                priority,
                cpUserId,
                projectId,
                taskName,
                assignedDate,
                expectedDeliveryDate,
            ]
        );
        await db.end();
        return Response.json({
            task: {
                project_id: projectId,
                c_p_user_id: cpUserId,
                assignee: assignee,
                role: role,
                task: taskName,
                status: status,
                assigned_date: assignedDate,
                expected_hour: expectedHour,
                expected_delivery_date: expectedDeliveryDate,
                hour_taken: hourTaken,
                delivery_date: deliveryDate,
                priority: priority,
            },
        });
    } catch (error) {
        console.error(error);
        return Response.json({
            message: "Unexpected error occurred. Please try again later.",
        });
    }
}
