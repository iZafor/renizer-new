"use client";

import {
    CalendarCheck2,
    CalendarClock,
    CalendarIcon,
    CalendarPlus,
    Hourglass,
    Loader,
    MoreHorizontal,
    Star,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ProjectTask } from "@/lib/definitions";
import { cn, getInitial } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";

interface TaskDetailsProps {
    className?: string;
    task: ProjectTask;
}

export default function TaskDetails({ className, task }: TaskDetailsProps) {
    const [currentTask, setCurrentTask] = useState(task);

    return (
        <Sheet>
            <SheetTrigger className={cn(className)}>
                <MoreHorizontal className="size-4 cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="min-w-[40rem]">
                <div className="grid place-items-center h-full">
                    <div>
                        <SheetHeader>
                            <SheetTitle>
                                <input
                                    autoFocus
                                    className="text-3xl border-0 pl-0 focus-visible:outline-none bg-transparent"
                                    value={currentTask.task}
                                    onChange={(ev) => {
                                        setCurrentTask((prev) => ({
                                            ...prev,
                                            task: ev.target.value,
                                        }));
                                    }}
                                />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-8 mt-6">
                            <InfoContainer
                                IdentifierIcon={User}
                                identifierText="Assignee"
                            >
                                <div className="flex items-center space-x-1.5">
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback>
                                            {getInitial(currentTask.assignee)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col font-semibold">
                                        <p className="text-lg">
                                            {currentTask.assignee}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {currentTask.role}
                                        </p>
                                    </div>
                                </div>
                            </InfoContainer>
                            <InfoContainer
                                IdentifierIcon={CalendarPlus}
                                identifierText="Assigned Date"
                            >
                                <p className="font-semibold">
                                    {format(currentTask.assigned_date, "PP")}
                                </p>
                            </InfoContainer>
                            <InfoContainer
                                IdentifierIcon={CalendarCheck2}
                                identifierText="Delivery Date"
                            >
                                <p className="font-semibold">
                                    {currentTask.delivery_date
                                        ? format(
                                              currentTask.delivery_date,
                                              "PP"
                                          )
                                        : "-"}
                                </p>
                            </InfoContainer>
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
                                            {format(
                                                currentTask.expected_delivery_date,
                                                "PP"
                                            )}
                                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={
                                                new Date(
                                                    currentTask.expected_delivery_date
                                                )
                                            }
                                            disabled={(date) =>
                                                date <
                                                new Date(
                                                    currentTask.assigned_date
                                                )
                                            }
                                            today={
                                                new Date(
                                                    currentTask.expected_delivery_date
                                                )
                                            }
                                            onSelect={(newDate) => {
                                                setCurrentTask((prev) => ({
                                                    ...prev,
                                                    expected_delivery_date:
                                                        newDate?.toISOString()!,
                                                }));
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </InfoContainer>
                            <InfoContainer
                                IdentifierIcon={Hourglass}
                                identifierText="Hour Taken"
                            >
                                <p className="font-semibold">
                                    {currentTask.hour_taken}
                                </p>
                            </InfoContainer>
                            <InfoContainer
                                IdentifierIcon={Loader}
                                identifierText="Status"
                            >
                                <Select defaultValue={currentTask.status}>
                                    <SelectTrigger className="w-[10rem] font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In Progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="Done">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </InfoContainer>
                            <InfoContainer
                                IdentifierIcon={Star}
                                identifierText="Priority"
                            >
                                <Select defaultValue={currentTask.priority}>
                                    <SelectTrigger className="w-[10rem] font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">
                                            High
                                        </SelectItem>
                                        <SelectItem value="Medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InfoContainer>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

interface InfoContainerProps {
    IdentifierIcon: React.ComponentType<{ className?: string }>;
    identifierText: string;
    children: React.ReactNode;
}

function InfoContainer({
    IdentifierIcon,
    identifierText,
    children,
}: InfoContainerProps) {
    return (
        <div className="flex items-center h-[3rem]">
            <div className="flex items-center space-x-1.5 min-w-[16rem]">
                <IdentifierIcon className="size-6 stroke-muted-foreground" />
                <p className="text-muted-foreground">{identifierText}</p>
            </div>
            {children}
        </div>
    );
}
