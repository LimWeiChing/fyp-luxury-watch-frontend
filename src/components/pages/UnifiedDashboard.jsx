import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(169, 169, 169, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(169, 169, 169, 0.6);
  }
`;

// Styled Components
const DashboardCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  borderRadius: "16px",
  color: "#ffffff",
  transition: "all 0.3s ease",
  animation: `${fadeInUp} 0.6s ease-out`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
  },
}));

const StyledActionCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(45deg, #2f2f2f 30%, #4a4a4a 90%)",
  border: "1px solid rgba(169, 169, 169, 0.3)",
  borderRadius: "12px",
  color: "#ffffff",
  cursor: "pointer",
  transition: "all 0.3s ease",
  height: "140px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(169, 169, 169, 0.2), transparent)",
    transition: "left 0.5s ease",
  },

  "&:hover": {
    background: "linear-gradient(45deg, #4a4a4a 30%, #5a5a5a 90%)",
    boxShadow: "0 10px 25px rgba(169, 169, 169, 0.3)",
    transform: "translateY(-2px)",
    textDecoration: "none",

    "&::before": {
      left: "100%",
    },
  },
}));

const StatCard = styled(Paper)(({ theme, bordercolor }) => ({
  background: "rgba(60, 60, 60, 0.8)",
  border: `1px solid ${bordercolor || "rgba(169, 169, 169, 0.3)"}`,
  borderRadius: "12px",
  padding: theme.spacing(2),
  color: "#ffffff",
  textAlign: "center",
  animation: `${pulseGlow} 3s infinite`,
}));

const WelcomeHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  animation: `${fadeInUp} 0.8s ease-out`,
}));

const UnifiedDashboard = ({ config }) => {
  const { auth } = useAuth();
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const {
    role,
    title,
    subtitle,
    primaryColor,
    secondaryColor,
    icon: IconComponent,
    stats,
    actionCards,
    recentActivities,
    statusItems,
    processFlow,
    additionalInfo,
    customContent,
  } = config;

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Header */}
        <WelcomeHeader>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", "Gambetta", serif',
              fontWeight: 700,
              background: `linear-gradient(45deg, #ffffff 30%, ${primaryColor} 70%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(169, 169, 169, 0.8)" }}>
            {subtitle}
          </Typography>

          {currentAccount && (
            <Chip
              label={`Wallet: ${currentAccount}`}
              variant="outlined"
              sx={{
                mt: 2,
                color: primaryColor,
                borderColor: `${primaryColor}80`,
                fontSize: "0.9rem", // optional: reduce size for long address
                maxWidth: "100%", // optional: make it responsive
              }}
            />
          )}
        </WelcomeHeader>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard bordercolor={`${stat.color}50`}>
                  <StatIcon sx={{ fontSize: 40, mb: 1, color: stat.color }} />
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(169, 169, 169, 0.8)" }}
                  >
                    {stat.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      mt: 2,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: stat.color,
                      },
                    }}
                  />
                </StatCard>
              </Grid>
            );
          })}
        </Grid>

        {/* Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {actionCards.map((card, index) => {
            const ActionIcon = card.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Link to={card.path} style={{ textDecoration: "none" }}>
                  <StyledActionCard>
                    <ActionIcon
                      sx={{ fontSize: 48, mb: 2, color: card.color }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(169, 169, 169, 0.8)" }}
                    >
                      {card.description}
                    </Typography>
                  </StyledActionCard>
                </Link>
              </Grid>
            );
          })}
        </Grid>

        {/* Main Information Panel */}
        <DashboardCard>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", color: primaryColor }}
            >
              {additionalInfo.title}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                    {recentActivities.title}
                  </Typography>
                  <Box sx={{ space: 1 }}>
                    {recentActivities.items.map((activity, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{ color: "rgba(169, 169, 169, 0.8)", mb: 1 }}
                      >
                        {activity}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                    {statusItems.title}
                  </Typography>
                  <Box sx={{ space: 2 }}>
                    {statusItems.items.map((status, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2">{status.label}</Typography>
                        <Chip
                          label={status.value}
                          size="small"
                          sx={{ bgcolor: status.color, color: "#fff" }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Process Flow */}
            {processFlow && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: `${primaryColor}0D`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>
                  {processFlow.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {processFlow.steps.map((step, index) => (
                    <React.Fragment key={index}>
                      <Chip
                        label={step.label}
                        sx={
                          step.active
                            ? {
                                bgcolor: primaryColor,
                                color: "#fff",
                                fontWeight: "bold",
                                px: 2,
                              }
                            : {
                                color: "rgba(169, 169, 169, 0.7)",
                                borderColor: "rgba(169, 169, 169, 0.3)",
                              }
                        }
                        variant={step.active ? "filled" : "outlined"}
                      />
                      {index < processFlow.steps.length - 1 && (
                        <Typography sx={{ color: "rgba(169, 169, 169, 0.6)" }}>
                          →
                        </Typography>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
                {processFlow.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: `${primaryColor}CC`,
                      mt: 2,
                      textAlign: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    {processFlow.description}
                  </Typography>
                )}
              </Box>
            )}

            {/* Custom Content */}
            {customContent && customContent}

            {/* Wallet Connection */}
            {!currentAccount && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: `${primaryColor}1A`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>
                  Blockchain Integration
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "rgba(169, 169, 169, 0.8)" }}
                >
                  Connect your MetaMask wallet to access blockchain features.
                </Typography>
                <StyledActionCard
                  sx={{
                    width: "200px",
                    height: "60px",
                    display: "inline-flex",
                    cursor: "pointer",
                  }}
                  onClick={connectWallet}
                >
                  <Typography variant="button">Connect Wallet</Typography>
                </StyledActionCard>
              </Box>
            )}
          </CardContent>
        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
};

export default UnifiedDashboard;
