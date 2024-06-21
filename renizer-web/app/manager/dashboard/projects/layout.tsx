"use client";

import { ManagerIdContext } from "@/lib/contexts/manager";

export default function ProjectsLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ManagerIdContext.Provider value="928fd1c4-26dc-11ef-b68d-0045e2d4f24d">
            {children}
        </ManagerIdContext.Provider>
    );
}
