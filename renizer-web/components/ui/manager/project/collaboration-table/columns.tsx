import { ColumnDef } from "@tanstack/react-table";
import { ProjectCollaboration } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";

export const columns: ColumnDef<ProjectCollaboration>[] = [
    {
        accessorKey: "contributor",
        header: ({ column }) => (
            <TableHeader column={column} title="Contributor" />
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
                        {getInitial(row.getValue("contributor"))}
                    </AvatarFallback>
                </Avatar>
                <p>{row.getValue("contributor")}</p>
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
            <div>
                {new Date(row.getValue("start_date")).toLocaleDateString(
                    "en-us",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                )}
            </div>
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
                    ? new Date(row.getValue("end_date")).toLocaleDateString(
                          "en-us",
                          {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                          }
                      )
                    : ""}
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
            <div>{row.getValue("total_assigned_tasks") || "0"}</div>
        ),
        sortingFn: (rowA, rowB, columnId) =>
            Number(rowA.getValue(columnId) || "0") -
            Number(rowB.getValue(columnId) || "0"),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "tasks_in_progress",
        header: ({ column }) => (
            <TableHeader column={column} title="Tasks In Progress" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue("tasks_in_progress") || "0"}</div>
        ),
        sortingFn: (rowA, rowB, columnId) =>
            Number(rowA.getValue(columnId) || "0") -
            Number(rowB.getValue(columnId) || "0"),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "tasks_completed",
        header: ({ column }) => (
            <TableHeader column={column} title="Completed Tasks" />
        ),
        cell: ({ row }) => (
            <div>{row.getValue("tasks_completed") || "0"}</div>
        ),
        sortingFn: (rowA, rowB, columnId) =>
            Number(rowA.getValue(columnId) || "0") -
            Number(rowB.getValue(columnId) || "0"),
        enableGlobalFilter: false,
    },
];
