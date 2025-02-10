import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col w-[1024px]">
                <header className="flex flex-row items-center justify-between">
                    <Image
                        src="/stm-logo.png"
                        alt="STM logo"
                        width={64}
                        height={64}
                    />
                </header>
                <main className="w-full flex-1 flex flex-row items-center gap-4">
                    <div className="flex-1">
                        <div className="flex flex-col gap-4">
                            <Input type="text" placeholder="from" />
                            <Input type="text" placeholder="to" />
                        </div>
                    </div>
                    <div className="flex-3 bg-red-200 overflow-hidden">
                        Right
                    </div>
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
