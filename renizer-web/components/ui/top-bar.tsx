import ThemeToggle from "@/components/ui/theme-toggle";

export default function TopBar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 grid place-items-center h-16">
            <ThemeToggle className="justify-self-end" />
        </header>
    );
}
