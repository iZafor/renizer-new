import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarClock, CalendarIcon } from "lucide-react";
import InfoContainer from "./info-container";
import { TaskPrimaryKey } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewExpectedDeliveryDateFormState } from "@/lib/schemas";
import { ProjectTask } from "@/lib/definitions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ExpectedDeliveryDateContainerProps {
    projectTasksQueryKey: string[];
    taskPrimaryKey: TaskPrimaryKey;
    expectedDeliveryDate: Date;
}

export default function ExpectedDeliveryDateContainer({
    projectTasksQueryKey,
    taskPrimaryKey,
    expectedDeliveryDate,
}: ExpectedDeliveryDateContainerProps) {
    const queryClient = useQueryClient();
    const [
        newExpectedDeliveryDateFormState,
        setNewExpectedDeliveryDateFormState,
    ] = useState<NewExpectedDeliveryDateFormState>();
    const expectedDeliveryDateMutation = useMutation({
        mutationFn: async (newExpectedDeliveryDate: Date) =>
            await fetch(
                "/api/manager/dashboard/project/update-expected-delivery-date",
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        ...taskPrimaryKey,
                        newExpectedDeliveryDate,
                    }),
                }
            ).then((res) => res.json()),
        onSuccess: (data: NewExpectedDeliveryDateFormState) => {
            if (data?.newExpectedDeliveryDate) {
                queryClient.setQueryData(
                    projectTasksQueryKey,
                    (old: ProjectTask[]) =>
                        old
                            ? old.map((t) =>
                                  t.p_user_id === taskPrimaryKey.pUserId &&
                                  t.assigned_date ===
                                      taskPrimaryKey.assignedDate &&
                                  t.task === taskPrimaryKey.taskName
                                      ? {
                                            ...t,
                                            expected_delivery_date: new Date(
                                                data.newExpectedDeliveryDate!
                                            ),
                                        }
                                      : t
                              )
                            : old
                );
            }

            setNewExpectedDeliveryDateFormState(data);
        },
    });

    useEffect(() => {
        if (newExpectedDeliveryDateFormState?.errors) {
            if (
                newExpectedDeliveryDateFormState.errors.newExpectedDeliveryDate
            ) {
                toast(
                    newExpectedDeliveryDateFormState.errors
                        .newExpectedDeliveryDate,
                    {
                        classNames: {
                            title: "text-base text-destructive font-semibold",
                        },
                    }
                );
            } else {
                toast("Invalid form data.", {
                    classNames: {
                        title: "text-base text-destructive font-semibold",
                    },
                });
            }
        }

        if (newExpectedDeliveryDateFormState?.message) {
            toast(newExpectedDeliveryDateFormState?.message, {
                classNames: {
                    title: "text-base text-destructive font-semibold",
                },
            });
        }
    }, [newExpectedDeliveryDateFormState]);

    return (
        <InfoContainer
            IdentifierIcon={CalendarClock}
            identifierText="Expected Delivery Date"
        >
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-[10rem] pl-3 text-left font-semibold"
                    >
                        {format(expectedDeliveryDate, "PP")}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                        mode="single"
                        selected={expectedDeliveryDate}
                        disabled={(date) =>
                            date < taskPrimaryKey.assignedDate ||
                            expectedDeliveryDateMutation.isPending
                        }
                        today={expectedDeliveryDate}
                        onSelect={(newDate) => {
                            setTimeout(() => {
                                expectedDeliveryDateMutation.mutate(newDate!);
                            }, 200);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </InfoContainer>
    );
}