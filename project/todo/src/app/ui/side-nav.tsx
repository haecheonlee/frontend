"use client";

import {
    TypographyH3,
    TypographySmall,
    TypographyXSmall,
} from "@/components/ui/typography";
import HorizontalDivider from "./horizontal-divider";
import { usePathname } from "next/navigation";
import { DoubleArrowRightIcon, ListBulletIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import clsx from "clsx";

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

export default function SideNav() {
    const pathname = usePathname();

    return (
        <div className="bg-neutral-800 p-4 rounded-md">
            <div className="flex items-stretch mb-5">
                <TypographyH3>Menu</TypographyH3>
            </div>
            <div>
                <TypographyXSmall isUppercase>Tasks</TypographyXSmall>
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
                            <LinkIcon className="w-4 h-4 mr-4" />
                            <TypographySmall>{link.name}</TypographySmall>
                        </Link>
                    );
                })}
            </div>
            <HorizontalDivider />
            <div>
                <TypographyXSmall isUppercase>Lists</TypographyXSmall>
            </div>
            <HorizontalDivider />
            <div>
                <TypographyXSmall isUppercase>Tags</TypographyXSmall>
            </div>
        </div>
    );
}
