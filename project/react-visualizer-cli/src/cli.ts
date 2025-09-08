import { Command } from "commander";
import { visualizeComponents } from "./index";

const program = new Command();

program
    .name("react-visualizer-cli")
    .description("Visualize React components in your project.")
    .version("1.0.0");

program
    .argument("<path>", "Path to the root of your React project.")
    .action(async (path) => {
        try {
            await visualizeComponents(path);
        } catch (error) {
            console.log(`An error occurred: ${error}`);
            process.exit(1);
        }
    });

program.parse(process.argv);
