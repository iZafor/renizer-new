import { parseToPlainObject, db, QueryResult } from "@/lib/db";
import { ProjectInvestment } from "@/lib/definitions";
import { InvestmentProposalFormSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const validatedData = await InvestmentProposalFormSchema.safeParseAsync({
        projectId: formData.get("projectId"),
        investor: formData.get("investor"),
        amount: Number(formData.get("amount")),
    });

    if (!validatedData.success) {
        return Response.json({
            errors: validatedData.error.flatten().fieldErrors,
        });
    }

    try {
        const res = await db
            .query<QueryResult[][]>(
                `
            SELECT CONCAT(first_name, ' ', last_name) as name
            FROM User_T
            WHERE user_id = ?;

            SELECT name
            FROM Project_T
            WHERE project_id = ?;
            `,
                [validatedData.data.investor, validatedData.data.projectId]
            )
            .then((rows) => rows.map(parseToPlainObject));

        if (!res[0][0] || !res[0][0].name) {
            return Response.json({ message: "Investor doesn't exist." });
        }
        if (!res[1][0] || !res[1][0].name) {
            return Response.json({ message: "Project doesn't exist." });
        }

        const newInvestment: ProjectInvestment = {
            i_user_id: validatedData.data.investor,
            investor: res[0][0].name,
            project_id: validatedData.data.projectId,
            investment_amount: validatedData.data.amount,
            proposal_date: new Date(),
            proposal_status: "Pending",
        };
        await db.query(
            `
            INSERT INTO Investment_Proposal_T (i_user_id, project_id, investment_amount, proposal_date)
            VALUES(?, ?, ?, ?)
            `,
            [
                newInvestment.i_user_id,
                newInvestment.project_id,
                newInvestment.investment_amount,
                newInvestment.proposal_date,
            ]
        );

        await db.end();
        return Response.json({ newInvestment });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Unexpected error occurred." });
    }
}
