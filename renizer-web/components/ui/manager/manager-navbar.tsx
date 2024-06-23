"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ManagerNavbar({ className }: { className?: string }) {
    const pathname = usePathname();
    if (!pathname.startsWith("/manager")) {
        return <></>;
    }

    return (
        <nav className={cn("flex items-center gap-6 text-sm", className)}>
            <Link
                href="/manager/dashboard/projects"
                className={cn(
                    "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    {
                        "hover:text-gray-500 text-gray-900 hover:dark:text-gray-400 dark:text-gray-50":
                            pathname === "/manager/dashboard/projects",
                    }
                )}
            >
                Projects
            </Link>
            <Link
                href="/manager/dashboard/analytics"
                className={cn(
                    "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    {
                        "hover:text-gray-500 text-gray-900 hover:dark:text-gray-400 dark:text-gray-50":
                            pathname === "/manager/dashboard/analytics",
                    }
                )}
            >
                Analytics
            </Link>
            <Link
                href="/manager/dashboard/notifications"
                className={cn(
                    "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    {
                        "hover:text-gray-500 text-gray-900 hover:dark:text-gray-400 dark:text-gray-50":
                            pathname === "/manager/dashboard/notifications",
                    }
                )}
            >
                Notifications
            </Link>
        </nav>
    );
}
