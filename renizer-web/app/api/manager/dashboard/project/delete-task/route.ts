import { pool } from "@/lib/db";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    try {
        await pool.query(
            `
            DELETE FROM
            Collaboration_Task_T
            WHERE p_user_id = ? AND project_id = ? AND task_name = ? AND assigned_date = ?    
        `,
            [body.pUserId, body.projectId, body.taskName, new Date(body.assignedDate)]
        );
        return Response.json({
            message: `The task "${body.taskName}" has been deleted successfully`,
            status: true,
        });
    } catch (error) {
        console.error(error);
        return Response.json({
            message: `An error occurred while deleting the task "${body.taskName}"`,
            status: false,
        });
    }
}
