import { gtfsFileClient } from "@/api/clients";
import Map from "@/components/map";
import RoutesList from "@/components/routes-list";
import { RoutesProvider } from "@/context/RoutesContext";
import { Routes } from "@/types/gtfs";
import Image from "next/image";

export default async function Home() {
    const routes = await gtfsFileClient<Routes>("routes");

    return (
        <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col w-[1024px] h-[450px]">
                <header className="flex flex-row items-center justify-between">
                    <Image
                        src="/stm-logo.png"
                        alt="STM logo"
                        width={64}
                        height={64}
                    />
                </header>
                <main className="w-full flex-1 flex flex-row gap-4 w-[1024px] h-[405px]">
                    <RoutesProvider>
                        <div className="flex-1 h-full">
                            <RoutesList routesList={routes} />
                        </div>
                        <div className="flex-3 h-full">
                            <Map />
                        </div>
                    </RoutesProvider>
                </main>
                <footer className="flex flex-wrap items-center justify-center">
                    <a
                        href="https://github.com/haecheonlee"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        github
                    </a>
                </footer>
            </div>
        </div>
    );
}
