import React from "react";

export const FileUploadWithPreview = () => (
    <div style={{ marginBottom: "15px" }}>
        <input type="file" />
        <div
            style={{
                marginTop: "10px",
                width: "100px",
                height: "100px",
                background: "#f0f0f0",
                borderRadius: "4px",
            }}
        >
            Preview
        </div>
    </div>
);
