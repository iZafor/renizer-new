"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { columns } from "@/components/ui/manager/project/investment-table/columns";
import DataTable from "@/components/ui/data-table";
import InvestmentTableToolbar from "./investment-table/investment-table-toolbar";
import { useContext, useEffect, useState } from "react";
import InvestmentProposalDialog from "@/components/ui/manager/project/investment-proposal-dialog";
import { useQuery } from "@tanstack/react-query";
import { ProjectIdContext } from "@/lib/contexts/manager";
import { useProjectInvestmentsQueryOptions } from "@/lib/hooks/manager/use-project-query";

export default function ProjectInvestors() {
    const projectId = useContext(ProjectIdContext);
    const { data: investments } = useQuery(
        useProjectInvestmentsQueryOptions(projectId)
    );

    const [uniqueInvestors, setUniqueInvestors] = useState<string[]>([]);

    useEffect(() => {
        const investorMap: { [key: string]: string } = {};
        for (const inv of investments!) {
            investorMap[inv.i_user_id] = inv.investor;
        }
        setUniqueInvestors(Object.values(investorMap));
    }, [investments]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex space-x-1 items-center">
                <div className="flex -space-x-3">
                    {uniqueInvestors.slice(0, 5).map((inv, idx) => (
                        <Avatar key={inv + idx}>
                            <AvatarImage src="" alt="" />
                            <AvatarFallback>{getInitial(inv)}</AvatarFallback>
                        </Avatar>
                    ))}
                    {uniqueInvestors.length > 5 && (
                        <Avatar>
                            <AvatarFallback>
                                +{uniqueInvestors.length - 5}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
                <InvestmentProposalDialog />
            </div>
            <DataTable
                className="max-h-[38.5rem]"
                columns={columns}
                data={investments!}
                toolbar={InvestmentTableToolbar}
            />
        </div>
    );
}
