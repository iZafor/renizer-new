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
    Building,
    User,
    Wind,
    Flame,
    LeafyGreen,
    Waves,
    Sun,
    Fuel,
    PauseCircle,
} from "lucide-react";

export const energySources = [
    {
        value: "Wind",
        label: "Wind",
        icon: Wind,        
    },
    {
        value: "Geothermal",
        label: "Geothermal",
        icon: Flame,        
    },
    {
        value: "Biomass",
        label: "Biomass",
        icon: LeafyGreen,        
    },
    {
        value: "Tidal",
        label: "Tidal",
        icon: Waves,        
    },
    {
        value: "Solar",
        label: "Solar",
        icon: Sun,        
    },
    {
        value: "Hydrogen",
        label: "Hydrogen",
        icon: Fuel,        
    },
]

export const statuses = [
    {
        value: "In Progress",
        label: "In Progress",
        icon: Timer,
    },
    {
        value: "Completed",
        label: "Completed",
        icon: CircleCheck,
    },
    {
        value: "Canceled",
        label: "Canceled",
        icon: CircleX,
    },
    {
        value: "Not Started Yet",
        label: "Not Started Yet",
        icon: CircleEllipsis,
    },
    {
        value: "Overdue",
        label: "Overdue",
        icon: AlertCircle,
    },
    {
        value: "On Hold",
        label: "On Hold",
        icon: PauseCircle,
    },
];

export const priorities = [
    {
        value: "High",
        label: "High",
        icon: ArrowUp,
    },
    {
        value: "Medium",
        label: "Medium",
        icon: ArrowRight,
    },
    {
        value: "Low",
        label: "Low",
        icon: ArrowDown,
    },
];

export const investmentProposalStatuses = [
    {
        value: "Pending",
        label: "Pending",
        icon: CircleDashed,
    },
    {
        value: "Approved",
        label: "Approved",
        icon: CheckCircle,
    },
    {
        value: "Rejected",
        label: "Rejected",
        icon: CircleX,
    },
];

export const investorTypes = [
    {
        value: "Individual",
        label: "Individual",
        icon: User,
    },
    {
        value: "Corporate",
        label: "Corporate",
        icon: Building,
    }
];