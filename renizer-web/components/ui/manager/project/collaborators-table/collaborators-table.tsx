"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import CollaboratorsTableToolbar from "./collaborators-table-toolbar";

interface CollaboratorsProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onSelect: (collaborator: TData) => void;
}

export default function CollaboratorsTable<TData, TValue>({
    columns,
    data,
    onSelect,
}: CollaboratorsProps<TData, TValue>) {
    return (
        <DataTable
            className="max-h-[20rem]"
            columns={columns}
            data={data}
            toolbar={CollaboratorsTableToolbar}
            onRowClicked={onSelect}
        />
    );
}
