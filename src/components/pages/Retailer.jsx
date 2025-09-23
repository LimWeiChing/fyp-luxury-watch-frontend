import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Retailer = () => {
  return <UnifiedDashboard config={dashboardConfigs.retailer} />;
};

export default Retailer;
