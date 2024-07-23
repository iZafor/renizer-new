"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfoContainer from "./info-container";
import { TaskPrimaryKey } from "./types";
import { getInitial } from "@/lib/utils";
import { User } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import DataTable from "@/components/ui/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    useProjectCollaborationsQueryOptions,
} from "@/lib/hooks/manager/use-project-query";
import { useState, useEffect } from "react";
import { NewTaskAssigneeFormState } from "@/lib/schemas";
import { toast } from "sonner";
import { ProjectTask } from "@/lib/definitions";
import { columns } from "../collaboration-table/columns";
import CollaborationTableToolbar from "../collaboration-table/collaboration-table-tollbar";

interface TaskAssigneeContainerProps {
    projectTasksQueryKey: string[];
    taskPrimaryKey: TaskPrimaryKey;
    assignee: string;
    role: string;
    deliveryDate?: Date;
}

export default function TaskAssigneeContainer({
    projectTasksQueryKey,
    taskPrimaryKey,
    assignee,
    role,
    deliveryDate,
}: TaskAssigneeContainerProps) {
    const queryClient = useQueryClient();
    const { data } = useQuery(
        useProjectCollaborationsQueryOptions(taskPrimaryKey.projectId)
    );
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<NewTaskAssigneeFormState>();
    const newAssigneeMutation = useMutation({
        mutationFn: async (newAssigneeId: string) => {
            return await fetch(
                "/api/manager/dashboard/project/update-task-assignee",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...taskPrimaryKey,
                        newAssigneeId,
                    }),
                }
            ).then((res) => res.json());
        },
        onSuccess: (newState: NewTaskAssigneeFormState) => {
            if (newState?.newAssigneeId) {
                const {
                    newAssigneeId,
                    newAssigneeName,
                    newAssigneeRole,
                    newAssignedDate,
                } = newState;
                console.log(taskPrimaryKey, {
                    newAssigneeId,
                    newAssigneeName,
                    newAssigneeRole,
                    newAssignedDate,
                });
                queryClient.setQueryData(
                    projectTasksQueryKey,
                    (old: ProjectTask[]) =>
                        old
                            ? old.map((t) =>
                                  t.c_p_user_id === taskPrimaryKey.cpUserId &&
                                  t.assigned_date ===
                                      taskPrimaryKey.assignedDate &&
                                  t.task === taskPrimaryKey.taskName
                                      ? {
                                            ...t,
                                            c_p_user_id: newState.newAssigneeId,
                                            assignee: newState.newAssigneeName,
                                            role: newState.newAssigneeRole,
                                            hour_taken: 0,
                                            assigned_date: new Date(
                                                newState?.newAssignedDate!
                                            ),
                                        }
                                      : t
                              )
                            : old
                );
                setOpen(false);
            }
            setState(newState);
        },
    });

    useEffect(() => {
        if (state?.errors) {
            if (state.errors.newAssigneeId) {
                toast(state.errors.newAssigneeId, {
                    classNames: {
                        title: "text-base text-destructive font-semibold",
                    },
                });
            } else {
                toast("Invalid form data.", {
                    classNames: {
                        title: "text-base text-destructive font-semibold",
                    },
                });
            }
        }

        if (state?.message) {
            toast(state?.message, {
                classNames: {
                    title: "text-base text-destructive font-semibold",
                },
            });
        }
    }, [state]);

    return (
        <InfoContainer IdentifierIcon={User} identifierText="Assignee">
            {deliveryDate ? (
                <div className="flex items-center space-x-1.5">
                    <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{getInitial(assignee)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col font-semibold">
                        <p className="text-lg">{assignee}</p>
                        <p className="text-muted-foreground text-xs">{role}</p>
                    </div>
                </div>
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div className="flex items-center space-x-1.5 cursor-pointer">
                            <Avatar>
                                <AvatarImage src="" />
                                <AvatarFallback>
                                    {getInitial(assignee)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col font-semibold">
                                <p className="text-lg">{assignee}</p>
                                <p className="text-muted-foreground text-xs">
                                    {role}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="min-w-[90rem]">
                        <DataTable
                            data={data!}
                            columns={columns}
                            toolbar={CollaborationTableToolbar}
                            className="h-[26rem]"
                            onRowClicked={(data) =>
                                newAssigneeMutation.mutate(data.c_p_user_id)
                            }
                        />
                    </PopoverContent>
                </Popover>
            )}
        </InfoContainer>
    );
}
