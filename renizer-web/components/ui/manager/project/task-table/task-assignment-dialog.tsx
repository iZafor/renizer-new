import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, isDateEarlier } from "@/lib/utils";
import { CalendarIcon, CircleAlert } from "lucide-react";
import React, { useContext, useState } from "react";
import { TaskAssignmentFormState } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectIdContext } from "@/lib/contexts/manager";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    useProjectCollaborationsQueryOptions,
    useProjectTasksQueryOptions,
} from "@/lib/hooks/manager/use-project-query";
import DataTable from "@/components/ui/data-table";
import CollaborationTableToolbar from "../collaboration-table/collaboration-table-tollbar";
import { columns } from "../collaboration-table/columns";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ProjectTask } from "@/lib/definitions";

export default function TaskAssignmentDialog() {
    const projectId = useContext(ProjectIdContext);
    const queryClient = useQueryClient();
    const tasksQueryKey = useProjectTasksQueryOptions(projectId).queryKey;
    const { data: collaborations } = useQuery(
        useProjectCollaborationsQueryOptions(projectId)
    );

    const [open, setOpen] = useState(false);
    const [assigneeOpen, setAssigneeOpen] = useState(false);
    const [expectedDeliveryDateOpen, setExpectedDeliveryDateOpen] =
        useState(false);
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<
        Date | undefined
    >(new Date());
    const [priority, setPriority] = useState("");
    const [state, setState] = useState<TaskAssignmentFormState>();
    const [cpUserId, setCpuserId] = useState("");
    const taskAssignmentMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await fetch(
                "/api/manager/dashboard/project/task-assignment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...Object.fromEntries(formData.entries()),
                        assignedDate: new Date(),
                    }),
                }
            ).then((res) => res.json());
        },
        onSuccess: (newState: TaskAssignmentFormState) => {
            if (newState?.task) {
                queryClient.setQueryData(tasksQueryKey, (old: ProjectTask[]) =>
                    old
                        ? [
                              {
                                  ...newState.task,
                                  assigned_date: new Date(
                                      newState.task?.assigned_date!
                                  ),
                                  expected_delivery_date: new Date(
                                      newState.task?.expected_delivery_date!
                                  ),
                              },
                              ...old,
                          ]
                        : old
                );
                setOpen(false);
                setPriority("");
                setCpuserId("");
            }
            setState(newState);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-8">
                    Assign Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new project</DialogTitle>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        taskAssignmentMutation.mutate(
                            new FormData(ev.currentTarget)
                        );
                    }}
                >
                    <input type="hidden" value={projectId} name="projectId" />
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.taskName,
                            })}
                            htmlFor="taskName"
                        >
                            Task Name
                        </Label>
                        <Input
                            id="taskName"
                            name="taskName"
                            autoComplete="off"
                        />
                        {state?.errors?.taskName && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.taskName}
                            </p>
                        )}
                    </div>
                    <input type="hidden" value={cpUserId} name="cpUserId" />
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.cpUserId,
                            })}
                            htmlFor="assignee"
                        >
                            Assignee
                        </Label>
                        <Popover
                            open={assigneeOpen}
                            onOpenChange={setAssigneeOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    id="assignee"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={assigneeOpen}
                                    className="w-full justify-between"
                                >
                                    <p>
                                        {cpUserId
                                            ? collaborations?.filter(
                                                  (c) =>
                                                      c.c_p_user_id === cpUserId
                                              )[0].name
                                            : ""}
                                    </p>
                                    <CaretSortIcon className="size-4 shrink-0 opacity-50 relative left-1" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="center"
                                className="min-w-[90rem]"
                            >
                                <DataTable
                                    className="h-[20rem]"
                                    data={collaborations!}
                                    columns={columns}
                                    toolbar={CollaborationTableToolbar}
                                    onRowClicked={(c) => {
                                        setCpuserId(c.c_p_user_id);
                                        setAssigneeOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {state?.errors?.cpUserId && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.cpUserId}
                            </p>
                        )}
                    </div>
                    <input type="hidden" value={priority} name="priority" />
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.priority,
                            })}
                            htmlFor="priority"
                        >
                            Task Priority
                        </Label>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        {state?.errors?.priority && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.priority}
                            </p>
                        )}
                    </div>
                    <input
                        type="hidden"
                        value={expectedDeliveryDate?.toISOString()}
                        name="expectedDeliveryDate"
                    />
                    <div className="space-y-1.5 flex flex-col">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive":
                                    state?.errors?.expectedDeliveryDate,
                            })}
                            htmlFor="expectedDeliveryDate"
                        >
                            Expected Delivery Date
                        </Label>
                        <Popover
                            open={expectedDeliveryDateOpen}
                            onOpenChange={setExpectedDeliveryDateOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    id="expectedDeliveryDate"
                                    variant="outline"
                                    className="pl-3 text-left font-semibold"
                                >
                                    {expectedDeliveryDate
                                        ? format(expectedDeliveryDate, "PP")
                                        : "Select Expected Delivery Date"}
                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                                <Calendar
                                    mode="single"
                                    today={expectedDeliveryDate}
                                    disabled={(date) =>
                                        isDateEarlier(date, new Date())
                                    }
                                    onSelect={(date) => {
                                        setExpectedDeliveryDate(date);
                                        setExpectedDeliveryDateOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {state?.errors?.expectedDeliveryDate && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.expectedDeliveryDate}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.expectedHour,
                            })}
                            htmlFor="expectedHour"
                        >
                            Expected Completion Hour
                        </Label>
                        <Input
                            id="expectedHour"
                            name="expectedHour"
                            autoComplete="off"
                        />
                        {state?.errors?.expectedHour && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.expectedHour}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={taskAssignmentMutation.isPending}
                    >
                        Submit
                    </Button>
                    {state?.message && (
                        <div className="flex gap-2 items-center">
                            <CircleAlert className="stroke-destructive size-4" />
                            <p className="font-semibold text-destructive text-sm">
                                {state?.message}
                            </p>
                        </div>
                    )}
                    {state?.errors?.projectId && (
                        <div className="flex gap-2 items-center">
                            <CircleAlert className="stroke-destructive size-4" />
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.projectId}
                            </p>
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
