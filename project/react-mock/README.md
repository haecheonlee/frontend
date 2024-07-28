# React Mock

This project provides a simple mockup of React to be used in vanilla JavaScript. It is designed for educational purposes.

## Introduction

This enables you to mimic the functionality of useState and useEffect hooks. Also, it provides a basic virtual DOM system in a plain JavaScript environment.

## Features

### v-dom

-   **Simple Virtual DOM**: Provides a basic virtual DOM system for managing and updating DOM elements in a plain JavaScript environment.
-   **Efficient Updates**: Mimics the efficient update mechanism of React's virtual DOM to minimize direct DOM manipulations.

### useState

-   **State Management**: Simulates React's `useState` hook for managing component state in a plain JavaScript environment.
-   **State Updates**: Provides a function to update state, triggering re-renders in the virtual DOM system.

### useEffect

-   **Side Effects**: Simulates React's `useEffect` hook for handling side effects in components.
-   **Dependency Management**: Allows specifying dependencies that determine when the effect should re-run.

## Limitations

### Focus on Input Elements

This does not handle focus correctly for input elements. Typing in input fields or interacting with elements that need focus does not work as expected, after re-rendering.

### Animations

Animations are not fully supported. While you can define CSS animations, the mock virtual DOM does not manage animation states or transitions after updating an state and it re-renders the application.

## Example

This section walks you through setting up and using this library.

### 1. Setup root

Create a root for the entry point and render a component:

```bash
import { App } from "./App";

createRoot(document.getElementById("app")).render(App);
```

### 2. Create a component

Set up a component with useState and useEffect:

```bash
import { useEffect, useState } from "@/core/hook";

function App() {
    const [value, setValue] = useState("");

    useEffect(() => {
        console.log(value);
    }, [value]);

    return v(
        "div",
        {},
        v("div", {}, value)
    );
}

export { App };
```
