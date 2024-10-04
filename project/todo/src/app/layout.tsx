import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/app/ui/side-nav";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
    title: "Todo Application",
    description:
        "Create, manage, and track your tasks effortlessly with our user-friendly to-do list app. Boost productivity and stay organized every day.",
    viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="w-full min-h-screen lg:py-0 py-2 flex justify-center items-center">
                <div className="flex items-center justify-center">
                    <div className="lg:flex gap-4">
                        <AppProvider>
                            <div className="min-w-[350px] max-w-[350px]">
                                <SideNav />
                            </div>
                            <div className="flex-auto rounded-md py-4 max-w-[350px] lg:px-4 lg:py-0 lg:min-w-[500px]">
                                {children}
                            </div>
                        </AppProvider>
                    </div>
                </div>
            </body>
        </html>
    );
}
