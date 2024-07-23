import { parseToPlainObject, db, QueryResult } from "@/lib/db";
import { ProjectCollaboration } from "@/lib/definitions";
import { NewCollaboratorFormSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const validatedData = await NewCollaboratorFormSchema.safeParseAsync({
        projectId: formData.get("projectId"),
        contributor: formData.get("contributor"),
        role: formData.get("role"),
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    try {
        // check for role existence
        const res = await db
            .query<QueryResult[][]>(
                `
            SELECT * 
            FROM Collaboration_T
            WHERE project_id = ? AND role = ?;

            SELECT CONCAT(first_name, ' ', last_name) AS name, working_experience, hourly_rate
            FROM User_T AS a INNER JOIN Project_Associate_T AS b ON a.user_id = b.p_user_id 
            WHERE user_id = ?;
            `,
                [
                    validatedData.data.projectId,
                    validatedData.data.role,
                    validatedData.data.contributor,
                ]
            )
            .then((rows) => rows.map(parseToPlainObject));

        if (res[0].length) {
            return Response.json({ message: "Role already exits." });
        }
        if (!res[1].length || !res[1][0].name) {
            return Response.json({ message: "Contributor doesn't exit." });
        }

        const newCollaboration: ProjectCollaboration = {
            name: res[1][0].name,
            c_p_user_id: validatedData.data.contributor,
            project_id: validatedData.data.projectId,
            start_date: new Date(),
            role: validatedData.data.role,
            total_assigned_tasks: 0,
            tasks_in_progress: 0,
            tasks_completed: 0,
            hourly_rate: res[1][0].hourly_rate,
            working_experience: res[1][0].working_experience,
        };
        await db.query(
            `
            INSERT INTO Collaboration_T (c_p_user_id, project_id, start_date, role)
            VALUES(?, ?, ?, ?)
            `,
            [
                newCollaboration.c_p_user_id,
                newCollaboration.project_id,
                newCollaboration.start_date,
                newCollaboration.role,
            ]
        );

        await db.end();
        return Response.json({ newCollaboration });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
