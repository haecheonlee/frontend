import SideNav from "./ui/side-nav";

export default function Home() {
    return (
        <div className="flex items-center justify-center">
            <div className="min-w-[1400px] max-w-[1400px] min-h-[800px] max-h-[800px] flex">
                <div className="flex-auto">
                    <SideNav />
                </div>
                <div className="flex-4"></div>
            </div>
        </div>
    );
}
