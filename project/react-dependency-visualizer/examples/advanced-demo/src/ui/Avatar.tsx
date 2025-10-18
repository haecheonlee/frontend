import React from "react";

const Avatar = React.forwardRef<HTMLDivElement>((props, ref) => (
    <div
        ref={ref}
        style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#3b82f6",
            display: "inline-block",
        }}
    />
));

export default Avatar;
