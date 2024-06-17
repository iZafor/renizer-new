"use client";

import {
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
    const [collaborations, setCollaborations] = useState<
        ProjectCollaboration[]
    >([]);
    const [investors, setInvestors] = useState<InvestorDetails[]>([]);
    const [investments, setInvestments] = useState<ProjectInvestment[]>([]);
    const [tasks, setTasks] = useState<ProjectTask[]>([]);

    useEffect(() => {
        if (data) {
            setProject(data[0][0]);
            setCollaborations(data[1]);
            setInvestors(data[2]);
            setInvestments(data[3]);
            setTasks(data[4]);
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
                    collaborations={collaborations}
                    investors={investors}
                    investments={investments}
                />
                <TasksTable data={tasks} columns={columns} />
            </CardContent>
        </Card>
    );
}
