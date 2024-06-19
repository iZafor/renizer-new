"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import TasksTableToolbar from "./tasks-table-toolbar";

interface TasksTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export default function TasksTable<TData, TValue>({
    columns,
    data,
}: TasksTableProps<TData, TValue>) {
    return (
        <DataTable columns={columns} data={data} toolbar={TasksTableToolbar} />
    );
}
