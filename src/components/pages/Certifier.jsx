import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Certifier = () => {
  return <UnifiedDashboard config={dashboardConfigs.certifier} />;
};

export default Certifier;
