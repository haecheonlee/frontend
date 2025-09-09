export interface ComponentInfo {
    file: string;
    imports: string[];
    renders: string[];
}

export interface CommandOptions {
    generateHtml?: boolean;
    output: string;
}
