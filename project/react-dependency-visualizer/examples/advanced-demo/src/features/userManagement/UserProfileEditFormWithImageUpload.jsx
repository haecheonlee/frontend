import React from "react";
import { FileUploadWithPreview } from "../../components/forms/FileUploadWithPreview";
import { TextInputWithValidation } from "../../components/forms/TextInputWithValidation";
import { PrimaryButton } from "../../ui/Button";
import Card from "../../ui/Card";
import { withErrorBoundary } from "../../hoc/withErrorBoundary";
import { useAuthenticationState } from "../../hooks/useAuthenticationState";

const UserProfileForm = () => {
    const { user } = useAuthenticationState();

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
