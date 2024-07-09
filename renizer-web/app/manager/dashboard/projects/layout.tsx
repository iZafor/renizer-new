"use client";

import { ManagerIdContext } from "@/lib/contexts/manager";

export default function ProjectsLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ManagerIdContext.Provider value="4f3b3e2d-7737-4e0e-945a-8d80b2ec6156">
            {children}
        </ManagerIdContext.Provider>
    );
}
