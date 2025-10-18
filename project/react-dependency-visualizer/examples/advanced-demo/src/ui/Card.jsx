import React from "react";

const Card = React.forwardRef(({ children }, ref) => (
    <div
        ref={ref}
        style={{
            padding: "20px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "20px",
        }}
    >
        {children || (
            <>
                <h3>Card Title</h3>
                <p>Card content goes here</p>
            </>
        )}
    </div>
));

export default Card;
