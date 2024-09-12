"use client";

import {
    TypographyH3,
    TypographySmall,
    TypographyXSmall,
} from "@/components/ui/typography";
import HorizontalDivider from "./horizontal-divider";
import { usePathname } from "next/navigation";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import clsx from "clsx";
import CreateList from "./list/create-list";
import { getTypes } from "@/utils/local-storage";
import { useEffect, useState } from "react";
import { Type } from "@/types/types";

const links = Object.freeze([
    {
        name: "Upcoming",
        href: "/",
        icon: DoubleArrowRightIcon,
    },
] as const);

export default function SideNav() {
    const pathname = usePathname();
    const [types, setTypes] = useState<Type[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTypes(getTypes());
        }
    }, []);

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
                            className={clsx(
                                "flex items-center px-1 py-2 hover:bg-neutral-700",
                                {
                                    "font-bold": link.href === pathname,
                                }
                            )}
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
                {types.map((type) => {
                    const href = `/list/${type.id}`;

                    return (
                        <Link
                            key={type.id}
                            href={href}
                            className={clsx(
                                "flex items-center px-1 py-2 hover:bg-neutral-700",
                                {
                                    "font-bold": href === pathname,
                                }
                            )}
                        >
                            <span
                                className={`w-4 h-4 mr-4 bg-[${type.color}] rounded-sm`}
                            />
                            <TypographySmall>{type.title}</TypographySmall>
                        </Link>
                    );
                })}
                <CreateList />
            </div>
            <HorizontalDivider />
            <div>
                <TypographyXSmall isUppercase>Tags</TypographyXSmall>
            </div>
        </div>
    );
}
