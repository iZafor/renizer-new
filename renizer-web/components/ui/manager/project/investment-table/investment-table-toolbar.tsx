"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableColumnViewOptions } from "@/components/ui/table-column-view-options";
import { TableFacetedFilter } from "@/components/ui/table-faceted-filter";
import { investmentProposalStatuses } from "@/lib/data";

interface InvestmentTableToolbarProps<TData> {
    table: Table<TData>;
}

export default function InvestmentTableToolbar<TData>({
    table,
}: InvestmentTableToolbarProps<TData>) {
    const isFiltered =
        table.getState().columnFilters.length > 0 ||
        table.getState().sorting.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter investments..."
                    onChange={(event) => {
                        table.setGlobalFilter(event.target.value);
                    }}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("proposal_status") && (
                    <TableFacetedFilter
                        column={table.getColumn("proposal_status")}
                        title="Status"
                        options={investmentProposalStatuses}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            table.resetSorting();
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <TableColumnViewOptions table={table} />
        </div>
    );
}
