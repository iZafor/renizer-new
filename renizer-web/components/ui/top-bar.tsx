import ThemeToggle from "@/components/ui/theme-toggle";
import ManagerNavbar from "./manager/manager-navbar";

export default function TopBar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 grid grid-flow-col items-center h-16">
            <ManagerNavbar className="justify-self-start"/>
            <ThemeToggle className="justify-self-end" />
        </header>
    );
}
