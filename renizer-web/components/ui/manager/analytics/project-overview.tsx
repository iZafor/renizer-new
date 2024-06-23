"use client";

import OverviewCard from "@/components/ui/overview-card";
import { ProjectOverviewAnalytics } from "@/lib/definitions";
import { Activity, AlertCircle, CircleCheck, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const defaultState: ProjectOverviewAnalytics = {
    activeProjects: 0,
    completedProjects: 0,
    projectsInOverdue: 0,
    projectsInProgress: 0,
};

export default function ProjectOverview() {
    const [values, setValues] = useState(defaultState);

    useEffect(() => {
        async function fetchData() {
            const newValues: ProjectOverviewAnalytics = await fetch(
                `/api/manager/dashboard/analytics/overview`
            ).then((res) => res.json());
            setValues(newValues);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full flex justify-between gap-4">
            <OverviewCard
                className="w-1/4"
                title="Active Projects"
                titleIcon={Activity}
                description={`${values.activeProjects}`}
            />
            <OverviewCard
                className="w-1/4"
                title="Projects Completed"
                titleIcon={CircleCheck}
                description={`${values.completedProjects}`}
            />
            <OverviewCard
                className="w-1/4"
                title="Projects In Progress"
                titleIcon={Timer}
                description={`${values.projectsInProgress}`}
            />
            <OverviewCard
                className="w-1/4"
                title="Projects Overdue"
                titleIcon={AlertCircle}
                description={`${values.projectsInOverdue}`}
            />
        </div>
    );
}
