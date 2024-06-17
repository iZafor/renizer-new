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
import { InvestorDetails } from "@/lib/definitions";
import { useEffect, useState } from "react";
import InvestorsTable from "@/components/ui/manager/project/investors-table/investors-table";
import { columns } from "@/components/ui/manager/project/investors-table/columns";
import { useFormState } from "react-dom";
import { proposeInvestment } from "./investors-table/actions";
import { cn } from "@/lib/utils";

interface InvestmentProposalDialogProps {
    investors: InvestorDetails[];
}

export default function InvestmentProposalDialog({
    investors,
}: InvestmentProposalDialogProps) {
    const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails>();
    const [open, setOpen] = useState(false);
    const [investor, setInvestor] = useState("");
    const [value, setValue] = useState("");
    const [state, action] = useFormState(proposeInvestment, undefined);

    useEffect(() => {
        setInvestor(selectedInvestor?.i_user_id!);
        setValue(selectedInvestor?.investor!);
        setOpen(false);
    }, [selectedInvestor]);

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
                                    <InvestorsTable
                                        data={investors}
                                        columns={columns}
                                        onSelect={(investor) =>
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
                        <Input id="amount" name="amount" autoComplete="off"/>
                        {state?.errors?.amount && (
                            <p className="text-sm text-destructive font-semibold">
                                {state.errors.amount}
                            </p>
                        )}
                    </div>
                    <Button>Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
