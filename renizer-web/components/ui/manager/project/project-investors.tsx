"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/ui/manager/project/investment-table/columns";
import InvestmentTable from "@/components/ui/manager/project/investment-table/investment-table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useContext, useEffect, useState } from "react";
import InvestmentProposalDialog from "@/components/ui/manager/project/investment-proposal-dialog";
import { useProjectDataQueryOptions } from "@/lib/hooks/use-project-data-query";
import { useQuery } from "@tanstack/react-query";
import { ProjectIdContext } from "@/lib/contexts/project";

export default function ProjectInvestors() {
    const projectId = useContext(ProjectIdContext);
    const { data } = useQuery(useProjectDataQueryOptions(projectId));
    // TODO: Handle empty states
    const investments = data?.investments!;
    const investors = data?.investors!;

    const [uniqueInvestors, setUniqueInvestors] = useState<string[]>([]);

    useEffect(() => {
        const investorMap: { [key: string]: string } = {};
        for (const inv of investments) {
            investorMap[inv.i_user_id] = inv.investor;
        }
        setUniqueInvestors(Object.values(investorMap));
    }, [investments]);

    return (
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
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">View All</Button>
                </DialogTrigger>
                <DialogContent className="min-w-[50rem]">
                    <InvestmentTable data={investments} columns={columns} />
                </DialogContent>
            </Dialog>
            <InvestmentProposalDialog investors={investors} />
        </div>
    );
}
