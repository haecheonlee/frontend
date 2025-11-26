# React Dependency Visualizer

A CLI tool to visualize React component dependencies in your project.

## Overview

React Dependency Visualizer analyzes your React project and generates an HTML visualization showing the relationships between your components. This helps you understand your component architecture and identify tightly coupled components.

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

```bash
npm start <path>
```

This will analyze your React project in the specified directory and output a visualization to `./dist/index.html`.

### Options

```bash
npm start <path> -- [options]
```

**Note:** Make sure to run `npm run build` first to compile the TypeScript code.

#### Arguments

-   `<path>` - Path to the root of your React project (required)

#### Options

-   `-o, --output <path>` - Output path for the HTML file (default: `./dist/index.html`)
-   `-e, --exclude <folders>` - Comma-separated folders to exclude from analysis (e.g., `node_modules,dist,components/ui`)

### Examples

**Analyze a specific directory:**

```bash
npm start ./src
```

**Generate a custom output:**

```bash
npm start ./src -- -o ./dist/example.html
```

**Exclude specific folders:**

```bash
npm start ./src -- -e node_modules,dist,test
```

**Exclude UI library components:**

```bash
npm start ./src -- -e components/ui,lib
```
