"use client";

import {
    QueryClient,
    QueryClientProvider,
} from "react-query";
import { ThemeProvider } from "./theme-provider";

const client = new QueryClient();

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={client}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
}
