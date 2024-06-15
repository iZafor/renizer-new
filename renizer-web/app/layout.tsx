import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import TopBar from "@/components/ui/top-bar";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
    title: "REnizer",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={roboto.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TopBar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
