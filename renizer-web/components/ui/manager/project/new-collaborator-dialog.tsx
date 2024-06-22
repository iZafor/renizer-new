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
import { CollaboratorDetails, ProjectCollaboration } from "@/lib/definitions";
import { useContext, useEffect, useState } from "react";
import { columns } from "@/components/ui/manager/project/collaborators-table/columns";
import DataTable from "@/components/ui/data-table";
import CollaboratorsTableToolbar from "./collaborators-table/collaborators-table-toolbar";
import { cn } from "@/lib/utils";
import { getMatchingRoles } from "@/lib/apis/manager/project/apis";
import { NewCollaboratorFormState } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    useCollaboratorsDetailsQueryOptions,
    useProjectCollaborationsQueryOptions,
} from "@/lib/hooks/manager/use-project-query";
import { ProjectIdContext } from "@/lib/contexts/manager";

export default function NewCollaboratorDialog() {
    const projectId = useContext(ProjectIdContext);
    const { data: collaborators } = useQuery(
        useCollaboratorsDetailsQueryOptions(projectId)
    );
    const [selectedContributor, setSelectedContributor] =
        useState<CollaboratorDetails>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [contributor, setContributor] = useState("");
    const [value, setValue] = useState("");
    const [role, setRole] = useState("");
    const [roleExists, setRoleExists] = useState(false);
    const [state, setState] = useState<NewCollaboratorFormState>(undefined);
    const collaboratorsQueryKey =
        useCollaboratorsDetailsQueryOptions(projectId).queryKey;
    const projectCollaborationsQueryKey =
        useProjectCollaborationsQueryOptions(projectId).queryKey;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (formData: FormData) =>
            await fetch("/api/manager/dashboard/project/new-collaboration", {
                method: "POST",
                body: formData,
            }).then((res) => res.json()),
        onSuccess: (data: NewCollaboratorFormState) => {
            if (data?.newCollaboration) {
                data.newCollaboration.start_date = new Date(
                    data.newCollaboration.start_date!
                );
                queryClient.setQueryData(
                    projectCollaborationsQueryKey,
                    (old: ProjectCollaboration[]) => [
                        data.newCollaboration,
                        ...old,
                    ]
                );
                queryClient.setQueryData(
                    collaboratorsQueryKey,
                    (old: CollaboratorDetails[]) =>
                        old.filter(
                            (col) =>
                                col.c_p_user_id !==
                                data.newCollaboration?.p_user_id
                        )
                );

                setOpen(false);
                setDialogOpen(false);
                setValue("");
                setContributor("");
                setRole("");
                setRoleExists(false);
            }
            setState(data);
        },
    });

    useEffect(() => {
        setContributor(selectedContributor?.c_p_user_id!);
        setValue(selectedContributor?.name!);
        setOpen(false);
    }, [selectedContributor]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PlusIcon className="size-[1.25rem]" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h3 className="text-xl font-bold">Propose investment</h3>
                <form
                    className="space-y-[1.25rem] mt-[1.25rem]"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        mutation.mutate(new FormData(ev.currentTarget));
                    }}
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
                                    <DataTable
                                        className="max-h-[20rem]"
                                        columns={columns}
                                        data={collaborators!}
                                        toolbar={CollaboratorsTableToolbar}
                                        onRowClicked={(contributor) =>
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
                    <Input type="hidden" name="projectId" value={projectId} />
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
                    <Button disabled={roleExists || mutation.isPending}>
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
