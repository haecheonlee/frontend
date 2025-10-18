import React from "react";

export const withAuthenticationCheck = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    return (props: P) => {
        const isAuthenticated = true;
        if (!isAuthenticated) {
            return <div>Please login</div>;
        }
        return <Component {...props} />;
    };
};
