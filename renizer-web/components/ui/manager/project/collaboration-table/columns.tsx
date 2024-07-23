import { ColumnDef } from "@tanstack/react-table";
import { ProjectCollaboration } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { format } from "date-fns";

export const columns: ColumnDef<ProjectCollaboration>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <TableHeader column={column} title="Name" />,
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
        cell: ({ row }) => (
            <div className="w-[10rem] flex items-center gap-1.5">
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                        {getInitial(row.getValue("name"))}
                    </AvatarFallback>
                </Avatar>
                <p>{row.getValue("name")}</p>
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => <TableHeader column={column} title="Role" />,
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
    },
    {
        accessorKey: "start_date",
        header: ({ column }) => (
            <TableHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => (
            <div>{format(row.getValue("start_date"), "PP")}</div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "end_date",
        header: ({ column }) => (
            <TableHeader column={column} title="End Date" />
        ),
        cell: ({ row }) => (
            <div>
                {row.getValue("end_date")
                    ? format(row.getValue("end_date"), "PP")
                    : "-"}
            </div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "total_assigned_tasks",
        header: ({ column }) => (
            <TableHeader column={column} title="Total Assigned Tasks" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue("total_assigned_tasks") || "-"}</div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "tasks_in_progress",
        header: ({ column }) => (
            <TableHeader column={column} title="Tasks In Progress" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue("tasks_in_progress") || "-"}</div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "tasks_completed",
        header: ({ column }) => (
            <TableHeader column={column} title="Completed Tasks" />
        ),
        cell: ({ row }) => <div>{row.getValue("tasks_completed") || "-"}</div>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "hourly_rate",
        header: ({ column }) => (
            <TableHeader column={column} title="Hourly Rate" />
        ),
        cell: ({ row }) => <div>${row.getValue("hourly_rate") || "-"}</div>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "working_experience",
        header: ({ column }) => (
            <TableHeader column={column} title="Working Experience (Years)" />
        ),
        cell: ({ row }) => <div>{row.getValue("working_experience") || "-"}</div>,
        enableGlobalFilter: false,
    },
];
