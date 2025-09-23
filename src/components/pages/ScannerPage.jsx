import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Fade,
  Zoom,
  Paper,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  QrCodeScanner,
  Security,
  VerifiedUser,
  Speed,
  AccountTree,
  ArrowBack,
  CheckCircle,
  Error,
  Info,
} from "@mui/icons-material";
import QrScanner from "../QrScanner";
import useAuth from "../../hooks/useAuth";
import { ethers } from "ethers";
import abi from "../../utils/LuxuryWatchNFT.json";
import api from "../../api/axios";
import DashboardLayout from "./DashboardLayout";
import bgImg from "../../img/bg.png";

// Optimized Animations - Reduced complexity
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

const gentlePulse = keyframes`
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
`;

const scanningPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

// Optimized Styled Components - Simplified for performance
const ScannerCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(10px)", // Reduced from 20px
  border: "1px solid rgba(0, 245, 255, 0.3)",
  borderRadius: "20px",
  color: "#ffffff",
  animation: `${fadeInUp} 0.6s ease-out`,
  position: "relative",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  animation: `${fadeInUp} 0.4s ease-out`,
}));

const InstructionCard = styled(Card)(({ userRole, theme }) => {
  const roleColors = {
    admin: "#00f5ff",
    supplier: "#4caf50",
    manufacturer: "#ff9800",
    certifier: "#2196f3",
    assembler: "#673ab7",
    distributor: "#00bcd4",
    retailer: "#e91e63",
    consumer: "#ff6f00",
    guest: "#9e9e9e",
  };

  const roleColor = roleColors[userRole] || "#9e9e9e";

  return {
    background: `linear-gradient(135deg, ${roleColor}10 0%, rgba(30, 30, 30, 0.95) 100%)`,
    border: `1px solid ${roleColor}40`,
    borderRadius: "16px",
    marginBottom: theme.spacing(3),
    position: "relative",
    // Removed heavy animations and pseudo-elements
  };
});

const ScannerContainer = styled(Box)(({ theme, isScanning }) => ({
  position: "relative",
  borderRadius: "20px",
  overflow: "hidden",
  border: "2px solid rgba(0, 245, 255, 0.4)",
  background: "rgba(0, 0, 0, 0.8)",
  animation: isScanning ? `${scanningPulse} 2s ease-in-out infinite` : "none",
  // Removed complex pseudo-elements
}));

const StatusAlert = styled(Alert)(({ severity, theme }) => {
  const severityColors = {
    error: "#f44336",
    warning: "#ff9800",
    info: "#00b0ff",
    success: "#4caf50",
  };

  const color = severityColors[severity] || "#00b0ff";

  return {
    background: `linear-gradient(135deg, ${color}20 0%, rgba(30, 30, 30, 0.95) 100%)`,
    border: `1px solid ${color}60`,
    borderRadius: "12px",
    color: "#ffffff",
    marginBottom: theme.spacing(2),
    animation: `${fadeInUp} 0.3s ease-out`,

    "& .MuiAlert-icon": {
      color: color,
    },

    "& .MuiAlert-message": {
      color: "#ffffff",
    },
  };
});

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "12px",
  padding: theme.spacing(1.5, 4),
  fontFamily: '"Exo 2", "Roboto", sans-serif',
  fontWeight: 600,
  fontSize: "1rem",
  letterSpacing: 1,
  textTransform: "none",
  transition: "all 0.2s ease", // Reduced transition time

  ...(variant === "contained" && {
    background: "linear-gradient(45deg, #00f5ff 30%, #0091ea 90%)",
    border: "1px solid rgba(0, 245, 255, 0.5)",
    color: "#000000",
    "&:hover": {
      background: "linear-gradient(45deg, #00e5ef 30%, #0081da 90%)",
      transform: "translateY(-1px)", // Reduced movement
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

const VerificationBadge = styled(Paper)(({ theme, roleColor }) => ({
  background: `linear-gradient(135deg, ${roleColor}20 0%, rgba(30, 30, 30, 0.9) 100%)`,
  border: `1px solid ${roleColor}50`,
  borderRadius: "12px",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  // Removed heavy animation
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(5px)", // Reduced from 10px
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  borderRadius: "20px",
}));

// Simple Guest Layout Component
const GuestLayout = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 80%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
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
        rgba(0, 245, 255, 0.03) 2px,
        rgba(0, 245, 255, 0.03) 4px
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
      radial-gradient(circle at 30% 40%, rgba(0, 245, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(255, 64, 129, 0.05) 0%, transparent 50%)
    `,
    zIndex: 1,
  },
}));

// Guest Header Component
const GuestHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 10,
  padding: theme.spacing(2, 0),
  textAlign: "center",
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(0, 245, 255, 0.2)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

// Optimized Status Chip Component
const StatusChip = styled(Chip)(({ chipColor }) => ({
  bgcolor: `${chipColor}30`,
  color: chipColor,
  border: `1px solid ${chipColor}60`,
  fontFamily: '"Exo 2", sans-serif',
  fontWeight: 500,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const ScannerPage = () => {
  const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";
  const contractABI = abi.abi;
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();

  // Role-based colors
  const roleColors = {
    admin: "#00f5ff",
    supplier: "#4caf50",
    manufacturer: "#ff9800",
    certifier: "#2196f3",
    assembler: "#673ab7",
    distributor: "#00bcd4",
    retailer: "#e91e63",
    consumer: "#ff6f00",
    guest: "#9e9e9e", // Grey for guests
  };

  const userRole = auth?.role; // Don't set default here
  const isAuthenticated = !!auth?.user; // Check if user is actually logged in
  const roleColor = roleColors[userRole || "guest"];

  const passData = (data) => {
    setQrData(data);
    setIsScanning(true);
  };

  useEffect(() => {
    if (qrData) {
      handleScannedData();
    }
  }, [qrData]);

  const handleScannedData = async () => {
    setLoading(true);
    setErrorMsg("");

    const dataParts = qrData.split(",");
    if (dataParts.length < 2) {
      setErrorMsg("Invalid QR code format");
      setLoading(false);
      setIsScanning(false);
      return;
    }

    const contractAddress = dataParts[0];
    const entityId = dataParts[1];

    if (contractAddress !== CONTRACT_ADDRESS) {
      setErrorMsg("QR code does not belong to this system");
      setLoading(false);
      setIsScanning(false);
      return;
    }

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        let entityType = "unknown";
        let blockchainData = null;

        // Determine entity type
        try {
          blockchainData = await contract.getRawMaterial(entityId);
          entityType = "raw-material";
        } catch (error) {
          try {
            blockchainData = await contract.getComponent(entityId);
            entityType = "component";
          } catch (error) {
            try {
              blockchainData = await contract.getWatch(entityId);
              entityType = "watch";
            } catch (error) {
              setErrorMsg("Entity not found in blockchain");
              setLoading(false);
              setIsScanning(false);
              return;
            }
          }
        }

        // For watches, get fresh database data for accurate routing
        if (entityType === "watch") {
          await routeWatchWithDatabaseCheck(blockchainData, entityId);
        } else {
          await routeBasedOnRoleAndEntity(entityType, blockchainData, entityId);
        }
      } else {
        setErrorMsg("MetaMask not available");
      }
    } catch (error) {
      console.error("Error processing QR data:", error);
      setErrorMsg("Failed to process QR code data");
    }

    setLoading(false);
    setIsScanning(false);
  };

  const routeWatchWithDatabaseCheck = async (blockchainData, entityId) => {
    try {
      const response = await api.get(`/watch/${entityId}`);

      if (response.data && response.data.length > 0) {
        const dbWatch = response.data[0];

        const enhancedWatchData = {
          ...blockchainData,
          shippingStatus: parseInt(dbWatch.shipping_status || 0),
          availableForSale: dbWatch.available_for_sale === true,
          sold: dbWatch.sold === true,
          retailPrice: parseFloat(dbWatch.retail_price || 0),
          retailerAddress: dbWatch.retailer_address || "",
          currentOwner: dbWatch.current_owner || "",
        };

        await routeBasedOnRoleAndEntity("watch", enhancedWatchData, entityId);
      } else {
        routeBasedOnRoleAndEntity("watch", blockchainData, entityId);
      }
    } catch (error) {
      console.error("Error fetching database data:", error);
      routeBasedOnRoleAndEntity("watch", blockchainData, entityId);
    }
  };

  const routeBasedOnRoleAndEntity = async (
    entityType,
    entityData,
    entityId
  ) => {
    // For unauthenticated guests - always show view pages
    if (!isAuthenticated) {
      navigate(`/view-${entityType}`, { state: { qrData, entityData } });
      return;
    }

    switch (userRole) {
      case "supplier":
        navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        break;

      case "manufacturer":
        if (entityType === "raw-material") {
          try {
            const response = await api.get(`/raw-material/${entityId}`);;
            if (response.data && response.data.length > 0) {
              const dbMaterial = response.data[0];
              if (dbMaterial.used) {
                setErrorMsg("This raw material has already been used");
                navigate(`/view-${entityType}`, {
                  state: { qrData, entityData },
                });
              } else {
                navigate("/create-component", {
                  state: { qrData, entityData },
                });
              }
            } else {
              navigate(`/view-${entityType}`, {
                state: { qrData, entityData },
              });
            }
          } catch (error) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          }
        } else {
          navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        }
        break;

      case "certifier":
        if (entityType === "component") {
          try {
            const response = await api.get(`/component/${entityId}`);
            if (response.data && response.data.length > 0) {
              const dbComponent = response.data[0];
              const isCertified =
                dbComponent.status === "1" || dbComponent.status === 1;
              const isUsed =
                dbComponent.status === "2" || dbComponent.status === 2;

              if (isCertified && !isUsed) {
                setErrorMsg("This component is already certified");
                navigate(`/view-${entityType}`, {
                  state: { qrData, entityData },
                });
              } else if (isUsed) {
                setErrorMsg("This component has already been used in assembly");
                navigate(`/view-${entityType}`, {
                  state: { qrData, entityData },
                });
              } else {
                navigate("/certify-component", {
                  state: { qrData, entityData },
                });
              }
            } else {
              navigate(`/view-${entityType}`, {
                state: { qrData, entityData },
              });
            }
          } catch (error) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          }
        } else {
          navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        }
        break;

      case "assembler":
        if (entityType === "component") {
          try {
            const response = await api.get(`/component/${entityId}`);
            if (response.data && response.data.length > 0) {
              const dbComponent = response.data[0];
              const isCertified =
                dbComponent.status === "1" || dbComponent.status === 1;
              const isUsed =
                dbComponent.status === "2" || dbComponent.status === 2;

              if (!isCertified) {
                setErrorMsg(
                  "Component not certified! Please have it certified first."
                );
                navigate(`/view-${entityType}`, {
                  state: { qrData, entityData },
                });
              } else if (isUsed) {
                setErrorMsg(
                  "This component has already been used in another watch"
                );
                navigate(`/view-${entityType}`, {
                  state: { qrData, entityData },
                });
              } else {
                const componentId = dbComponent.component_id || entityId;
                navigate("/assemble-watch", {
                  state: {
                    scannedComponentId: componentId,
                    qrData,
                    entityData,
                  },
                });
              }
            } else {
              navigate(`/view-${entityType}`, {
                state: { qrData, entityData },
              });
            }
          } catch (error) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          }
        } else {
          navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        }
        break;

      case "distributor":
        if (entityType === "watch") {
          const shippingStatus = entityData.shippingStatus || 0;
          if (shippingStatus >= 3) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else {
            navigate("/update-shipping", { state: { qrData, entityData } });
          }
        } else {
          navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        }
        break;

      case "retailer":
        if (entityType === "watch") {
          const shippingStatus = entityData.shippingStatus || 0;
          const availableForSale = entityData.availableForSale;
          const retailPrice = entityData.retailPrice || 0;
          const sold = entityData.sold;

          if (shippingStatus === 3 && !availableForSale && !sold) {
            navigate("/mark-available", { state: { qrData, entityData } });
          } else if (
            shippingStatus === 3 &&
            availableForSale &&
            retailPrice > 0 &&
            !sold
          ) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else if (sold) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else if (shippingStatus < 3) {
            setErrorMsg(
              "Watch must be delivered before it can be marked for sale"
            );
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          }
        } else {
          navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        }
        break;

      case "consumer":
        if (entityType === "watch") {
          const availableForSale = entityData.availableForSale;
          const sold = entityData.sold;
          const retailPrice = entityData.retailPrice || 0;

          if (availableForSale && !sold && retailPrice > 0) {
            navigate("/purchase-watch", { state: { qrData, entityData } });
          } else if (sold) {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else if (!availableForSale) {
            setErrorMsg("This watch is not available for purchase");
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else if (retailPrice <= 0) {
            setErrorMsg("This watch does not have a valid retail price");
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          } else {
            navigate(`/view-${entityType}`, { state: { qrData, entityData } });
          }
        } else {
          navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        }
        break;

      case "admin":
        navigate(`/view-${entityType}`, { state: { qrData, entityData } });
        break;

      default:
        navigate(`/view-${entityType}`, { state: { qrData, entityData } });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getInstructions = () => {
    if (!userRole) {
      return "Scan any QR code to view complete product traceability and authenticity information";
    }

    const instructions = {
      supplier:
        "Scan QR codes to view material traceability and authenticity records",
      manufacturer:
        "Scan raw material QR codes to initiate precision component creation",
      certifier:
        "Scan component QR codes to execute quality certification protocols",
      assembler:
        "Scan certified component QR codes to begin luxury watch assembly",
      distributor:
        "Scan watch QR codes to update global shipping status and tracking",
      retailer:
        "Scan delivered watch QR codes to feature in premium boutique collection",
      consumer:
        "Scan watch QR codes to purchase authenticated timepieces or verify ownership",
      admin:
        "Scan QR codes to access administrative oversight and system analytics",
    };

    return (
      instructions[userRole] ||
      "Scan QR codes to view complete product traceability information"
    );
  };

  const getRoleIcon = () => {
    const icons = {
      admin: Security,
      supplier: AccountTree,
      manufacturer: Speed,
      certifier: VerifiedUser,
      assembler: Speed,
      distributor: AccountTree,
      retailer: Security,
      consumer: VerifiedUser,
      guest: QrCodeScanner,
    };
    return icons[userRole] || QrCodeScanner;
  };

  const RoleIcon = getRoleIcon();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <HeaderSection>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", "Gambetta", serif',
            fontWeight: 700,
            background: `linear-gradient(45deg, #ffffff 30%, ${roleColor} 70%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 2,
            mb: 1,
          }}
        >
          QR Scanner
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 300,
          }}
        >
          Blockchain-Verified Authentication System
        </Typography>
      </HeaderSection>

      {/* Main Scanner Card */}
      <ScannerCard>
        <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
          {/* Role-specific Instructions */}
          <InstructionCard userRole={userRole || "guest"}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RoleIcon sx={{ fontSize: 32, mr: 2, color: roleColor }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Exo 2", sans-serif',
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {userRole
                    ? `${
                        userRole.charAt(0).toUpperCase() + userRole.slice(1)
                      } Mode`
                    : "Guest Mode"}
                </Typography>
                <Chip
                  label="ACTIVE"
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor: `${roleColor}30`,
                    color: roleColor,
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 600,
                    border: `1px solid ${roleColor}60`,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontFamily: '"Exo 2", sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {getInstructions()}
              </Typography>
            </CardContent>
          </InstructionCard>

          {/* Error Messages */}
          {errorMsg && (
            <Fade in={!!errorMsg}>
              <StatusAlert severity="error">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Error sx={{ mr: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {errorMsg}
                  </Typography>
                </Box>
              </StatusAlert>
            </Fade>
          )}

          {/* Loading State */}
          {loading && (
            <Fade in={loading}>
              <StatusAlert severity="info">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress
                    size={24}
                    sx={{ mr: 2, color: "#00b0ff" }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Processing QR data...
                  </Typography>
                </Box>
              </StatusAlert>
            </Fade>
          )}

          {/* QR Scanner Container */}
          <ScannerContainer isScanning={isScanning}>
            {loading && (
              <LoadingOverlay>
                <CircularProgress
                  size={60}
                  sx={{
                    color: roleColor,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  SCANNING...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: '"Exo 2", sans-serif',
                    textAlign: "center",
                    mt: 1,
                  }}
                >
                  Blockchain verification in progress
                </Typography>
              </LoadingOverlay>
            )}
            <QrScanner passData={passData} />
          </ScannerContainer>

          {/* Real-time verification info for retailers and consumers */}
          {userRole &&
            (auth?.role === "retailer" || auth?.role === "consumer") && (
              <VerificationBadge roleColor={roleColor}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle sx={{ fontSize: 28, mr: 2, color: "#4caf50" }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Exo 2", sans-serif',
                        fontWeight: 700,
                        color: "#ffffff",
                        mb: 0.5,
                      }}
                    >
                      Real-Time Blockchain Verification
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontFamily: '"Exo 2", sans-serif',
                      }}
                    >
                      Advanced system fetches live database synchronization for
                      precise routing based on current blockchain state and
                      market status.
                    </Typography>
                  </Box>
                </Box>
              </VerificationBadge>
            )}

          {/* Action Buttons */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <ActionButton
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ minWidth: 200 }}
            >
              Return to Dashboard
            </ActionButton>
          </Box>
        </CardContent>
      </ScannerCard>
    </Container>
  );
};

export default ScannerPage;
