import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
    if (!text || typeof text !== "string") {
        return "";
    }
    return text[0].toUpperCase() + text.slice(1);
}

export function snakeCaseToUpperCase(text: string) {
    return text.split("_").map(capitalize).join(" ");
}

export function formatEnergyUnit(amount: number) {
    if (typeof amount !== "number" || Number.isNaN(amount)) {
        return "0 Wh";
    }
    if (amount < 1000) {
        return `${amount} Wh`;
    }
    if (amount < 1000000) {
        return `${(amount / 1000).toFixed(4)} KWh`;
    }
    if (amount < 1000000000) {
        return `${(amount / 1000000).toFixed(4)} MWh`;
    }
    return `${(amount / 1000000000).toFixed(4)} GWh`;
}

export function getInitial(name: string) {
    if (typeof name !== "string" || !name) {
        return "";
    }
    const parts = name.split(" ");
    return parts.length > 1
        ? parts[0][0] + parts[parts.length - 1][0]
        : name.substring(0, 2);
}
