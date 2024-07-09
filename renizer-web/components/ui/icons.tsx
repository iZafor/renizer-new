import { cn } from "@/lib/utils";
import {
    Timer,
    CircleCheck,
    CircleX,
    CircleEllipsis,
    ArrowUp,
    ArrowDown,
    ArrowRight,
    AlertCircle,
    CircleDashed,
    CheckCircle,
    Wind,
    Flame,
    LeafyGreen,
    Waves,
    Sun,
    Fuel,
    PauseCircle,
} from "lucide-react";

export function StatusIcon({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    switch (status) {
        case "In Progress":
            return <Timer className={cn("size-4", className)} />;
        case "Done":
            return <CircleCheck className={cn("size-4", className)} />;
        case "Completed":
            return <CircleCheck className={cn("size-4", className)} />;
        case "Cancelled":
            return <CircleX className={cn("size-4", className)} />;
        case "Not Started Yet":
            return <CircleEllipsis className={cn("size-4", className)} />;
        case "Overdue":
            return <AlertCircle className={cn("size-4", className)} />;
        case "Pending":
            return <CircleDashed className={cn("size-4", className)} />;
        case "Approved":
            return <CheckCircle className={cn("size-4", className)} />;
        case "Rejected":
            return <CircleX className={cn("size-4", className)} />;
        case "On Hold":
            return <PauseCircle className={cn("size-4", className)} />;
    }
}

export function PriorityIcon({
    priority,
    className,
}: {
    priority: string;
    className?: string;
}) {
    switch (priority) {
        case "High":
            return <ArrowUp className={cn("size-4", className)} />;
        case "Low":
            return <ArrowDown className={cn("size-4", className)} />;
        case "Medium":
            return <ArrowRight className={cn("size-4", className)} />;
    }
}

export function EnergySourceIcon({
    source,
    className,
}: {
    source: string;
    className?: string;
}) {
    switch (source) {
        case "Wind":
            return <Wind className={cn("size-4", className)} />;
        case "Geothermal":
            return <Flame className={cn("size-4", className)} />;
        case "Biomass":
            return <LeafyGreen className={cn("size-4", className)} />;
        case "Tidal":
            return <Waves className={cn("size-4", className)} />;
        case "Wave":
            return <Waves className={cn("size-4", className)} />;
        case "Solar":
            return <Sun className={cn("size-4", className)} />;
        case "Hydrogen":
            return <Fuel className={cn("size-4", className)} />;
    }
}
