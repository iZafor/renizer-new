import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import InfoContainer from "./info-container";
import { TaskPrimaryKey } from "./types";
import { toast } from "sonner";
import { ProjectTask } from "@/lib/definitions";
import { NewTaskPriorityFormState } from "@/lib/schemas";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface TaskPriorityContainerProps {
    projectTasksQueryKey: string[];
    taskPrimaryKey: TaskPrimaryKey;
    taskPriority: string;
}

export default function TaskPriorityContainer({
    projectTasksQueryKey,
    taskPrimaryKey,
    taskPriority,
}: TaskPriorityContainerProps) {
    const queryClient = useQueryClient();
    const [newTaskStatusFormState, setNewTaskStatusFormState] =
        useState<NewTaskPriorityFormState>();
    const [value, setValue] = useState(taskPriority);
    const taskPriorityMutation = useMutation({
        mutationFn: async (newPriority: string) =>
            await fetch("/api/manager/dashboard/project/update-priority", {
                method: "PATCH",
                body: JSON.stringify({
                    ...taskPrimaryKey,
                    newPriority,
                }),
            }).then((res) => res.json()),
        onSuccess: (data: NewTaskPriorityFormState) => {
            if (data?.newPriority) {
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
                                            priority: data.newPriority,
                                        }
                                      : t
                              )
                            : old
                );
                setValue(data.newPriority);
            }

            setNewTaskStatusFormState(data);
        },
    });

    useEffect(() => {
        if (newTaskStatusFormState?.errors) {
            if (newTaskStatusFormState.errors.newPriority) {
                toast(newTaskStatusFormState.errors.newPriority, {
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
        <InfoContainer IdentifierIcon={Star} identifierText="Priority">
            <Select value={value} onValueChange={taskPriorityMutation.mutate}>
                <SelectTrigger className="w-[10rem] font-semibold">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
            </Select>
        </InfoContainer>
    );
}
