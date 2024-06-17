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
            return <Timer className={cn("h-4 w-4", className)} />;
        case "Done":
            return <CircleCheck className={cn("h-4 w-4", className)} />;
        case "Canceled":
            return <CircleX className={cn("h-4 w-4", className)} />;
        case "Not Started Yet":
            return <CircleEllipsis className={cn("h-4 w-4", className)} />;
        case "Overdue":
            return <AlertCircle className={cn("h-4 w-4", className)} />;
        case "Pending":
            return <CircleDashed className={cn("h-4 w-4", className)} />;
        case "Approved":
            return <CheckCircle className={cn("h-4 w-4", className)} />;
        case "Rejected":
            return <CircleX className={cn("h-4 w-4", className)} />;
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
            return <ArrowUp className={cn("h-4 w-4", className)} />;
        case "Low":
            return <ArrowDown className={cn("h-4 w-4", className)} />;
        case "Medium":
            return <ArrowRight className={cn("h-4 w-4", className)} />;
    }
}
