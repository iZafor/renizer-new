import { ColumnDef } from "@tanstack/react-table";
import { InvestorDetails } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";

export const columns: ColumnDef<InvestorDetails>[] = [
    {
        accessorKey: "investor",
        header: ({ column }) => (
            <TableHeader column={column} title="Investor" />
        ),
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
                        {getInitial(row.getValue("investor"))}
                    </AvatarFallback>
                </Avatar>
                <p>{row.getValue("investor")}</p>
            </div>
        ),
    },
    {
        accessorKey: "investor_type",
        header: ({ column }) => (
            <TableHeader column={column} title="Investor Type" />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "invested_in_projects",
        header: ({ column }) => (
            <TableHeader column={column} title="Invested In Projects" />
        ),
        sortingFn: (rowA, rowB, colId) =>
            Number(rowA.getValue(colId)) - Number(rowB.getValue(colId)),
    },
    {
        accessorKey: "total_investment",
        header: ({ column }) => (
            <TableHeader column={column} title="Total Investment" />
        ),
        cell: ({row}) => <div>${row.getValue("total_investment")}</div>,
        sortingFn: (rowA, rowB, colId) =>
            Number(rowA.getValue(colId)) - Number(rowB.getValue(colId)),
    },
];
