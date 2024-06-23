"use client";

import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import ProjectKeyIndicators from "@/components/ui/manager/project/project-key-indicators";
import ProjectStakeHolders from "@/components/ui/manager/project/project-stakeholders";
import { ProjectIdContext } from "@/lib/contexts/manager";
import {
    useProjectDetailsQueryOptions,
} from "@/lib/hooks/manager/use-project-query";

interface ProjectViewProps {
    id: string;
}

export default function ProjectView({ id }: ProjectViewProps) {
    const { data: project } = useQuery(useProjectDetailsQueryOptions(id));
    return (
        <ProjectIdContext.Provider value={id}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{project?.name}</CardTitle>
                    <CardDescription>{project?.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProjectKeyIndicators project={project} />
                    <ProjectStakeHolders />
                </CardContent>
            </Card>
        </ProjectIdContext.Provider>
    );
}
