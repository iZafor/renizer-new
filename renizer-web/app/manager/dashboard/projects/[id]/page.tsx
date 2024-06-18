"use client";

import {
    CollaboratorDetails,
    InvestorDetails,
    ProjectCollaboration,
    ProjectDetails,
    ProjectInvestment,
    ProjectTask,
} from "@/lib/definitions";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import ProjectLoadingSkeleton from "@/components/ui/manager/project/project-loading-skeleton";
import ProjectInfo from "@/components/ui/manager/project/project-info";
import ProjectStakeHolders from "@/components/ui/manager/project/project-stakeholder";
import { columns } from "@/components/ui/manager/project/task-table/columns";
import TasksTable from "@/components/ui/manager/project/task-table/tasks-table";

async function fetchData(id: string) {
    return await fetch(`/api/manager/dashboard/projects/${id}`).then((res) =>
        res.json()
    );
}

interface ProjectProps {
    params: {
        id: string;
    };
}

export default function Project({ params: { id } }: ProjectProps) {
    const { data, isLoading } = useQuery(["project", id], () => fetchData(id));

    const [project, setProject] = useState<ProjectDetails>();
    const [collaborators, setCollaborators] = useState<CollaboratorDetails[]>([]);
    const [collaborations, setCollaborations] = useState<
        ProjectCollaboration[]
    >([]);
    const [investors, setInvestors] = useState<InvestorDetails[]>([]);
    const [investments, setInvestments] = useState<ProjectInvestment[]>([]);
    const [tasks, setTasks] = useState<ProjectTask[]>([]);

    useEffect(() => {
        if (data) {
            setProject(data[0][0]);
            setCollaborators(data[1]);
            setCollaborations(data[2]);
            setInvestors(data[3]);
            setInvestments(data[4]);
            setTasks(data[5]);
        }
    }, [data]);

    if (isLoading) {
        return <ProjectLoadingSkeleton />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{project?.name}</CardTitle>
                <CardDescription>{project?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ProjectInfo project={project} />
                <ProjectStakeHolders
                    collaborators={collaborators}
                    collaborations={collaborations}
                    investors={investors}
                    investments={investments}
                />
                <TasksTable data={tasks} columns={columns} />
            </CardContent>
        </Card>
    );
}
