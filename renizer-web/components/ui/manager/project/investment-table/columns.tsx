import { ColumnDef } from "@tanstack/react-table";
import { ProjectInvestment } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { StatusIcon } from "@/components/ui/icons";
import { format } from "date-fns";

export const columns: ColumnDef<ProjectInvestment>[] = [
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
        accessorKey: "investment_amount",
        header: ({ column }) => (
            <TableHeader column={column} title="Investment Amount" />
        ),
        cell: ({row}) => <div>${row.getValue("investment_amount")}</div>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "proposal_date",
        header: ({ column }) => (
            <TableHeader column={column} title="Proposal Date" />
        ),
        cell: ({ row }) => (
            <div>{format(row.getValue("proposal_date"), "PP")}</div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "investment_date",
        header: ({ column }) => (
            <TableHeader column={column} title="Investment Date" />
        ),
        cell: ({ row }) => (
            <div>
                {row.getValue("investment_date")
                    ? format(row.getValue("investment_date"), "PP")
                    : ""}
            </div>
        ),
        enableGlobalFilter: false,
    },
    {
        accessorKey: "proposal_status",
        header: ({ column }) => (
            <TableHeader column={column} title="Proposal Status" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <StatusIcon status={row.getValue("proposal_status")} />
                <p>{row.getValue("proposal_status")}</p>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableGlobalFilter: false,
    },
];
