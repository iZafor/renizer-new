"use client";

import {
    CalendarCheck2,
    CalendarPlus,
    Hourglass,
    MoreHorizontal,
    Trash,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ProjectTask } from "@/lib/definitions";
import { format } from "date-fns";
import { useProjectTasksQueryOptions } from "@/lib/hooks/manager/use-project-query";
import { TaskPrimaryKey } from "./types";
import InfoContainer from "./info-container";
import ExpectedDeliveryDateContainer from "./expected-delivery-date-container";
import TaskStatusContainer from "./task-status-container";
import TaskPriorityContainer from "./task-priority-container";
import TaskAssigneeContainer from "./task-assignee-container";
import { useEffect, useState } from "react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type TaskDeletionState = { message: string; status: boolean } | undefined;

interface TaskDetailsProps {
    className?: string;
    task: ProjectTask;
}

export default function TaskDetails({ className, task }: TaskDetailsProps) {
    const projectTasksQueryKey = useProjectTasksQueryOptions(
        task.project_id
    ).queryKey;
    const taskPrimaryKey: TaskPrimaryKey = {
        cpUserId: task.c_p_user_id,
        projectId: task.project_id,
        taskName: task.task,
        assignedDate: task.assigned_date,
    };
    const [updateOpen, setUpdateOpen] = useState(false);
    const [taskDeletionState, setTaskDeletionState] =
        useState<TaskDeletionState>();
    const queryClient = useQueryClient();
    const taskDeleteMutation = useMutation({
        mutationFn: async (taskPrimaryKey: TaskPrimaryKey) =>
            await fetch("/api/manager/dashboard/project/delete-task", {
                method: "DELETE",
                body: JSON.stringify(taskPrimaryKey),
            }).then((res) => res.json()),
        onSuccess: (data: TaskDeletionState) => setTaskDeletionState(data),
    });

    useEffect(() => {
        if (taskDeletionState) {
            if (taskDeletionState.status) {
                queryClient.setQueryData(
                    projectTasksQueryKey,
                    (old: ProjectTask[]) =>
                        old
                            ? old.filter(
                                  (t) =>
                                      t.c_p_user_id !==
                                          taskPrimaryKey.cpUserId &&
                                      t.task !== taskPrimaryKey.taskName &&
                                      t.assigned_date !==
                                          taskPrimaryKey.assignedDate
                              )
                            : old
                );
                toast(taskDeletionState.message);
            } else {
                toast(taskDeletionState.message, {
                    classNames: {
                        title: "text-destructive-foreground",
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskDeletionState]);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4 cursor-pointer" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => setUpdateOpen(true)}
                    >
                        <UpdateIcon className="size-4" />
                        <p>Update</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() =>
                            taskDeleteMutation.mutate(taskPrimaryKey)
                        }
                    >
                        <Trash className="size-4" />
                        <p>Delete</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={updateOpen} onOpenChange={setUpdateOpen}>
                <SheetTrigger></SheetTrigger>
                <SheetContent className="min-w-[40rem]">
                    <div className="grid place-items-center h-full">
                        <div>
                            <SheetHeader>
                                <SheetTitle asChild>
                                    <h2
                                        autoFocus
                                        className="text-3xl border-0 pl-0 focus-visible:outline-none bg-transparent"
                                    >
                                        {task.task}
                                    </h2>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-8 mt-6">
                                <TaskAssigneeContainer
                                    projectTasksQueryKey={projectTasksQueryKey}
                                    taskPrimaryKey={taskPrimaryKey}
                                    assignee={task.assignee}
                                    role={task.role}
                                    deliveryDate={task.delivery_date}
                                />
                                <InfoContainer
                                    IdentifierIcon={CalendarPlus}
                                    identifierText="Assigned Date"
                                >
                                    <p className="font-semibold">
                                        {format(task.assigned_date, "PP")}
                                    </p>
                                </InfoContainer>
                                <InfoContainer
                                    IdentifierIcon={CalendarCheck2}
                                    identifierText="Delivery Date"
                                >
                                    <p className="font-semibold">
                                        {task.delivery_date
                                            ? format(task.delivery_date, "PP")
                                            : "-"}
                                    </p>
                                </InfoContainer>
                                <ExpectedDeliveryDateContainer
                                    taskPrimaryKey={taskPrimaryKey}
                                    projectTasksQueryKey={projectTasksQueryKey}
                                    expectedDeliveryDate={
                                        task.expected_delivery_date
                                    }
                                    deliveryDate={task.delivery_date}
                                />
                                <InfoContainer
                                    IdentifierIcon={Hourglass}
                                    identifierText="Hour Taken"
                                >
                                    <p className="font-semibold">
                                        {task.hour_taken}
                                    </p>
                                </InfoContainer>
                                <TaskStatusContainer
                                    projectTasksQueryKey={projectTasksQueryKey}
                                    taskPrimaryKey={taskPrimaryKey}
                                    taskStatus={task.status}
                                />
                                <TaskPriorityContainer
                                    projectTasksQueryKey={projectTasksQueryKey}
                                    taskPrimaryKey={taskPrimaryKey}
                                    taskPriority={task.priority}
                                />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
