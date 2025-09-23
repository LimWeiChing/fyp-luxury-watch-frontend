import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Supplier = () => {
  return <UnifiedDashboard config={dashboardConfigs.supplier} />;
};

export default Supplier;
