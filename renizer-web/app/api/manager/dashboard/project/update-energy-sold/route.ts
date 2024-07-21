import { NextRequest } from "next/server";
import { UpdateSoldEnergyFormSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

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

    const { value, projectId } = validatedData.data;
    try {
        await db.query(
            `
            UPDATE
            Project_T
            SET energy_sold_wh = ?     
            WHERE project_id = ?;

            INSERT INTO Project_Energy_Sold_Update_History_T VALUES (?, ?, ?);
        `,
            [value, projectId, projectId, value, new Date()]
        );
        await db.end();
        return Response.json({ updatedValue: value });
    } catch (error) {
        console.error(error);
        return Response.json({ message: (error as Error).message });
    }
}
