"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import NewCollaboratorDialog from "./new-collaborator-dialog";
import { useQuery } from "@tanstack/react-query";
import { ProjectIdContext } from "@/lib/contexts/manager";
import { useProjectCollaborationsQueryOptions } from "@/lib/hooks/manager/use-project-query";
import { useProjectTasksQueryOptions } from "@/lib/hooks/manager/use-project-query";
import { columns as taskColumns } from "@/components/ui/manager/project/task-table/columns";
import TasksTableToolbar from "./task-table/tasks-table-toolbar";

export default function ProjectCollaborators() {
    const projectId = useContext(ProjectIdContext);
    const { data: collaborations } = useQuery(
        useProjectCollaborationsQueryOptions(projectId)
    );
    const { data: tasks } = useQuery(useProjectTasksQueryOptions(projectId));
    const [uniqueContributors, setUniqueContributors] = useState<string[]>([]);

    useEffect(() => {
        const collaboratorMap: { [key: string]: string } = {};
        for (const co of collaborations!) {
            collaboratorMap[co.c_p_user_id] = co.name;
        }
        setUniqueContributors(Object.values(collaboratorMap));
    }, [collaborations]);

    return (
        <div className="flex flex-col gap-4">
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
                <NewCollaboratorDialog />
            </div>
            <DataTable
                columns={taskColumns}
                data={tasks!}
                toolbar={TasksTableToolbar}
            />
        </div>
    );
}
