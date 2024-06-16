import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
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
                <Providers>
                    <div className="px-4">
                        <TopBar />
                        <div className="mt-4">{children}</div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
