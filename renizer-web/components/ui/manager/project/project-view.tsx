"use client";

import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import ProjectInfo from "@/components/ui/manager/project/project-info";
import ProjectStakeHolders from "@/components/ui/manager/project/project-stakeholders";
import { columns } from "@/components/ui/manager/project/task-table/columns";
import { useProjectDataQueryOptions } from "@/lib/hooks/manager/use-project-data-query";
import DataTable from "@/components/ui/data-table";
import TasksTableToolbar from "./task-table/tasks-table-toolbar";
import { ProjectIdContext } from "@/lib/contexts/manager";

interface ProjectViewProps {
    id: string;
}

export default function ProjectView({ id }: ProjectViewProps) {
    const { data } = useQuery(useProjectDataQueryOptions(id));
    const project = data?.projectDetails;
    const tasks = data?.tasks || [];

    return (
        <ProjectIdContext.Provider value={id}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{project?.name}</CardTitle>
                    <CardDescription>{project?.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProjectInfo project={project} />
                    <ProjectStakeHolders />
                    <DataTable
                        columns={columns}
                        data={tasks}
                        toolbar={TasksTableToolbar}
                    />
                </CardContent>
            </Card>
        </ProjectIdContext.Provider>
    );
}
