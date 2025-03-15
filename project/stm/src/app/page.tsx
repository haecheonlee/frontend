import { gtfsFileClient } from "@/api/clients";
import DynamicMap from "@/components/dynamic-map";
import StopMenu from "@/components/stop-menu";
import { GtfsProvider } from "@/context/gtfs-context";
import { StopProvider } from "@/context/stop-context";
import { VehicleProvider } from "@/context/vehicle-context";
import { GtfsFileType } from "@/types/api";
import {
    Agency,
    Calendar,
    CalendarDates,
    FeedInfo,
    Routes,
    Shapes,
    Stops,
    Trips,
} from "@/types/gtfs";
import Image from "next/image";

type GtfsFileMapping = {
    agency: Agency;
    calendar_dates: CalendarDates;
    calendar: Calendar;
    feed_info: FeedInfo;
    routes: Routes;
    shapes: Shapes;
    stops: Stops;
    trips: Trips;
};

const fileNames: ReadonlyArray<Exclude<GtfsFileType, "stop_times">> = [
    "agency",
    "calendar_dates",
    "calendar",
    "feed_info",
    "routes",
    "shapes",
    "stops",
    "trips",
];

const gtfsPromises = fileNames.map((fileName) =>
    gtfsFileClient<GtfsFileMapping[typeof fileName]>(fileName)
);

export default async function Home() {
    const data = await Promise.all(gtfsPromises);
    const [
        agency,
        calendarDate,
        calendar,
        feedInfo,
        routes,
        shapes,
        stops,
        trips,
    ] = data as [
        ReadonlyArray<Agency>,
        ReadonlyArray<CalendarDates>,
        ReadonlyArray<Calendar>,
        ReadonlyArray<FeedInfo>,
        ReadonlyArray<Routes>,
        ReadonlyArray<Shapes>,
        ReadonlyArray<Stops>,
        ReadonlyArray<Trips>
    ];

    return (
        <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col w-[1024px] h-[468px]">
                <header className="flex flex-row items-center justify-between">
                    <Image
                        src="/stm-logo.png"
                        alt="STM logo"
                        width={64}
                        height={64}
                    />
                </header>
                <main className="w-full flex-1 flex flex-row gap-4 w-[1024px] h-[415px]">
                    <GtfsProvider
                        data={{
                            agency,
                            calendarDate,
                            calendar,
                            feedInfo,
                            routes,
                            shapes,
                            stops,
                            trips,
                        }}
                    >
                        <StopProvider>
                            <VehicleProvider>
                                <div className="flex-1 h-full">
                                    <StopMenu />
                                </div>
                                <div className="flex-3 h-full">
                                    <DynamicMap />
                                </div>
                            </VehicleProvider>
                        </StopProvider>
                    </GtfsProvider>
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
