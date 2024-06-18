import { ColumnDef } from "@tanstack/react-table";
import { ProjectTask } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { PriorityIcon, StatusIcon } from "@/components/ui/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import TaskDetails from "./task-details";

export const columns: ColumnDef<ProjectTask>[] = [
    {
        accessorKey: "task",
        header: ({ column }) => <TableHeader column={column} title="Task" />,
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
        cell: ({ row }) => (
            <div className="w-[10rem] truncate">{row.getValue("task")}</div>
        ),
    },
    {
        accessorKey: "assignee",
        header: ({ column }) => (
            <TableHeader column={column} title="Assignee" />
        ),
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
                        {getInitial(row.getValue("assignee"))}
                    </AvatarFallback>
                </Avatar>
                <p>{row.getValue("assignee")}</p>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <TableHeader column={column} title="Status" />,
        cell: ({ row }) => (
            <div className="w-[10rem] flex items-center gap-2">
                <StatusIcon status={row.getValue("status")} />
                <p>{row.getValue("status")}</p>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "priority",
        header: ({ column }) => (
            <TableHeader column={column} title="Priority" />
        ),
        cell: ({ row }) => (
            <div className="w-[6rem] flex items-center gap-2">
                <PriorityIcon priority={row.getValue("priority")} />
                <p>{row.getValue("priority")}</p>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "expected_delivery_date",
        header: ({ column }) => (
            <TableHeader column={column} title="Expected Delivery Date" />
        ),
        cell: ({ row }) => (
            <div>
                {new Date(
                    row.getValue("expected_delivery_date")
                ).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <TaskDetails task={row.original} />,
    },
];
