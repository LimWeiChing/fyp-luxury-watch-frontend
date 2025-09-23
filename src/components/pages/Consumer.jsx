import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import UnifiedDashboard from "./UnifiedDashboard";
import { dashboardConfigs } from "./dashboardConfigs";

const Consumer = () => {
  // Add custom content to consumer config
  const consumerConfig = {
    ...dashboardConfigs.consumer,
  };

  return <UnifiedDashboard config={consumerConfig} />;
};

export default Consumer;
