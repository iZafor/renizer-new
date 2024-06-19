"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import InvestmentTableToolbar from "./investment-table-toolbar";

interface InvestmentTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export default function InvestmentTable<TData, TValue>({
    columns,
    data,
}: InvestmentTableProps<TData, TValue>) {
    return (
        <DataTable
            className="max-h-[38.5rem]"
            columns={columns}
            data={data}
            toolbar={InvestmentTableToolbar}
        />
    );
}
