import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Admin = () => {
  return <UnifiedDashboard config={dashboardConfigs.admin} />;
};

export default Admin;
