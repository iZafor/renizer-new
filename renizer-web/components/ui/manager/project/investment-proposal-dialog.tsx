"use client";

import { ChevronsUpDown, CircleAlert, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { InvestorDetails, ProjectInvestment } from "@/lib/definitions";
import { useContext, useEffect, useState } from "react";
import { columns } from "@/components/ui/manager/project/investors-table/columns";
import DataTable from "@/components/ui/data-table";
import InvestorsTableToolbar from "./investors-table/investors-table-toolbar";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    useInvestorsDetailsQueryOptions,
    useProjectInvestmentsQueryOptions,
} from "@/lib/hooks/manager/use-project-query";
import { InvestmentProposalFormState } from "@/lib/schemas";
import { ProjectIdContext } from "@/lib/contexts/manager";

export default function InvestmentProposalDialog() {
    const { data: investors } = useQuery(useInvestorsDetailsQueryOptions());
    const projectId = useContext(ProjectIdContext);
    const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [investor, setInvestor] = useState("");
    const [value, setValue] = useState("");
    const [state, setState] = useState<InvestmentProposalFormState>(undefined);
    const projectInvestmentsQueryKey =
        useProjectInvestmentsQueryOptions(projectId).queryKey;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (formData: FormData) =>
            await fetch("/api/manager/dashboard/project/propose-investment", {
                method: "POST",
                body: formData,
            }).then((res) => res.json()),
        onSuccess: (data: InvestmentProposalFormState) => {
            if (data?.newInvestment) {
                queryClient.setQueryData(
                    projectInvestmentsQueryKey,
                    (old: ProjectInvestment[]) => [
                        {
                            ...data.newInvestment,
                            proposal_date: new Date(
                                data.newInvestment?.proposal_date!
                            ),
                        },
                        ...old,
                    ]
                );

                setValue("");
                setSelectedInvestor(undefined);
                setInvestor("");
                setOpen(false);
                setDialogOpen(false);
            }
            setState(data);
        },
    });

    useEffect(() => {
        setInvestor(selectedInvestor?.i_user_id!);
        setValue(selectedInvestor?.investor!);
        setOpen(false);
    }, [selectedInvestor]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PlusIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h3 className="text-xl font-bold">Propose investment</h3>
                <form
                    className="space-y-4 mt-4"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        mutation.mutate(new FormData(ev.currentTarget));
                    }}
                >
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.investor,
                            })}
                            htmlFor="investor"
                        >
                            Investor
                        </Label>
                        <div>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="investor"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {value ? value : "Select investor..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-[50rem]"
                                >
                                    <DataTable
                                        className="max-h-[10rem]"
                                        columns={columns}
                                        data={investors!}
                                        toolbar={InvestorsTableToolbar}
                                        onRowClicked={(investor) =>
                                            setSelectedInvestor(investor)
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                            {state?.errors?.investor && (
                                <p className="text-sm text-destructive font-semibold">
                                    {state.errors.investor}
                                </p>
                            )}
                        </div>
                    </div>
                    <Input type="hidden" name="projectId" value={projectId} />
                    <Input type="hidden" name="investor" value={investor} />
                    <div className="space-y-1.5">
                        <Label
                            className={cn("font-semibold", {
                                "text-destructive": state?.errors?.amount,
                            })}
                            htmlFor="amount"
                        >
                            Amount
                        </Label>
                        <Input id="amount" name="amount" autoComplete="off" />
                        {state?.errors?.amount && (
                            <p className="text-sm text-destructive font-semibold">
                                {state.errors.amount}
                            </p>
                        )}
                    </div>
                    <Button type="submit" disabled={mutation.isPending}>
                        Submit
                    </Button>
                    {state?.errors?.projectId && (
                        <div className="flex items-center space-x-1.5">
                            <CircleAlert className="size-4 fill-destructive stroke-background" />
                            <p className="text-sm text-destructive font-semibold">
                                {state.errors.projectId}
                            </p>
                        </div>
                    )}
                    {state?.message && (
                        <div className="flex items-center space-x-1.5">
                            <CircleAlert className="size-4 fill-destructive stroke-background" />
                            <p className="text-sm text-destructive font-semibold">
                                {state.message}
                            </p>
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
