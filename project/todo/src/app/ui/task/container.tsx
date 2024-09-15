import { TypographyH3 } from "@/components/ui/typography";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Container({
    title,
    children,
    hideLink,
}: Readonly<{
    title?: string;
    children?: React.ReactNode;
    hideLink?: boolean;
}>) {
    return (
        <div className="p-4 border border-neutral-500 rounded-md">
            {!hideLink && (
                <div className="flex justify-between mb-2">
                    <TypographyH3>{title}</TypographyH3>
                    <Link
                        href="/create"
                        className="justify-self-end self-center"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </Link>
                </div>
            )}
            {children}
        </div>
    );
}
