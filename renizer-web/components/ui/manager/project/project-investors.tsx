"use client";

import { ProjectInvestment } from "@/lib/definitions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/ui/manager/project/investment-table/columns";
import InvestmentTable from "@/components/ui/manager/project/investment-table/investment-table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface ProjectInvestorsProps {
    investments: ProjectInvestment[];
}

export default function ProjectInvestors({
    investments,
}: ProjectInvestorsProps) {
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
            <Button variant="outline" size="icon">
                <PlusIcon className="size-4" />
            </Button>
        </div>
    );
}
