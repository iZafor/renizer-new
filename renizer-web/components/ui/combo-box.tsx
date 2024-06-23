import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import React, { ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComboBoxProps {
    values: string[];
    triggerButtonText?: string;
    defaultValue?: string;
    triggerButtonId?: string;
    TriggerItem?: ReactElement;
    inputPlaceholder: string;
    className?: string;
    onStateUpdate?: (state: string) => void;
}

export default function ComboBox({
    values,
    triggerButtonText,
    defaultValue,
    triggerButtonId,
    TriggerItem,
    inputPlaceholder,
    className,
    onStateUpdate,
}: ComboBoxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || "");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={className}>
                    {triggerButtonText !== undefined ? (
                        <Button
                            id={triggerButtonId}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between"
                        >
                            {value ? value : triggerButtonText}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    ) : (
                        TriggerItem
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent align="start">
                <Command>
                    <CommandInput placeholder={inputPlaceholder} />
                    <CommandList>
                        <CommandEmpty>No match found.</CommandEmpty>
                        <CommandGroup>
                            {values.map((val, idx) => (
                                <CommandItem
                                    key={val + idx}
                                    value={val}
                                    onSelect={() => {
                                        setValue(val);
                                        setOpen(false);
                                        onStateUpdate && onStateUpdate(val);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === val
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
    );
}
