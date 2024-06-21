"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import CollaborationTable from "@/components/ui/manager/project/collaboration-table/collaboration-table";
import { columns } from "@/components/ui/manager/project/collaboration-table/columns";
import NewCollaboratorDialog from "./new-collaborator-dialog";
import { useQuery } from "@tanstack/react-query";
import { ProjectIdContext } from "@/lib/contexts/manager";
import {
    useCollaboratorsDetailsQueryOptions,
    useProjectCollaborationsQueryOptions,
} from "@/lib/hooks/manager/use-project-query";

export default function ProjectCollaborators() {
    const projectId = useContext(ProjectIdContext);
    const { data: collaborations } = useQuery(
        useProjectCollaborationsQueryOptions(projectId)
    );
    const { data: collaborators } = useQuery(
        useCollaboratorsDetailsQueryOptions(projectId)
    );

    const [uniqueContributors, setUniqueContributors] = useState<string[]>([]);

    useEffect(() => {
        const collaboratorMap: { [key: string]: string } = {};
        for (const co of collaborations!) {
            collaboratorMap[co.p_user_id] = co.name;
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
                <DialogTrigger asChild>
                    <Button variant="outline">View All</Button>
                </DialogTrigger>
                <DialogContent className="min-w-[70rem]">
                    <div className="mt-6">
                        <CollaborationTable
                            data={collaborations!}
                            columns={columns}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <NewCollaboratorDialog
                projectId={projectId}
                collaborators={collaborators!}
            />
        </div>
    );
}
