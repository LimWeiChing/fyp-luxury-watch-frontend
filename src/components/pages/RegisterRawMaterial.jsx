import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import api from "../../api/axios";
import Geocode from "react-geocode";
import dayjs from "dayjs";
import QRCode from "qrcode.react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  PhotoCamera,
  QrCode2,
  Download,
  ArrowBack,
  CheckCircle,
  Diamond,
  Security,
  Inventory,
  LocationOn,
  Schedule,
  AccountBalanceWallet,
  CloudUpload,
  Verified,
  AutoAwesome,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";

// Enhanced animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const diamondGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3),
                0 0 40px rgba(76, 175, 80, 0.2),
                inset 0 0 20px rgba(76, 175, 80, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(76, 175, 80, 0.6),
                0 0 60px rgba(76, 175, 80, 0.4),
                inset 0 0 30px rgba(76, 175, 80, 0.2);
  }
`;

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

// Styled Components
const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 230, 118, 0.1) 0%, transparent 50%)
    `,
    zIndex: -1,
    pointerEvents: "none",
  },
}));

const PremiumCard = styled(Card)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      rgba(20, 20, 20, 0.95) 0%, 
      rgba(30, 30, 30, 0.98) 50%, 
      rgba(20, 20, 20, 0.95) 100%
    )
  `,
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(76, 175, 80, 0.2)",
  borderRadius: "20px",
  boxShadow: `
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(76, 175, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  position: "relative",
  overflow: "hidden",
  animation: `${fadeInUp} 0.8s ease-out`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "2px",
    background: `linear-gradient(90deg, 
      transparent, 
      rgba(76, 175, 80, 0.8), 
      rgba(0, 230, 118, 0.8), 
      transparent
    )`,
    animation: `${shimmer} 3s infinite`,
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -10,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "2px",
    background: `linear-gradient(90deg, 
      transparent, 
      rgba(76, 175, 80, 0.8), 
      transparent
    )`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(76, 175, 80, 0.05)",
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(76, 175, 80, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4caf50",
      boxShadow: "0 0 10px rgba(76, 175, 80, 0.3)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#4caf50",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .Mui-disabled": {
    color: "rgba(255, 255, 255, 0.6) !important",
    WebkitTextFillColor: "rgba(255, 255, 255, 0.6) !important",
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(76, 175, 80, 0.05)",
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(76, 175, 80, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4caf50",
      boxShadow: "0 0 10px rgba(76, 175, 80, 0.3)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#4caf50",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiAutocomplete-paper": {
    background: "rgba(30, 30, 30, 0.95)",
    color: "#ffffff",
    border: "1px solid rgba(76, 175, 80, 0.3)",
  },
}));

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "12px",
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  ...(variant === "contained" && {
    background: `linear-gradient(45deg, 
      #4caf50 0%, 
      #66bb6a 50%, 
      #4caf50 100%
    )`,
    color: "#ffffff",
    border: "1px solid rgba(76, 175, 80, 0.3)",
    "&:hover": {
      background: `linear-gradient(45deg, 
        #66bb6a 0%, 
        #4caf50 50%, 
        #66bb6a 100%
      )`,
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
    },
  }),
  ...(variant === "outlined" && {
    border: "1px solid rgba(76, 175, 80, 0.5)",
    color: "#4caf50",
    background: "rgba(76, 175, 80, 0.05)",
    "&:hover": {
      background: "rgba(76, 175, 80, 0.1)",
      borderColor: "#4caf50",
      transform: "translateY(-2px)",
    },
  }),
}));

const ImageUploadArea = styled(Box)(({ theme, hasImage }) => ({
  border: `2px dashed ${hasImage ? "#4caf50" : "rgba(76, 175, 80, 0.3)"}`,
  borderRadius: "16px",
  padding: theme.spacing(4),
  textAlign: "center",
  background: hasImage ? "rgba(76, 175, 80, 0.05)" : "rgba(76, 175, 80, 0.02)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    borderColor: "#4caf50",
    background: "rgba(76, 175, 80, 0.08)",
    transform: "translateY(-2px)",
  },
  ...(hasImage && {
    animation: `${diamondGlow} 2s infinite`,
  }),
}));

const QRSection = styled(Card)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      rgba(76, 175, 80, 0.1) 0%, 
      rgba(76, 175, 80, 0.05) 100%
    )
  `,
  border: "1px solid rgba(76, 175, 80, 0.3)",
  borderRadius: "16px",
  marginTop: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: `linear-gradient(90deg, 
      #4caf50, 
      #00e676, 
      #4caf50
    )`,
  },
}));

const StepperSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiStepLabel-label": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-active": {
      color: "#4caf50",
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: "#4caf50",
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  "& .Mui-active .MuiStepConnector-line": {
    borderColor: "#4caf50",
  },
  "& .Mui-completed .MuiStepConnector-line": {
    borderColor: "#4caf50",
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  background: "rgba(76, 175, 80, 0.1)",
  border: "1px solid rgba(76, 175, 80, 0.2)",
  borderRadius: "12px",
  padding: theme.spacing(2),
  color: "#ffffff",
  marginBottom: theme.spacing(2),
}));

// Material types and countries
const materialTypes = [
  "Gold 18K",
  "Gold 24K",
  "Platinum",
  "Titanium",
  "Stainless Steel",
  "Leather Premium",
  "Sapphire Crystal",
  "Diamond",
  "Ruby",
  "Silver 925",
  "Carbon Fiber",
  "Ceramic",
  "Mother of Pearl",
  "Custom",
];

const originCountries = [
  "Switzerland",
  "Germany",
  "Japan",
  "Italy",
  "France",
  "United Kingdom",
  "United States",
  "Austria",
  "Belgium",
  "Denmark",
  "Custom",
];

const steps = [
  "Material Details",
  "Location & Image",
  "Blockchain Registration",
  "Completion",
];

const findMetaMaskAccount = async () => {
  try {
    if (!window.ethereum) {
      console.log("Please install MetaMask!");
      return null;
    }
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      return accounts[0];
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const RegisterRawMaterial = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [componentId, setComponentId] = useState("");
  const [materialType, setMaterialType] = useState(materialTypes[0]);
  const [customMaterial, setCustomMaterial] = useState("");
  const [origin, setOrigin] = useState(originCountries[0]);
  const [customOrigin, setCustomOrigin] = useState("");
  const [image, setImage] = useState({ file: null, filepreview: null });
  const [currentLocation, setCurrentLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [qrData, setQrData] = useState("");
  const [uploadedImageFilename, setUploadedImageFilename] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";
  const contractABI = abi.abi;

  const errRef = useRef();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    setErrMsg("");
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
    generateComponentId();
    getCurrentTimeLocation();
    Geocode.setApiKey("AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0");
  }, []);

  const generateComponentId = async () => {
    try {
      const response = await api.get("/generate-id/raw-material");
      setComponentId(response.data.id);
    } catch (error) {
      console.error("Error generating component ID:", error);
      const fallbackId = `RM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setComponentId(fallbackId);
    }
  };

  const getCurrentTimeLocation = () => {
    setTimestamp(dayjs().unix().toString());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await Geocode.fromLatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            if (response.results && response.results.length > 0) {
              const components = response.results[0].address_components;
              const streetNumber = components.find((c) =>
                c.types.includes("street_number")
              )?.long_name;
              const route = components.find((c) =>
                c.types.includes("route")
              )?.long_name;
              const city = components.find((c) =>
                c.types.includes("locality")
              )?.long_name;
              const state = components.find((c) =>
                c.types.includes("administrative_area_level_1")
              )?.long_name;
              const country = components.find((c) =>
                c.types.includes("country")
              )?.long_name;

              const address = [streetNumber, route, city, state, country]
                .filter(Boolean)
                .join(", ");

              setCurrentLocation(address);
            } else {
              setCurrentLocation("Location unavailable");
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            setCurrentLocation("Location unavailable");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation("Location unavailable");
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  };

  const handleImage = async (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        filepreview: URL.createObjectURL(e.target.files[0]),
      });
      setUploadedImageFilename("");
    }
  };

  const uploadImage = async () => {
    if (!image.file) {
      throw new Error("No image file selected");
    }

    const data = new FormData();
    data.append("image", image.file);

    try {
      console.log("🔄 Starting image upload...");
      const res = await api.post("/upload/raw-material", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Image upload response:", res.data);

      let filename = null;

      if (res.data.success && res.data.filename) {
        filename = res.data.filename;
      } else if (res.data.filename) {
        filename = res.data.filename;
      } else if (typeof res.data === "string" && res.data.includes(".")) {
        filename = res.data;
      }

      if (filename) {
        console.log("✅ Image uploaded successfully:", filename);
        setUploadedImageFilename(filename);
        return filename;
      } else {
        console.error("❌ No filename found in response:", res.data);
        throw new Error("Upload failed: No filename returned from server");
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      if (error.response) {
        console.error("❌ Server response:", error.response.data);
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          error.response.statusText ||
          "Unknown server error";
        throw new Error(`Upload failed: ${errorMessage}`);
      } else if (error.request) {
        throw new Error(
          "Upload failed: No response from server. Check if server is running."
        );
      } else {
        throw error;
      }
    }
  };

  const generateQRCode = () => {
    const data = `${CONTRACT_ADDRESS},${componentId}`;
    setQrData(data);
    console.log("QR Code generated:", data);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("QRCode");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${componentId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleBack = () => {
    navigate("/supplier");
  };

  const registerOnBlockchain = async (imageFilename) => {
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

        setLoadingMessage("Please approve the transaction in your wallet...");
        setActiveStep(2);

        const finalMaterialType =
          materialType === "Custom" ? customMaterial : materialType;
        const finalOrigin = origin === "Custom" ? customOrigin : origin;

        console.log(
          "🔗 Registering on blockchain with filename:",
          imageFilename
        );

        const registerTxn = await contract.registerRawMaterial(
          componentId,
          finalMaterialType,
          finalOrigin,
          imageFilename,
          currentLocation,
          timestamp
        );

        setLoadingMessage(`Mining transaction: ${registerTxn.hash}...`);
        await registerTxn.wait();

        console.log("✅ Blockchain registration successful");
        return true;
      } else {
        setErrMsg("Ethereum object doesn't exist!");
        return false;
      }
    } catch (error) {
      console.error("❌ Blockchain registration error:", error);
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        setErrMsg("Transaction was rejected by user");
      } else {
        setErrMsg(`Blockchain error: ${error.message}`);
      }
      return false;
    }
  };

  const saveToDatabase = async (imageFilename) => {
    try {
      const finalMaterialType =
        materialType === "Custom" ? customMaterial : materialType;
      const finalOrigin = origin === "Custom" ? customOrigin : origin;

      const rawMaterialData = {
        componentId,
        materialType: finalMaterialType,
        origin: finalOrigin,
        image: imageFilename,
        location: currentLocation,
        timestamp,
        supplierAddress: currentAccount,
      };

      console.log("💾 Saving to database with data:", rawMaterialData);

      const response = await api.post("/raw-material", rawMaterialData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Database save response:", response.data);
      return true;
    } catch (error) {
      console.error("❌ Database save error:", error);
      if (error.response) {
        console.error("❌ Server response:", error.response.data);
        setErrMsg(`Database error: ${error.response.data}`);
      } else {
        setErrMsg("Failed to save to database");
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    setLoadingMessage("");

    // Validation
    if (!componentId || !materialType || !origin || !currentAccount) {
      setErrMsg("Please fill in all required fields and connect your wallet");
      setLoading(false);
      return;
    }

    if (materialType === "Custom" && !customMaterial.trim()) {
      setErrMsg("Please specify the custom material type");
      setLoading(false);
      return;
    }

    if (origin === "Custom" && !customOrigin.trim()) {
      setErrMsg("Please specify the custom origin country");
      setLoading(false);
      return;
    }

    if (!image.file) {
      setErrMsg("Please upload an image of the raw material");
      setLoading(false);
      return;
    }

    try {
      setActiveStep(1);
      setLoadingMessage("Uploading image...");
      const uploadedFilename = await uploadImage();

      if (!uploadedFilename) {
        setErrMsg("Failed to upload image. Please try again.");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("✅ Image upload completed, filename:", uploadedFilename);

      setLoadingMessage("Saving to database...");
      const dbSuccess = await saveToDatabase(uploadedFilename);

      if (!dbSuccess) {
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("✅ Database save completed");

      setLoadingMessage("Registering on blockchain...");
      const blockchainSuccess = await registerOnBlockchain(uploadedFilename);

      if (blockchainSuccess) {
        setActiveStep(3);
        setSuccessMsg("Raw material registered successfully!");
        generateQRCode();
        console.log("✅ Full registration process completed successfully");
      }
    } catch (error) {
      console.error("❌ Registration process error:", error);
      setErrMsg(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Not connected";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <DashboardLayout>
      <MainContainer maxWidth="lg">
        <Fade in timeout={800}>
          <PremiumCard>
            <CardContent sx={{ p: 4 }}>
              <HeaderSection>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Diamond sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      background:
                        "linear-gradient(45deg, #ffffff 30%, #4caf50 70%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1,
                    }}
                  >
                    Premium Material Genesis
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 300,
                  }}
                >
                  Authenticate and immortalize raw materials on blockchain
                </Typography>
              </HeaderSection>

              {/* Progress Stepper */}
              <StepperSection>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={({ active, completed }) => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor:
                                completed || active
                                  ? "#4caf50"
                                  : "rgba(76, 175, 80, 0.2)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? "#4caf50"
                                  : "rgba(76, 175, 80, 0.3)"
                              }`,
                            }}
                          >
                            {completed ? <CheckCircle /> : index + 1}
                          </Box>
                        )}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </StepperSection>

              {/* Error and Success Messages */}
              {errMsg && (
                <Zoom in>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: "12px",
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                      color: "#ffffff",
                    }}
                    ref={errRef}
                  >
                    {errMsg}
                  </Alert>
                </Zoom>
              )}

              {successMsg && (
                <Zoom in>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: "12px",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                      color: "#ffffff",
                    }}
                  >
                    {successMsg}
                  </Alert>
                </Zoom>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Left Column - Material Information */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1000}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#4caf50",
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <Inventory sx={{ mr: 1 }} />
                          Material Information
                        </Typography>

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Material ID"
                          variant="outlined"
                          value={componentId}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AutoAwesome sx={{ mr: 1, color: "#4caf50" }} />
                            ),
                          }}
                        />

                        <StyledAutocomplete
                          fullWidth
                          margin="normal"
                          options={materialTypes}
                          value={materialType}
                          onChange={(event, newValue) => {
                            setMaterialType(newValue || materialTypes[0]);
                          }}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              margin="normal"
                              label="Premium Material Type"
                              variant="outlined"
                              required
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <Diamond sx={{ mr: 1, color: "#4caf50" }} />
                                ),
                              }}
                            />
                          )}
                        />

                        {materialType === "Custom" && (
                          <Fade in>
                            <StyledTextField
                              fullWidth
                              margin="normal"
                              label="Custom Material Specification"
                              variant="outlined"
                              value={customMaterial}
                              onChange={(e) =>
                                setCustomMaterial(e.target.value)
                              }
                              required
                            />
                          </Fade>
                        )}

                        <StyledAutocomplete
                          fullWidth
                          margin="normal"
                          options={originCountries}
                          value={origin}
                          onChange={(event, newValue) => {
                            setOrigin(newValue || originCountries[0]);
                          }}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              margin="normal"
                              label="Origin Country"
                              variant="outlined"
                              required
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <LocationOn
                                    sx={{ mr: 1, color: "#4caf50" }}
                                  />
                                ),
                              }}
                            />
                          )}
                        />

                        {origin === "Custom" && (
                          <Fade in>
                            <StyledTextField
                              fullWidth
                              margin="normal"
                              label="Custom Origin Country"
                              variant="outlined"
                              value={customOrigin}
                              onChange={(e) => setCustomOrigin(e.target.value)}
                              required
                            />
                          </Fade>
                        )}
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Right Column - System Information */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1200}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#4caf50",
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <Security sx={{ mr: 1 }} />
                          System Information
                        </Typography>

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Registration Location"
                          variant="outlined"
                          value={currentLocation}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          multiline
                          rows={2}
                          InputProps={{
                            startAdornment: (
                              <LocationOn sx={{ mr: 1, color: "#4caf50" }} />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Timestamp"
                          variant="outlined"
                          value={
                            timestamp
                              ? dayjs(parseInt(timestamp) * 1000).format(
                                  "MMMM D, YYYY hh:mm:ss A"
                                )
                              : ""
                          }
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <Schedule sx={{ mr: 1, color: "#4caf50" }} />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Supplier Wallet"
                          variant="outlined"
                          value={currentAccount}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AccountBalanceWallet
                                sx={{ mr: 1, color: "#4caf50" }}
                              />
                            ),
                          }}
                        />
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Image Upload Section */}
                  <Grid item xs={12}>
                    <Grow in timeout={1400}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#4caf50",
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <PhotoCamera sx={{ mr: 1 }} />
                          Material Authentication Image
                        </Typography>

                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="material-image-upload"
                          type="file"
                          onChange={handleImage}
                        />
                        <label htmlFor="material-image-upload">
                          <ImageUploadArea hasImage={!!image.filepreview}>
                            {image.filepreview ? (
                              <Box sx={{ position: "relative" }}>
                                <img
                                  src={image.filepreview}
                                  alt="Material Preview"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    borderRadius: "12px",
                                    boxShadow:
                                      "0 8px 25px rgba(76, 175, 80, 0.3)",
                                  }}
                                />
                              </Box>
                            ) : (
                              <>
                                <CloudUpload
                                  sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ color: "#ffffff", mb: 1 }}
                                >
                                  Upload Material Image
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                >
                                  High-resolution image for authentication
                                </Typography>
                              </>
                            )}
                          </ImageUploadArea>
                        </label>
                      </Box>
                    </Grow>
                    {/* QR Code Section */}
                    {qrData && (
                      <Zoom in timeout={1000}>
                        <QRSection>
                          <CardContent sx={{ textAlign: "center", p: 4 }}>
                            <Typography
                              variant="h5"
                              sx={{
                                mb: 3,
                                color: "#4caf50",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                              }}
                            >
                              <QrCode2 sx={{ mr: 2, fontSize: 32 }} />
                              Blockchain Authentication Code
                            </Typography>

                            <Box
                              sx={{
                                display: "inline-flex", // so QR + button are aligned vertically
                                flexDirection: "column",
                                alignItems: "center",
                                p: 2,
                                background: "#ffffff",
                                borderRadius: "16px",
                                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                              }}
                            >
                              <QRCode
                                id="QRCode"
                                value={qrData}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                              />

                              <PremiumButton
                                variant="contained"
                                startIcon={<Download />}
                                onClick={downloadQR}
                                sx={{ mt: 2, minWidth: "200px" }} // spacing between QR and button
                              >
                                Download QR Code
                              </PremiumButton>
                            </Box>
                          </CardContent>
                        </QRSection>
                      </Zoom>
                    )}

                    {/* Success Summary */}
                    {successMsg && (
                      <Zoom in timeout={1200}>
                        <Card
                          sx={{
                            mt: 1,
                            background:
                              "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                            border: "1px solid rgba(76, 175, 80, 0.3)",
                            borderRadius: "16px",
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                mb: 1,
                                color: "#4caf50",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 600,
                              }}
                            >
                              <CheckCircle sx={{ mr: 2 }} />
                              Authentication Complete
                            </Typography>
                          </CardContent>
                        </Card>
                      </Zoom>
                    )}
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Grow in timeout={1600}>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <PremiumButton
                            variant="outlined"
                            fullWidth
                            onClick={handleBack}
                            startIcon={<ArrowBack />}
                            disabled={loading}
                            sx={{ height: "56px" }}
                          >
                            Back to Dashboard
                          </PremiumButton>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <PremiumButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ height: "56px" }}
                          >
                            {loading ? (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <CircularProgress
                                  size={24}
                                  color="inherit"
                                  sx={{ mr: 1 }}
                                />
                                Authenticating...
                              </Box>
                            ) : (
                              <>
                                <Verified sx={{ mr: 1 }} />
                                Authenticate Material
                              </>
                            )}
                          </PremiumButton>
                        </Grid>
                      </Grid>
                    </Grow>
                  </Grid>
                </Grid>
              </form>

              {/* Loading Status */}
              {loading && loadingMessage && (
                <Zoom in>
                  <InfoCard sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress
                        size={24}
                        sx={{ mr: 2, color: "#4caf50" }}
                      />
                      <Typography variant="body1" sx={{ color: "#ffffff" }}>
                        {loadingMessage}
                      </Typography>
                    </Box>
                  </InfoCard>
                </Zoom>
              )}
            </CardContent>
          </PremiumCard>
        </Fade>
      </MainContainer>
    </DashboardLayout>
  );
};

export default RegisterRawMaterial;
