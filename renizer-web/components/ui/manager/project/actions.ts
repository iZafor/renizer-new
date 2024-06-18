"use server";

import {
    NewCollaboratorFormState,
    NewCollaboratorFormSchema,
} from "@/lib/schemas";

export async function addNewCollaborator(
    _: NewCollaboratorFormState,
    formData: FormData
) {
    const validatedData = await NewCollaboratorFormSchema.safeParseAsync({
        contributor: formData.get("contributor"),
        role: formData.get("role"),
    });

    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    return { message: "success" };
}
