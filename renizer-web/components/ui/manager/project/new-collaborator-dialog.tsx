"use client";

import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CollaboratorDetails } from "@/lib/definitions";
import { useEffect, useState } from "react";
import CollaboratorsTable from "@/components/ui/manager/project/collaborators-table/collaborators-table";
import { columns } from "@/components/ui/manager/project/collaborators-table/columns";
import { useFormState } from "react-dom";
import { addNewCollaborator } from "@/lib/actions/project/actions";
import { cn } from "@/lib/utils";

interface NewCollaboratorDialogProps {
    collaborators: CollaboratorDetails[];
}

export default function NewCollaboratorDialog({
    collaborators,
}: NewCollaboratorDialogProps) {
    const [selectedContributor, setSelectedContributor] =
        useState<CollaboratorDetails>();
    const [open, setOpen] = useState(false);
    const [contributor, setContributor] = useState("");
    const [value, setValue] = useState("");
    const [state, action] = useFormState(addNewCollaborator, undefined);

    useEffect(() => {
        setContributor(selectedContributor?.c_p_user_id!);
        setValue(selectedContributor?.name!);
        setOpen(false);
    }, [selectedContributor]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PlusIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h3 className="text-xl font-bold">Propose investment</h3>
                <form className="space-y-4 mt-4" action={action}>
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.contributor,
                            })}
                            htmlFor="contributor"
                        >
                            Contributor
                        </Label>
                        <div>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="contributor"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {value
                                            ? value
                                            : "Select contributor..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-[50rem]"
                                >
                                    <CollaboratorsTable
                                        data={collaborators}
                                        columns={columns}
                                        onSelect={(contributor) =>
                                            setSelectedContributor(contributor)
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                            {state?.errors?.contributor && (
                                <p className="text-sm text-destructive font-semibold">
                                    {state.errors.contributor}
                                </p>
                            )}
                        </div>
                    </div>
                    <Input
                        type="hidden"
                        name="contributor"
                        value={contributor}
                    />
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.role,
                            })}
                            htmlFor="role"
                        >
                            Role
                        </Label>
                        <Input id="role" name="role" autoComplete="off" />
                        {state?.errors?.role && (
                            <p className="text-sm text-destructive font-semibold">
                                {state.errors.role}
                            </p>
                        )}
                    </div>
                    <Button>Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
