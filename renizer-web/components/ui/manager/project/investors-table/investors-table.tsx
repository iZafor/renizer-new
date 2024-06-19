"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import InvestorsTableToolbar from "./investors-table-toolbar";

interface InvestorsTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onSelect: (investor: TData) => void;
}

export default function InvestorsTable<TData, TValue>({
    columns,
    data,
    onSelect,
}: InvestorsTableProps<TData, TValue>) {
    return (
        <DataTable
            className="max-h-[10rem]"
            columns={columns}
            data={data}
            toolbar={InvestorsTableToolbar}
            onRowClicked={onSelect}
        />
    );
}
