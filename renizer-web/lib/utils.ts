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

export function formatNumber(val: number) {
    if (typeof val !== "number" || Number.isNaN(val)) {
        return "0";
    }
    if (val < 1000) {
        return `${val}`;
    }
    if (val < 1000000) {
        return `${(val / 1000).toFixed(2)} K`;
    }
    if (val < 1000000000) {
        return `${(val / 1000000).toFixed(2)} M`;
    }
    return `${(val / 1000000000).toFixed(2)} B`;
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

/**
 * Checks only the date part skipping the time
 *
 * @param date1
 * @param date2
 *
 * @returns true if date1 < date2 otherwise false
 */
export function isDateEarlier(date1: Date, date2: Date) {
    if (date1.getFullYear() < date2.getFullYear()) {
        return true;
    }
    if (date1.getFullYear() > date2.getFullYear()) {
        return false;
    }
    if (date1.getMonth() < date2.getMonth()) {
        return true;
    }
    if (date1.getMonth() > date2.getMonth()) {
        return false;
    }
    if (date1.getDate() < date2.getDate()) {
        return true;
    }
    return false;
}

export function isNumber(text: string) {
    if (typeof text === "number") {
        return true;
    }
    if (typeof text !== "string") {
        return false;
    }
    return text ? !isNaN(text as unknown as number) : false;
}
