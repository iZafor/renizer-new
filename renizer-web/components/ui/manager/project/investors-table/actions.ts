"use server";

import {
    InvestmentProposalFormState,
    InvestmentProposalFormSchema,
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
