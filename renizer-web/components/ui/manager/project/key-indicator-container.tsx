import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CircleAlert, Edit } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { ProjectMonoStateUpdateFormState } from "@/lib/schemas";
import { useMutation, type MutationFunction } from "@tanstack/react-query";
import { ProjectIdContext } from "@/lib/contexts/manager";

interface KeyIndicatorContainerProps {
    className?: string;
    title: string;
    data: string;
}

export function KeyIndicatorContainer({
    className,
    title,
    data,
}: KeyIndicatorContainerProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="font-semibold">{data}</p>
        </div>
    );
}

interface EditableKeyIndicatorContainerProps<TVariables = FormData> {
    className?: string;
    title: string;
    data: unknown;
    formatter: (data: unknown) => string;
    mutationFn: MutationFunction<ProjectMonoStateUpdateFormState, TVariables>;
    onSuccess: (
        data: ProjectMonoStateUpdateFormState
    ) => Promise<unknown> | unknown;
}

export function EditableKeyIndicatorContainer<TVariables = FormData>({
    className,
    title,
    data,
    formatter,
    mutationFn,
    onSuccess,
}: EditableKeyIndicatorContainerProps<TVariables>) {
    const projectId = useContext(ProjectIdContext);
    const [open, setOpen] = useState(false);
    const [state, setState] =
        useState<ProjectMonoStateUpdateFormState>(undefined);
    const mutation = useMutation<
        ProjectMonoStateUpdateFormState,
        unknown,
        TVariables,
        unknown
    >({
        mutationFn,
        onSuccess: (newState) => {
            if (newState?.updatedValue !== undefined) {
                setOpen(false);
                onSuccess(newState);
            }
            setState(newState);
        },
    });

    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex gap-2 items-center">
                <p className="text-sm text-muted-foreground">{title}</p>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Edit className="size-4" />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Update {title}</DialogTitle>
                        <form
                            className="space-y-4"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                mutation.mutate(
                                    new FormData(ev.currentTarget) as TVariables
                                );
                            }}
                        >
                            <input
                                type="hidden"
                                value={projectId}
                                name="projectId"
                            />
                            <div className="space-y-1.5">
                                <Input
                                    defaultValue={`${data}`}
                                    name="value"
                                    autoComplete="off"
                                />
                                {state?.errors?.value && (
                                    <p className="font-semibold text-destructive text-sm">
                                        {state.errors.value}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" disabled={mutation.isPending}>
                                Update
                            </Button>
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
            </div>
            <p>{formatter(data)}</p>
        </div>
    );
}
