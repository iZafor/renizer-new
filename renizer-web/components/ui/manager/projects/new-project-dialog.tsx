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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CircleAlert, Plus, PlusCircle } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { NewProjectFromState } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ManagerIdContext } from "@/lib/contexts/manager";
import { Project } from "@/lib/definitions";
import { useProjectsQueryOptions } from "@/lib/hooks/manager/use-projects-query";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

export default function NewProjectDialog() {
    const managerId = useContext(ManagerIdContext);
    const queryOptions = useProjectsQueryOptions(managerId);
    const { data: projects } = useQuery(queryOptions);
    const projectQueryKey = queryOptions.queryKey;
    const queryClient = useQueryClient();

    const energySources = projects?.map((p) => p.source);
    const energySourceInputRef = useRef<HTMLInputElement>(null);
    const [energySource, setEnergySource] = useState<string>();
    const [open, setOpen] = useState(false);
    const [energySourceOpen, setEnergySourceOpen] = useState(false);
    const [state, setState] = useState<NewProjectFromState>(undefined);
    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await fetch("/api/manager/dashboard/project/new-project", {
                method: "POST",
                body: formData,
            }).then((res) => res.json());
        },
        onSuccess: (newState: NewProjectFromState) => {
            if (newState?.newProject) {
                queryClient.setQueryData(projectQueryKey, (old: Project[]) => [
                    {
                        ...newState.newProject,
                        creation_date: new Date(
                            newState.newProject?.creation_date!
                        ),
                    },
                    ...old,
                ]);
                setEnergySource("");
                setOpen(false);
            }
            setState(newState);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-8">
                    New Project
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
                        mutation.mutate(new FormData(ev.currentTarget));
                    }}
                >
                    <input type="hidden" value={managerId} name="managerId" />
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.name,
                            })}
                            htmlFor="name"
                        >
                            Project Name
                        </Label>
                        <Input id="name" name="name" autoComplete="off" />
                        {state?.errors?.name && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.energySource,
                            })}
                            htmlFor="energySource"
                        >
                            Energy Source
                        </Label>
                        <input
                            type="hidden"
                            value={energySource}
                            name="energySource"
                        />
                        <Popover
                            open={energySourceOpen}
                            onOpenChange={setEnergySourceOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-between"
                                    role="combobox"
                                    id="energySource"
                                >
                                    {energySource
                                        ? energySource
                                        : "Select Energy Source"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                                <Command className="relative">
                                    <CommandInput
                                        placeholder="Energy Source"
                                        ref={energySourceInputRef}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            <p> No match found.</p>
                                            <PlusCircle
                                                className="size-5 absolute right-0 top-3 cursor-pointer"
                                                onClick={() => {
                                                    setEnergySource(
                                                        energySourceInputRef
                                                            .current?.value
                                                    );
                                                    setEnergySourceOpen(false);
                                                }}
                                            />
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {energySources?.map((val, idx) => (
                                                <CommandItem
                                                    key={val + idx}
                                                    value={val}
                                                    onSelect={() => {
                                                        setEnergySource(val);
                                                        setEnergySourceOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            energySource === val
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {val}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {state?.errors?.energySource && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.energySource}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.description,
                            })}
                            htmlFor="description"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            autoComplete="off"
                        />
                        {state?.errors?.description && (
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 items-center">
                        <Checkbox
                            id="restrictedToOrganization"
                            name="restrictedToOrganization"
                        />
                        <Label htmlFor="restrictedToOrganization">
                            Restrict project to your organization only
                        </Label>
                    </div>
                    <Button type="submit" disabled={mutation.isPending}>
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
                    {state?.errors?.managerId && (
                        <div className="flex gap-2 items-center">
                            <CircleAlert className="stroke-destructive size-4" />
                            <p className="font-semibold text-destructive text-sm">
                                {state.errors.managerId}
                            </p>
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
