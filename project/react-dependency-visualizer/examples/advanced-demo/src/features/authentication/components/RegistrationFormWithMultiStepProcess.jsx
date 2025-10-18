import React from "react";
import { DropdownSelectWithSearch } from "../../../components/forms/DropdownSelectWithSearch";
import { FileUploadWithPreview } from "../../../components/forms/FileUploadWithPreview";
import { PrimaryButton } from "../../../ui/Button";

export const RegistrationFormWithMultiStepProcess = () => (
    <form style={{ padding: "20px", maxWidth: "500px" }}>
        <h2>Register</h2>
        <DropdownSelectWithSearch />
        <FileUploadWithPreview />
        <PrimaryButton />
    </form>
);
