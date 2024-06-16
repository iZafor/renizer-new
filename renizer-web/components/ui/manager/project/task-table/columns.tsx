import { ColumnDef } from "@tanstack/react-table";
import { ProjectTask } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { PriorityIcon, StatusIcon } from "@/components/ui/icons";

export const columns: ColumnDef<ProjectTask>[] = [
    {
        accessorKey: "task",
        header: ({ column }) => <TableHeader column={column} title="Task" />,
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
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
    },
    {
        accessorKey: "status",
        header: ({ column }) => <TableHeader column={column} title="Status" />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <StatusIcon status={row.getValue("status")} />
                <p>{row.getValue("status")}</p>
            </div>
        ),
    },
    {
        accessorKey: "priority",
        header: ({ column }) => (
            <TableHeader column={column} title="Priority" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <PriorityIcon priority={row.getValue("priority")} />
                <p>{row.getValue("priority")}</p>
            </div>
        ),
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
];
