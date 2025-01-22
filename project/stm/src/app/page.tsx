export default function Home() {
    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="w-full flex-3 flex flex-row items-center sm:items-start">
                <div className="flex-1 bg-blue-200">Left</div>
                <div className="flex-3 bg-red-200 overflow-hidden">Right</div>
            </main>
            <footer className="flex flex-1 gap-6 flex-wrap items-center justify-center">
                <a
                    href="https://github.com/haecheonlee"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    github
                </a>{" "}
            </footer>
        </div>
    );
}
