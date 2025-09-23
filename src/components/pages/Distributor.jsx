import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Distributor = () => {
  return <UnifiedDashboard config={dashboardConfigs.distributor} />;
};
export default Distributor;
