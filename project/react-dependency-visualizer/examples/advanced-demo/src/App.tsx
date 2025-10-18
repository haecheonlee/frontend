import React from "react";
import DashboardLayoutWithResponsiveSidebar from "./features/dashboard/components/DashboardLayoutWithResponsiveSidebar";
import { ResponsiveNavigationBarWithDropdown } from "./components/layout/ResponsiveNavigationBarWithDropdown";
import { FooterWithSocialLinks } from "./components/layout/FooterWithSocialLinks";

const App: React.FC = () => (
    <div>
        <ResponsiveNavigationBarWithDropdown />
        <DashboardLayoutWithResponsiveSidebar />
        <FooterWithSocialLinks />
    </div>
);

export default App;
