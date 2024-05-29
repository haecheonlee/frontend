import React, { useState } from "react";
import { isOdd } from "utils";

export const MyComponent = () => {
    const [value, setValue] = useState(0);

    const onChange = (e) => setValue(e.target.value);

    return (
        <div style={{ border: "1px solid black", padding: "15px" }}>
            <h1>This is a component from component-library</h1>
            <div>
                <input type="number" value={value} onChange={onChange} />
                <p>
                    Is {value} Odd?: <span>{isOdd(value) ? "Yes" : "No"}</span>
                </p>
            </div>
        </div>
    );
};
