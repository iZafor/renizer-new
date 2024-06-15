"use server";

import { v4 as uuid } from "uuid";
import { pool } from "@/lib/db";
import { NewProjectFromState, NewProjectFormSchema } from "@/lib/schemas";
import { Project } from "@/lib/definitions";

export async function createNewProject(
    _: NewProjectFromState,
    formData: FormData
): Promise<NewProjectFromState> {
    const validatedData = await NewProjectFormSchema.safeParseAsync({
        name: formData.get("name"),
        description: formData.get("description"),
        restrictedToOrganization:
            formData?.get("restrictedToOrganization") === "on",
    });

    if (!validatedData.success) {
        return { errors: validatedData.error.flatten().fieldErrors };
    }

    const data = validatedData.data;
    const newProject: Project = {
        project_id: uuid(),
        name: data.name,
        description: data.description!,
        status: "Not Started Yet",
        energy_sold: 0,
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
                // Todo: use the user id of the logged in manger
                "928fd03d-26dc-11ef-b68d-0045e2d4f24d",
                newProject.creation_date,
            ]
        );
        return { newProject };
    } catch (error) {
        console.error(error);
        return { message: "Unexpected error! Please try again later." };
    }
}
