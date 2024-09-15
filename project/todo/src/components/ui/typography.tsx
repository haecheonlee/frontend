import clsx from "clsx";

export function TypographyH1({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    );
}

export function TypographyH3({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    );
}

export function TypographyP({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function TypographyLarge({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <span className="text-lg">{children}</span>;
}

export function TypographySmall({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <span className={clsx("text-sm leading-none")}>{children}</span>;
}

export function TypographyXSmall({
    children,
    className,
    isUppercase,
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    isUppercase?: boolean;
}>) {
    return (
        <span
            className={clsx("text-xs leading-none", className, {
                uppercase: isUppercase,
            })}
        >
            {children}
        </span>
    );
}
