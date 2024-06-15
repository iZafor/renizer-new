"use client";

import { useEffect, useState } from "react";
import ProjectsTable from "@/components/ui/manager/projects/projects-table";
import { Project } from "@/lib/definitions";
import { columns } from "@/components/ui/manager/projects/columns";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function fetchData() {
            const newProjects: Project[] = await fetch(
                "/api/manager/dashboard/projects"
            ).then((res) => res.json());
            setProjects(newProjects);
        }
        fetchData();
    }, []);

    return (
        <ProjectsTable
            data={projects}
            columns={columns}
            onAddNewProject={(newProject) =>
                setProjects((prev) => [newProject, ...prev])
            }
        />
    );
}
