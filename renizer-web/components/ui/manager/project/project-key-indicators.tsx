import { ProjectDetails } from "@/lib/definitions";
import { formatEnergyUnit } from "@/lib/utils";
import { format } from "date-fns";
import {
    KeyIndicatorContainer,
    EditableKeyIndicatorContainer,
} from "./key-indicator-container";
import { useQueryClient } from "@tanstack/react-query";
import { useProjectDetailsQueryOptions } from "@/lib/hooks/manager/use-project-query";
import { useContext } from "react";
import { ProjectIdContext } from "@/lib/contexts/manager";

export default function ProjectKeyIndicators({
    project,
}: {
    project: ProjectDetails | undefined;
}) {
    const projectId = useContext(ProjectIdContext);
    const projectDetailsQueryKey =
        useProjectDetailsQueryOptions(projectId).queryKey;
    const queryClient = useQueryClient();

    return (
        <div className="grid grid-cols-2 gap-4">
            <KeyIndicatorContainer
                title="Creation Date"
                data={format(project?.creation_date!, "PP")}
            />
            <KeyIndicatorContainer
                title="Project Started at"
                data={
                    project?.start_date
                        ? format(project.start_date, "PP")
                        : "Not Started Yet"
                }
            />
            <KeyIndicatorContainer
                title="Investment Received"
                data={`$${project?.investment_received}`}
            />
            <EditableKeyIndicatorContainer
                title="Current Energy Rate"
                data={project?.energy_rate}
                formatter={(data) => `$${data}`}
                mutationFn={async (formData) => {
                    return await fetch(
                        "/api/manager/dashboard/project/update-current-energy-rate",
                        {
                            method: "PATCH",
                            body: formData,
                        }
                    ).then((res) => res.json());
                }}
                onSuccess={(data) => {
                    queryClient.setQueryData(
                        projectDetailsQueryKey,
                        (old: ProjectDetails) => ({
                            ...old,
                            energy_rate: data?.updatedValue,
                        })
                    );
                }}
            />
            <EditableKeyIndicatorContainer
                title="Energy Produced"
                data={project?.energy_produced}
                formatter={(data) => formatEnergyUnit((data as number) || 0)}
                mutationFn={async (formData) => {
                    return await fetch(
                        "/api/manager/dashboard/project/update-produced-energy",
                        {
                            method: "PATCH",
                            body: formData,
                        }
                    ).then((res) => res.json());
                }}
                onSuccess={(data) => {
                    queryClient.setQueryData(
                        projectDetailsQueryKey,
                        (old: ProjectDetails) => ({
                            ...old,
                            energy_produced: data?.updatedValue,
                        })
                    );
                }}
            />
            <EditableKeyIndicatorContainer
                title="Energy Sold"
                data={project?.energy_sold}
                formatter={(data) => formatEnergyUnit((data as number) || 0)}
                mutationFn={async (formData) => {
                    return await fetch(
                        "/api/manager/dashboard/project/update-energy-sold",
                        {
                            method: "PATCH",
                            body: formData,
                        }
                    ).then((res) => res.json());
                }}
                onSuccess={(data) => {
                    queryClient.setQueryData(
                        projectDetailsQueryKey,
                        (old: ProjectDetails) => ({
                            ...old,
                            energy_sold: data?.updatedValue,
                        })
                    );
                }}
            />
        </div>
    );
}
