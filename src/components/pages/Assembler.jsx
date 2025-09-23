import React from "react";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Assembler = () => {
  return <UnifiedDashboard config={dashboardConfigs.assembler} />;
};

export default Assembler;
