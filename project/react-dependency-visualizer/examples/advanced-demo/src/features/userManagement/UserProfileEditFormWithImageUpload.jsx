import React, { useEffect } from "react";
import { FileUploadWithPreview } from "../../components/forms/FileUploadWithPreview";
import { TextInputWithValidation } from "../../components/forms/TextInputWithValidation";
import { PrimaryButton } from "../../ui/Button";
import Card from "../../ui/Card";
import { withErrorBoundary } from "../../hoc/withErrorBoundary";
import { useAuthenticationState } from "../../hooks/useAuthenticationState";
import { usePrevious } from "../../hooks/usePrevious";

const UserProfileForm = () => {
    const { user } = useAuthenticationState();

    const value = usePrevious(user.name);

    useEffect(() => {
        console.log("user.name changed from", value, "to", user.name);
    }, [user.name, value]);

    return (
        <Card>
            <h2>Edit Profile</h2>
            <p>Editing profile for: {user.name}</p>
            <FileUploadWithPreview />
            <TextInputWithValidation />
            <TextInputWithValidation />
            <PrimaryButton />
        </Card>
    );
};

export const UserProfileEditFormWithImageUpload =
    withErrorBoundary(UserProfileForm);
