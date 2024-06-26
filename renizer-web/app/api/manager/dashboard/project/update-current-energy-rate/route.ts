import { NextRequest } from "next/server";
import { UpdateCurrentEnergyRateFormSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
    const formData = await req.formData();
    const validatedData =
        await UpdateCurrentEnergyRateFormSchema.safeParseAsync({
            value: Number(formData.get("value")),
            projectId: formData.get("projectId"),
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
            Project_T
            SET energy_rate_kwh = ?     
            WHERE project_id = ?
        `,
            [validatedData.data.value, validatedData.data.projectId]
        );
        await db.end();
        return Response.json({ updatedValue: validatedData.data.value });
    } catch (error) {
        console.error(error);
        return Response.json({ message: (error as Error).message });
    }
}
