"use client";

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
import { createNewProject } from "./actions";
import { useFormState } from "react-dom";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function NewProjectDialog() {
    const [open, setOpen] = useState(false);
    const [state, action] = useFormState(createNewProject, undefined);

    useEffect(() => {
        if (state?.newProject) {
            setOpen(false);
            // onAddNewProject(state.newProject);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

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
                <form className="space-y-4" action={action}>
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
                    <Button type="submit">Submit</Button>
                    {state?.message && (
                        <div className="flex gap-2 items-center">
                            <CircleAlert className="stroke-destructive size-4" />
                            <p className="font-semibold text-destructive text-sm">
                                {state?.message}
                            </p>
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
