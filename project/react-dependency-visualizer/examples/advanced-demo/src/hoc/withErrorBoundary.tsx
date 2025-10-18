import React from "react";

export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    return (props: P) => {
        try {
            return <Component {...props} />;
        } catch (error) {
            return <div>Error occurred</div>;
        }
    };
};
