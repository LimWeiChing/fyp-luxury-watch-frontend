import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  Fade,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Warning,
  Security,
  ArrowBack,
  Block,
  Shield,
  Error,
} from "@mui/icons-material";
import bgImg from "../../img/bg.png";

// Optimized Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const warningPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(244, 67, 54, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(244, 67, 54, 0.5);
  }
`;

const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

// Guest Layout Component - Same as ScannerPage
const GuestLayout = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 80%, rgba(244, 67, 54, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 64, 129, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0f0f0f 75%, #000000 100%),
    url(${bgImg})
  `,
  backgroundSize: "cover, cover, cover, cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(244, 67, 54, 0.03) 2px,
        rgba(244, 67, 54, 0.03) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(255, 64, 129, 0.03) 2px,
        rgba(255, 64, 129, 0.03) 4px
      )
    `,
    zIndex: 0,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 40%, rgba(244, 67, 54, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(255, 64, 129, 0.05) 0%, transparent 50%)
    `,
    zIndex: 1,
  },
}));

// Header Component
const GuestHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 10,
  padding: theme.spacing(2, 0),
  textAlign: "center",
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(244, 67, 54, 0.3)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  animation: `${fadeInUp} 0.4s ease-out`,
}));

// Warning Card with Enhanced Styling
const WarningCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(10px)",
  border: "2px solid rgba(244, 67, 54, 0.4)",
  borderRadius: "20px",
  color: "#ffffff",
  animation: `${fadeInUp} 0.6s ease-out, ${warningPulse} 3s infinite`,
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(244, 67, 54, 0.02) 2px,
        rgba(244, 67, 54, 0.02) 4px
      )
    `,
    zIndex: 0,
  },
}));

const WarningIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 80,
  height: 80,
  margin: "0 auto 20px auto",
  background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  borderRadius: "50%",
  border: "3px solid rgba(244, 67, 54, 0.5)",
  animation: `${shakeAnimation} 0.5s ease-in-out`,
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "12px",
  padding: theme.spacing(1.5, 4),
  fontFamily: '"Exo 2", "Roboto", sans-serif',
  fontWeight: 600,
  fontSize: "1rem",
  letterSpacing: 1,
  textTransform: "none",
  transition: "all 0.2s ease",

  ...(variant === "contained" && {
    background: "linear-gradient(45deg, #f44336 30%, #d32f2f 90%)",
    border: "1px solid rgba(244, 67, 54, 0.5)",
    color: "#ffffff",
    "&:hover": {
      background: "linear-gradient(45deg, #e53935 30%, #c62828 90%)",
      transform: "translateY(-1px)",
      boxShadow: "0 8px 25px rgba(244, 67, 54, 0.4)",
    },
  }),

  ...(variant === "outlined" && {
    border: "2px solid rgba(255, 255, 255, 0.3)",
    color: "#ffffff",
    background: "rgba(255, 255, 255, 0.05)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      transform: "translateY(-1px)",
    },
  }),
}));

const SecurityAlert = styled(Alert)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(30, 30, 30, 0.95) 100%)",
  border: "1px solid rgba(255, 152, 0, 0.6)",
  borderRadius: "12px",
  color: "#ffffff",
  marginBottom: theme.spacing(3),
  animation: `${fadeInUp} 0.5s ease-out`,

  "& .MuiAlert-icon": {
    color: "#ff9800",
  },

  "& .MuiAlert-message": {
    color: "#ffffff",
  },
}));

const StatusChip = styled(Chip)(({ chipColor }) => ({
  bgcolor: `${chipColor}30`,
  color: chipColor,
  border: `1px solid ${chipColor}60`,
  fontFamily: '"Exo 2", sans-serif',
  fontWeight: 600,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const FakeProduct = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-2);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleReportCounterfeit = () => {
    // Could implement reporting functionality
    alert(
      "Thank you for reporting. This helps us improve our anti-counterfeit system."
    );
  };

  return (
    <GuestLayout>
      <GuestHeader>
        <Box /> {/* Left spacer */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Orbitron", "Exo 2", sans-serif',
              fontWeight: 800,
              background:
                "linear-gradient(45deg, #ffffff 30%, #f44336 70%, #ff9800 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
            }}
          >
            QUANTUM CHRONOS
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: '"Exo 2", sans-serif',
              mt: 1,
            }}
          >
            Anti-Counterfeit System
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={handleGoHome}
          sx={{
            borderColor: "#f44336",
            color: "#f44336",
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            "&:hover": {
              borderColor: "#ffffff",
              color: "#ffffff",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
            },
          }}
        >
          Home
        </Button>
      </GuestHeader>

      <Container maxWidth="md" sx={{ py: 4, position: "relative", zIndex: 2 }}>
        {/* Header Section */}
        <HeaderSection>
          <WarningIcon>
            <Block sx={{ fontSize: 40, color: "#ffffff" }} />
          </WarningIcon>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", "Gambetta", serif',
              fontWeight: 700,
              background: "linear-gradient(45deg, #ffffff 30%, #f44336 70%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              mb: 1,
            }}
          >
            Authentication Failed
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(244, 67, 54, 0.9)",
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Counterfeit Product Detected
          </Typography>
        </HeaderSection>

        {/* Main Warning Card */}
        <WarningCard>
          <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
            {/* Security Alert */}
            <SecurityAlert severity="warning">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Warning sx={{ mr: 2, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  SECURITY BREACH DETECTED
                </Typography>
              </Box>
            </SecurityAlert>

            {/* Main Warning Message */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  color: "#ffffff",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Product Authentication Failure
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontFamily: '"Exo 2", sans-serif',
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                We regret to inform you that the scanned product has{" "}
                <strong>failed blockchain authentication</strong>. Our quantum
                security protocols have identified this item as a{" "}
                <strong>counterfeit product</strong> that does not belong to our
                verified luxury supply chain network.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontFamily: '"Exo 2", sans-serif',
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                <strong>We take counterfeiting extremely seriously.</strong>{" "}
                This product may not meet our rigorous safety, quality, and
                craftsmanship standards. We strongly advise against using this
                item as it could pose risks to your safety and investment.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontFamily: '"Exo 2", sans-serif',
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                }}
              >
                Thank you for using our <strong>Anti-Counterfeit System</strong>
                . Your vigilance helps protect the integrity of luxury
                timepieces and ensures authentic products reach discerning
                collectors.
              </Typography>
            </Box>

            {/* Security Status Info */}
            <Box
              sx={{
                mt: 3,
                p: 3,
                background:
                  "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(30, 30, 30, 0.8) 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(244, 67, 54, 0.3)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#f44336",
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Shield sx={{ mr: 2 }} />
                Anti-Counterfeit Protection
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <StatusChip
                  chipColor="#f44336"
                  label="Blockchain Rejected"
                  size="small"
                />
                <StatusChip
                  chipColor="#ff9800"
                  label="Authentication Failed"
                  size="small"
                />
                <StatusChip
                  chipColor="#9c27b0"
                  label="Security Alert"
                  size="small"
                />
                <StatusChip
                  chipColor="#607d8b"
                  label="Investigation Logged"
                  size="small"
                />
              </Box>
            </Box>

            {/* Recommendations */}
            <Box
              sx={{
                mt: 3,
                p: 3,
                background:
                  "linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(30, 30, 30, 0.8) 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(0, 188, 212, 0.3)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#00bcd4",
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Security sx={{ mr: 2 }} />
                Recommended Actions
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: '"Exo 2", sans-serif',
                    mb: 1,
                    "&::before": {
                      content: '"• "',
                      color: "#00bcd4",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Contact the authorized retailer for verification
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: '"Exo 2", sans-serif',
                    mb: 1,
                    "&::before": {
                      content: '"• "',
                      color: "#00bcd4",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Report this counterfeit to protect other customers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: '"Exo 2", sans-serif',
                    mb: 1,
                    "&::before": {
                      content: '"• "',
                      color: "#00bcd4",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Scan authentic products at authorized dealers only
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              <ActionButton
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{ minWidth: 160 }}
              >
                Go Back
              </ActionButton>
              <ActionButton
                variant="contained"
                onClick={handleReportCounterfeit}
                startIcon={<Error />}
                sx={{ minWidth: 160 }}
              >
                Report Counterfeit
              </ActionButton>
            </Box>
          </CardContent>
        </WarningCard>
      </Container>
    </GuestLayout>
  );
};

export default FakeProduct;
