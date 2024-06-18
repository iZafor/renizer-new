"use server";

import {
    InvestmentProposalFormState,
    InvestmentProposalFormSchema,
    NewCollaboratorFormState,
    NewCollaboratorFormSchema,
} from "@/lib/schemas";

export async function proposeInvestment(
    _: InvestmentProposalFormState,
    formData: FormData
) {
    const validatedData = await InvestmentProposalFormSchema.safeParseAsync({
        investor: formData.get("investor") || "",
        amount: Number(formData.get("amount") || "0"),
    });

    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    console.log(validatedData.data);

    return { message: "success" };
}

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

    // TODO: check for pre-existence of role

    console.log(validatedData.data);

    return { message: "success" };
}
