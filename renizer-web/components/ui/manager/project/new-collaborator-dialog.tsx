"use client";

import {
    ChevronsUpDown,
    CircleCheck,
    PlusIcon,
    TriangleAlert,
} from "lucide-react";
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
import { getMatchingRoles } from "@/lib/apis/project/apis";

interface NewCollaboratorDialogProps {
    projectId: string;
    collaborators: CollaboratorDetails[];
}

export default function NewCollaboratorDialog({
    projectId,
    collaborators,
}: NewCollaboratorDialogProps) {
    const [selectedContributor, setSelectedContributor] =
        useState<CollaboratorDetails>();
    const [open, setOpen] = useState(false);
    const [contributor, setContributor] = useState("");
    const [value, setValue] = useState("");
    const [role, setRole] = useState("");
    const [roleExists, setRoleExists] = useState(false);
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
                    <PlusIcon className="size-[1.25rem]" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h3 className="text-xl font-bold">Propose investment</h3>
                <form
                    className="space-y-[1.25rem] mt-[1.25rem]"
                    action={action}
                >
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
                                        <ChevronsUpDown className="ml-2 h-[1.25rem] w-[1.25rem] shrink-0 opacity-50" />
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
                        <Input
                            id="role"
                            name="role"
                            autoComplete="off"
                            onChange={(ev) => {
                                const newRole = ev.currentTarget.value;
                                setTimeout(async () => {
                                    const res = await getMatchingRoles(
                                        projectId,
                                        newRole
                                    );
                                    setRoleExists(res.length > 0);
                                }, 200);
                                setRole(newRole);
                            }}
                        />
                        {!roleExists && !role && state?.errors?.role && (
                            <p className="text-sm text-destructive font-semibold">
                                {state.errors.role}
                            </p>
                        )}
                        {role &&
                            (roleExists ? (
                                <div className="flex items-center space-x-1.5">
                                    <TriangleAlert className="size-[1.25rem] fill-destructive stroke-background" />
                                    <p className="text-sm text-destructive font-semibold">
                                        {role} already exits.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1.5">
                                    <CircleCheck className="size-[1.25rem] fill-green-500 stroke-background" />
                                    <p className="text-sm text-green-500 font-semibold">
                                        {role} is available.
                                    </p>
                                </div>
                            ))}
                    </div>
                    <Button disabled={roleExists}>Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
