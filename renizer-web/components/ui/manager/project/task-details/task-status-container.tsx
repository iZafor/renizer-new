import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import InfoContainer from "./info-container";
import { TaskPrimaryKey } from "./types";
import { toast } from "sonner";
import { ProjectTask } from "@/lib/definitions";
import { NewTaskStatusFormState } from "@/lib/schemas";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface TaskStatusContainerProps {
    projectTasksQueryKey: string[];
    taskPrimaryKey: TaskPrimaryKey;
    taskStatus: string;
}

export default function TaskStatusContainer({
    projectTasksQueryKey,
    taskPrimaryKey,
    taskStatus,
}: TaskStatusContainerProps) {
    const queryClient = useQueryClient();
    const [newTaskStatusFormState, setNewTaskStatusFormState] =
        useState<NewTaskStatusFormState>();
    const [value, setValue] = useState(taskStatus);
    const taskStatusMutation = useMutation({
        mutationFn: async (newStatus: string) =>
            await fetch("/api/manager/dashboard/project/update-status", {
                method: "PATCH",
                body: JSON.stringify({
                    ...taskPrimaryKey,
                    newStatus,
                }),
            }).then((res) => res.json()),
        onSuccess: (data: NewTaskStatusFormState) => {
            if (data?.newStatus) {
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
                                            status: data.newStatus,
                                            delivery_date: data.deliveryDate,
                                        }
                                      : t
                              )
                            : old
                );
                setValue(data.newStatus);
            }

            setNewTaskStatusFormState(data);
        },
    });

    useEffect(() => {
        if (newTaskStatusFormState?.errors) {
            if (newTaskStatusFormState.errors.newStatus) {
                toast(newTaskStatusFormState.errors.newStatus, {
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

        if (newTaskStatusFormState?.message) {
            toast(newTaskStatusFormState?.message, {
                classNames: {
                    title: "text-base text-destructive font-semibold",
                },
            });
        }
    }, [newTaskStatusFormState]);

    return (
        <InfoContainer IdentifierIcon={Loader} identifierText="Status">
            <Select value={value} onValueChange={taskStatusMutation.mutate}>
                <SelectTrigger className="w-[10rem] font-semibold">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Not Started Yet">
                        Not Started Yet
                    </SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
            </Select>
        </InfoContainer>
    );
}
