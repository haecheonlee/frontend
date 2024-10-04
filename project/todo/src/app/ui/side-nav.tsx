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
import { getTags, getTodoCountByTypes, getTypes } from "@/utils/local-storage";
import { useContext, useEffect, useState } from "react";
import { Tag, Type } from "@/types/types";
import CreateTag from "./tag/create-tag";
import { AppContext } from "@/context/AppContext";
import { toTitleCase } from "@/lib/utils";

const links = Object.freeze([
    {
        name: "Upcoming",
        href: "/",
        icon: DoubleArrowRightIcon,
    },
] as const);

export default function SideNav() {
    const context = useContext(AppContext);
    const pathname = usePathname();
    const [types, setTypes] = useState<Type[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [todoCount, setTodoCount] = useState<{
        [typeId: string]: number;
    }>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const types = getTypes();
            setTypes(types);
            setTodoCount(getTodoCountByTypes(types.map((type) => type.id)));
            setTags(getTags());
        }
    }, [context.forceToRenderSidebar]);

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
                                "flex items-center px-1 py-2 hover:bg-neutral-700 justify-between",
                                {
                                    "font-bold": href === pathname,
                                }
                            )}
                        >
                            <div className="flex">
                                <span
                                    className={`w-4 h-4 mr-2 rounded-sm`}
                                    style={{ backgroundColor: type.color }}
                                />
                                <TypographySmall>
                                    {toTitleCase(type.title)}
                                </TypographySmall>
                            </div>
                            <TypographyXSmall className="p-1 bg-neutral-600 rounded-sm">
                                {todoCount[type.id] ?? 0}
                            </TypographyXSmall>
                        </Link>
                    );
                })}
                <CreateList />
            </div>
            <HorizontalDivider />
            <div>
                <div>
                    <TypographyXSmall isUppercase>Tags</TypographyXSmall>
                </div>
                {tags.map((tag) => {
                    const href = `/tag/${tag.id}`;

                    return (
                        <Link
                            key={tag.id}
                            href={href}
                            className={clsx(
                                "mr-2 inline-block px-2 py-1 mb-3 text-center rounded-sm hover:bg-neutral-700 hover:opacity-90",
                                {
                                    "font-bold": href === pathname,
                                }
                            )}
                            style={{ backgroundColor: tag.color }}
                        >
                            <TypographySmall>
                                {toTitleCase(tag.title)}
                            </TypographySmall>
                        </Link>
                    );
                })}
                <CreateTag />
            </div>
        </div>
    );
}
