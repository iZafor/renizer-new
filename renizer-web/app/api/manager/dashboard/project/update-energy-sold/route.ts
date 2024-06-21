import { NextRequest } from "next/server";
import { UpdateSoldEnergyFormSchema } from "@/lib/schemas";
import { pool } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const formData = await req.formData();
    const validatedData = await UpdateSoldEnergyFormSchema.safeParseAsync({
        value: Number(formData.get("value")),
        projectId: formData.get("projectId"),
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
            Project_T
            SET energy_sold_kwh = ?     
            WHERE project_id = ?
        `,
            [validatedData.data.value, validatedData.data.projectId]
        );
        return Response.json({ updatedValue: validatedData.data.value });
    } catch (error) {
        console.error(error);
        return Response.json({ message: (error as Error).message });
    }
}
