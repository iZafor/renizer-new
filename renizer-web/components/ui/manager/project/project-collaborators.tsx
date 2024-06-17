"use client";

import { ProjectCollaboration } from "@/lib/definitions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import CollaborationTable from "@/components/ui/manager/project/collaboration-table/collaboration-table";
import { columns } from "@/components/ui/manager/project/collaboration-table/columns";

interface ProjectCollaboratorsProps {
    collaborations: ProjectCollaboration[];
}

export default function ProjectCollaborators({
    collaborations,
}: ProjectCollaboratorsProps) {
    const [uniqueContributors, setUniqueContributors] = useState<string[]>([]);

    useEffect(() => {
        const collaboratorMap: { [key: string]: string } = {};
        for (const co of collaborations) {
            collaboratorMap[co.p_user_id] = co.contributor;
        }
        setUniqueContributors(Object.values(collaboratorMap));
    }, [collaborations]);

    return (
        <div className="flex space-x-1 items-center">
            <div className="flex -space-x-3">
                {uniqueContributors.slice(0, 5).map((con, idx) => (
                    <Avatar key={con + idx}>
                        <AvatarImage src="" alt="" />
                        <AvatarFallback>{getInitial(con)}</AvatarFallback>
                    </Avatar>
                ))}
                {uniqueContributors.length > 5 && (
                    <Avatar>
                        <AvatarFallback>
                            +{uniqueContributors.length - 5}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
            <Dialog>
                <DialogTrigger>
                    <Button variant="outline">View All</Button>
                </DialogTrigger>
                <DialogContent className="min-w-[70rem]">
                    <CollaborationTable
                        data={collaborations}
                        columns={columns}
                    />
                </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon">
                <PlusIcon className="size-4" />
            </Button>
        </div>
    );
}
