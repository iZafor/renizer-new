"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableColumnViewOptions } from "@/components/ui/table-column-view-options";
import { TableFacetedFilter } from "@/components/ui/table-faceted-filter";
import { statuses } from "@/lib/data";
import NewProjectDialog from "./new-project-dialog";
import { Project } from "@/lib/definitions";

interface ProjectTableToolbarProps<TData> {
    table: Table<TData>;
}

export default function ProjectTableToolbar<TData>({
    table,
}: ProjectTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter projects..."
                    onChange={(event) =>
                        table.setGlobalFilter(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <TableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex gap-2">
                <NewProjectDialog  />
                <TableColumnViewOptions table={table} />
            </div>
        </div>
    );
}
