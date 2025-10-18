import React from "react";
import { SidebarWithCollapsibleMenu } from "../../../components/layout/SidebarWithCollapsibleMenu";
import { RealtimeDataVisualizationChart } from "./widgets/RealtimeDataVisualizationChart";
import { UserActivityTimelineWidget } from "./widgets/UserActivityTimelineWidget";
import { DataTableWithSortingAndPagination } from "../../../components/data-display/DataTableWithSortingAndPagination";
import { withAuthenticationCheck } from "../../../hoc/withAuthenticationCheck";
import { withLoadingSpinner } from "../../../hoc/withLoadingSpinner";

const Dashboard: React.FC = () => (
    <div style={{ display: "flex", minHeight: "80vh" }}>
        <SidebarWithCollapsibleMenu />
        <main style={{ flex: 1, padding: "20px" }}>
            <h1>Dashboard</h1>
            <RealtimeDataVisualizationChart />
            <UserActivityTimelineWidget />
            <DataTableWithSortingAndPagination />
        </main>
    </div>
);

const DashboardLayoutWithResponsiveSidebar = withAuthenticationCheck(
    withLoadingSpinner(Dashboard)
);

export default DashboardLayoutWithResponsiveSidebar;
