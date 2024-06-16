import { ProjectDetails } from "@/lib/definitions";
import { cn, formatEnergyUnit } from "@/lib/utils";

export default function ProjectInfo({
    project,
}: {
    project: ProjectDetails | undefined;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <InfoContainer
                title="Creation Date"
                data={new Date(project?.creation_date || "").toLocaleDateString(
                    "en-us",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                )}
            />
            <InfoContainer
                title="Project Started at"
                data={
                    project?.start_date
                        ? new Date(project.start_date).toLocaleDateString(
                              "en-us",
                              {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                              }
                          )
                        : "Not Started Yet"
                }
            />
            <InfoContainer
                title="Current Energy Rate"
                data={`$${project?.energy_rate}`}
            />{" "}
            <InfoContainer
                title="Investment Received"
                data={`$${project?.investment_received}`}
            />
            <InfoContainer
                title="Energy Produced"
                data={formatEnergyUnit(Number(project?.energy_produced))}
            />
            <InfoContainer
                title="Energy Sold"
                data={formatEnergyUnit(Number(project?.energy_sold))}
            />
        </div>
    );
}

interface InfoContainer {
    className?: string;
    title: string;
    data: string;
}

function InfoContainer({ className, title, data }: InfoContainer) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <h3 className="text-sm text-muted-foreground">{title}</h3>
            <p className="font-semibold leading-none tracking-tight">{data}</p>
        </div>
    );
}
