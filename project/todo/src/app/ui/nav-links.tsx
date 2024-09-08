"use client";

import { TypographySmall } from "@/components/ui/typography";
import { DoubleArrowRightIcon, ListBulletIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = Object.freeze([
    {
        name: "Upcoming",
        href: "/",
        icon: DoubleArrowRightIcon,
    },
    {
        name: "Today",
        href: "/today",
        icon: ListBulletIcon,
    },
] as const);

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx("flex items-center px-1 py-2", {
                            "font-bold": link.href === pathname,
                        })}
                    >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <TypographySmall>{link.name}</TypographySmall>
                    </Link>
                );
            })}
        </>
    );
}
