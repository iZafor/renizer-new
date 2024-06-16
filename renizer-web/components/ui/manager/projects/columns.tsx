import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { StatusIcon } from "@/components/ui/icons";
import { formatEnergyUnit } from "@/lib/utils";

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <TableHeader column={column} title="Name" />,
        cell: ({ row }) => (
            <div className="w-[16rem] truncate">{row.getValue("name")}</div>
        ),
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <TableHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="w-[26rem] truncate">
                {row.getValue("description")}
            </div>
        ),
        filterFn: (row, id, value) => {
            console.log(
                (row.getValue("description") as string)
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
            return (
                value &&
                (row.getValue(id) as string)
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
        },
    },
    {
        accessorKey: "creation_date",
        header: ({ column }) => (
            <TableHeader column={column} title="Creation Date" />
        ),
        cell: ({ row }) => (
            <div className="w-[10rem]">
                {new Date(row.getValue("creation_date")).toLocaleDateString()}
            </div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <TableHeader column={column} title="Status" />,
        cell: ({ row }) => (
            <div className="w-[10rem] flex gap-1.5">
                <StatusIcon status={row.getValue("status")} />
                <p className="truncate">{row.getValue("status")}</p>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "energy_produced",
        header: ({ column }) => (
            <TableHeader column={column} title="Energy Produced" />
        ),
        cell: ({ row }) => (
            <div>
                {formatEnergyUnit(Number(row.getValue("energy_produced")))}
            </div>
        ),
        sortingFn: (rowA, rowB, colId) =>
            Number(rowA.getValue(colId)) - Number(rowB.getValue(colId)),
        enableGlobalFilter: false,
    },
];
