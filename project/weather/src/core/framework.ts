export function html(
    strings: TemplateStringsArray,
    ...values: string[]
): HTMLElement {
    const template = document.createElement("template");
    template.content.append(
        strings.reduce(
            (value, accumulative, index) =>
                value + accumulative + (values[index] || ""),
            ""
        )
    );
    return template.content.firstChild as HTMLElement;
}
