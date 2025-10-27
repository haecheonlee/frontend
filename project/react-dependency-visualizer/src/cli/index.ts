import { Command } from "commander";
import { start } from "../core/parser";

const program = new Command();

program
    .name("react-dependency-visualizer")
    .description("Visualize React components in your project.")
    .version("1.0.0");

program
    .argument("<path>", "Path to the root of your React project.")
    .option(
        "-o, --output <path>",
        "Output path for the HTML file",
        "index.html"
    )
    .action(async (path, options: CommandOptions) => {
        try {
            await start(path, options);
        } catch (error) {
            console.log(`An error occurred: ${error}`);
            process.exit(1);
        }
    });

program.parse(process.argv);
