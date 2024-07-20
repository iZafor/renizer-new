"use client";

import OverviewCard from "@/components/ui/overview-card";
import { ManagerIdContext } from "@/lib/contexts/manager";
import { useProjectsOverviewDataQueryOptions } from "@/lib/hooks/manager/use-analytics-query";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertCircle, CircleCheck, Timer } from "lucide-react";
import { useContext } from "react";

export default function ProjectOverview() {
    const managerId = useContext(ManagerIdContext);
    const { data: values } = useQuery(
        useProjectsOverviewDataQueryOptions(managerId)
    );

    return (
        <div className="space-y-2">
            <h2>Project Status Summary</h2>
            <div className="w-full flex justify-between gap-4">
                <OverviewCard
                    className="w-1/4"
                    title="Active Projects"
                    titleIcon={Activity}
                    description={`${values!.activeProjects}`}
                />
                <OverviewCard
                    className="w-1/4"
                    title="Projects Completed"
                    titleIcon={CircleCheck}
                    description={`${values!.completedProjects}`}
                />
                <OverviewCard
                    className="w-1/4"
                    title="Projects In Progress"
                    titleIcon={Timer}
                    description={`${values!.projectsInProgress}`}
                />
                <OverviewCard
                    className="w-1/4"
                    title="Projects Overdue"
                    titleIcon={AlertCircle}
                    description={`${values!.projectsInOverdue}`}
                />
            </div>
        </div>
    );
}
