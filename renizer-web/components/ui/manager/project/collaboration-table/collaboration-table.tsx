"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import CollaborationTableToolbar from "./collaboration-table-tollbar";

interface CollaborationTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export default function CollaborationTable<TData, TValue>({
    columns,
    data,
}: CollaborationTableProps<TData, TValue>) {
    return (
        <DataTable
            className="max-h-[39.5rem]"
            columns={columns}
            data={data}
            toolbar={CollaborationTableToolbar}
        />
    );
}
