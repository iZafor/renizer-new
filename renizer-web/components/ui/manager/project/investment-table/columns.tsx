import { ColumnDef } from "@tanstack/react-table";
import { ProjectInvestment } from "@/lib/definitions";
import { TableHeader } from "@/components/ui/table-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";

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
        filterFn: (row, id, value) =>
            value &&
            (row.getValue(id) as string)
                .toLowerCase()
                .includes(value.toLowerCase()),
    },
    {
        accessorKey: "investment_date",
        header: ({ column }) => (
            <TableHeader column={column} title="Investment Date" />
        ),
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue("investment_date")).toLocaleDateString(
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
];
