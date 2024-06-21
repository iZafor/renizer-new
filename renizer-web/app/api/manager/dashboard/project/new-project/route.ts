import { NextRequest } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { NewProjectFormSchema } from "@/lib/schemas";
import { Project } from "@/lib/definitions";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const validatedData = await NewProjectFormSchema.safeParseAsync({
        name: formData.get("name"),
        description: formData.get("description"),
        managerId: formData.get("managerId"),
        restrictedToOrganization:
            formData.get("restrictedToOrganization") === "on",
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    const data = validatedData.data;
    const newProject: Project = {
        project_id: uuid(),
        name: data.name,
        description: data.description!,
        status: "Not Started Yet",
        energy_sold: 0,
        energy_produced: 0,
        creation_date: new Date(),
    };

    try {
        await pool.query(
            `INSERT INTO Project_T (project_id, name, description, org_restricted, m_p_user_id, creation_date)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                newProject.project_id,
                newProject.name,
                newProject.description,
                data.restrictedToOrganization,
                data.managerId,
                newProject.creation_date,
            ]
        );
        return Response.json({ newProject });
    } catch (error) {
        console.error(error);
        return Response.json({
            message: "Unexpected error! Please try again later.",
        });
    }
}
