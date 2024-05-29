import React from "react";
import { createRoot } from "react-dom/client";
import { MyComponent } from "component-library";

const App = () => {
    return (
        <div>
            <h1>Hello, Vite + React!</h1>
            <MyComponent />
        </div>
    );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
