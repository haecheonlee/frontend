import React from "react";
import { DataTableWithSortingAndPagination } from "../../components/data-display/DataTableWithSortingAndPagination";
import Card from "../../ui/Card";

export const UserPermissionsManagementPanel: React.FC = () => (
    <Card>
        <h2>User Permissions</h2>
        <DataTableWithSortingAndPagination />
    </Card>
);
