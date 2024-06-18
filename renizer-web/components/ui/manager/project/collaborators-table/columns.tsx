import { ColumnDef } from "@tanstack/react-table";
import { CollaboratorDetails } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";

export const columns: ColumnDef<CollaboratorDetails>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <TableHeader column={column} title="Name" />,
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
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
        accessorKey: "working_department",
        header: ({ column }) => (
            <TableHeader column={column} title="Working Department" />
        ),
    },
    {
        accessorKey: "hourly_rate",
        header: ({ column }) => (
            <TableHeader column={column} title="Hourly Rate" />
        ),
        cell: ({ row }) => <div>${row.getValue("hourly_rate")}</div>,
        sortingFn: (rowA, rowB, colId) =>
            Number(rowA.getValue(colId)) - Number(rowB.getValue(colId)),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "working_experience",
        header: ({ column }) => (
            <TableHeader column={column} title="Working Experience (Years)" />
        ),
        sortingFn: (rowA, rowB, colId) =>
            Number(rowA.getValue(colId)) - Number(rowB.getValue(colId)),
        enableGlobalFilter: false,
    },
];
