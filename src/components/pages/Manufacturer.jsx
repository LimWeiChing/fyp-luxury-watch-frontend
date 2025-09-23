import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Manufacturer = () => {
  return <UnifiedDashboard config={dashboardConfigs.manufacturer} />;
};

export default Manufacturer;
