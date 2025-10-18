import React from "react";

export const withLoadingSpinner = (Component) => {
    return (props) => {
        const isLoading = false;
        if (isLoading) {
            return <div>Loading...</div>;
        }
        return <Component {...props} />;
    };
};
