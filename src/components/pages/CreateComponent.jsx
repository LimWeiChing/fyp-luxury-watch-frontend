import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  CardMedia,
  Avatar,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PhotoCamera,
  QrCode2,
  Download,
  ArrowBack,
  CheckCircle,
  Build,
  Security,
  PrecisionManufacturing,
  LocationOn,
  Schedule,
  AccountBalanceWallet,
  CloudUpload,
  Verified,
  AutoAwesome,
  QrCodeScanner,
  Inventory2,
  Warning,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";
import ManufacturerTheme from "./ManufacturerTheme";

// Styled Components using Manufacturer Theme
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
      radial-gradient(circle at 20% 80%, rgba(255, 152, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 171, 0, 0.1) 0%, transparent 50%)
    `,
    zIndex: -1,
    pointerEvents: "none",
  },
}));

const PrecisionCard = styled(Card)(({ theme }) =>
  ManufacturerTheme.utils.getPerformanceStyles(
    ManufacturerTheme.styles.precisionCard,
    ManufacturerTheme.styles.precisionCardWithForge
  )
);

const HeaderSection = styled(Box)(({ theme }) => ({
  ...ManufacturerTheme.styles.pageHeader,
  animation: `${ManufacturerTheme.animations.fadeInUp} 0.8s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  ...ManufacturerTheme.styles.styledTextField,
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: ManufacturerTheme.colors.alpha.primary05,
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: ManufacturerTheme.colors.alpha.primary50,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: ManufacturerTheme.colors.primary,
      boxShadow: `0 0 10px ${ManufacturerTheme.colors.alpha.primary30}`,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: ManufacturerTheme.colors.alpha.primary30,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: ManufacturerTheme.colors.primary,
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiAutocomplete-paper": {
    background: "rgba(30, 30, 30, 0.95)",
    color: "#ffffff",
    border: `1px solid ${ManufacturerTheme.colors.alpha.primary30}`,
  },
}));

const PrecisionButton = styled(Button)(({ theme, variant }) => ({
  ...(variant === "contained"
    ? ManufacturerTheme.styles.precisionButton.contained
    : ManufacturerTheme.styles.precisionButton.outlined),
}));

const ComponentUploadArea = styled(Box)(({ theme, hasImage }) =>
  ManufacturerTheme.utils.getPerformanceStyles(
    ManufacturerTheme.styles.componentUploadArea(hasImage),
    ManufacturerTheme.styles.componentUploadAreaWithAnimation(hasImage)
  )
);

const QRSection = styled(Card)(({ theme }) => ({
  ...ManufacturerTheme.styles.qrSection,
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  ...ManufacturerTheme.styles.progressSection,
}));

const RawMaterialCard = styled(Card)(({ theme }) => ({
  ...ManufacturerTheme.styles.rawMaterialCard,
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  ...ManufacturerTheme.styles.materialCard,
}));

// Component constants
const componentTypes = ManufacturerTheme.constants.COMPONENT_TYPES;
const manufacturingSteps = ManufacturerTheme.constants.MANUFACTURING_STEPS;

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

const CreateComponent = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [componentId, setComponentId] = useState("");
  const [componentType, setComponentType] = useState(componentTypes[0]);
  const [customComponentType, setCustomComponentType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [image, setImage] = useState({ file: null, filepreview: null });
  const [currentLocation, setCurrentLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [qrData, setQrData] = useState("");
  const [rawMaterialData, setRawMaterialData] = useState(null);
  const [scannedRawMaterialId, setScannedRawMaterialId] = useState("");
  const [uploadedImageFilename, setUploadedImageFilename] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const CONTRACT_ADDRESS = ManufacturerTheme.constants.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Get data from navigation state
  const navigationQrData = location.state?.qrData;
  const navigationEntityData = location.state?.entityData;

  useEffect(() => {
    setErrMsg("");
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
    generateComponentId();
    getCurrentTimeLocation();
    Geocode.setApiKey(ManufacturerTheme.constants.GEOCODE_API_KEY);

    // If we have QR data from scanner, process it
    if (navigationQrData) {
      processQrData(navigationQrData);
    }
    if (navigationEntityData) {
      processEntityData(navigationEntityData);
    }
  }, [navigationQrData, navigationEntityData]);

  // Generate serial number when component type changes
  useEffect(() => {
    generateSerialNumber();
  }, [componentType, customComponentType]);

  const generateSerialNumber = () => {
    const finalComponentType =
      componentType === "Custom" ? customComponentType : componentType;
    if (finalComponentType && finalComponentType !== "Custom") {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      const serialNum = `${finalComponentType.toUpperCase()}-${timestamp}-${random}`;
      setSerialNumber(serialNum);
    }
  };

  const processQrData = (qrData) => {
    try {
      const parts = qrData.split(",");
      if (parts.length >= 2) {
        const rawMaterialId = parts[1];
        setScannedRawMaterialId(rawMaterialId);
        fetchRawMaterialData(rawMaterialId);
      }
    } catch (error) {
      console.error("Error processing QR data:", error);
      setErrMsg("Invalid QR code format");
    }
  };

  const processEntityData = (entityData) => {
    const rawMaterial = {
      componentId: entityData.componentId || entityData[0],
      materialType: entityData.materialType || entityData[1],
      origin: entityData.origin || entityData[2],
      image: entityData.image || entityData[3],
      location: entityData.location || entityData[4],
      timestamp: entityData.timestamp || entityData[5],
      supplier: entityData.supplier || entityData[6],
      used: entityData.used || entityData[7] || false,
    };

    setRawMaterialData(rawMaterial);
    setScannedRawMaterialId(rawMaterial.componentId);
  };

  const fetchRawMaterialData = async (rawMaterialId) => {
    try {
      setActiveStep(1);
      // First check database
      const dbResponse = await api.get(`/raw-material/${rawMaterialId}`);

      // Also fetch from blockchain
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          provider
        );

        const rawMaterialBlockchain = await contract.getRawMaterial(
          rawMaterialId
        );
        if (rawMaterialBlockchain && !rawMaterialBlockchain.used) {
          const blockchainData = {
            componentId: rawMaterialBlockchain.componentId,
            materialType: rawMaterialBlockchain.materialType,
            origin: rawMaterialBlockchain.origin,
            image: rawMaterialBlockchain.image,
            location: rawMaterialBlockchain.location,
            timestamp: rawMaterialBlockchain.timestamp,
            supplier: rawMaterialBlockchain.supplier,
            used: rawMaterialBlockchain.used,
          };
          setRawMaterialData(blockchainData);
        }
      }
    } catch (error) {
      console.error("Error fetching raw material data:", error);
      setErrMsg("Failed to fetch raw material data");
    }
  };

  const generateComponentId = async () => {
    try {
      const response = await api.get("/generate-id/component");
      setComponentId(response.data.id);
    } catch (error) {
      console.error("Error generating component ID:", error);
      const fallbackId = ManufacturerTheme.utils.generateComponentId();
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
      const res = await api.post("/upload/component", data, {
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
    const canvas = document.getElementById("ComponentQRCode");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${componentId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleBack = () => {
    navigate("/manufacturer");
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
        setActiveStep(3);

        const finalComponentType =
          componentType === "Custom" ? customComponentType : componentType;

        console.log(
          "🔗 Registering on blockchain with filename:",
          imageFilename
        );

        const createTxn = await contract.createComponent(
          componentId,
          finalComponentType,
          serialNumber,
          scannedRawMaterialId,
          imageFilename,
          currentLocation,
          timestamp
        );

        setLoadingMessage(`Mining transaction: ${createTxn.hash}...`);
        await createTxn.wait();

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
      const finalComponentType =
        componentType === "Custom" ? customComponentType : componentType;

      const componentData = {
        componentId,
        componentType: finalComponentType,
        serialNumber,
        rawMaterialId: scannedRawMaterialId,
        image: imageFilename,
        location: currentLocation,
        timestamp,
        manufacturerAddress: currentAccount,
      };

      console.log("💾 Saving to database with data:", componentData);

      const response = await api.post("/component", componentData, {
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
    if (!componentId || !componentType || !serialNumber || !currentAccount) {
      setErrMsg("Please fill in all required fields and connect your wallet");
      setLoading(false);
      return;
    }

    if (!scannedRawMaterialId) {
      setErrMsg("Please scan a raw material QR code first");
      setLoading(false);
      return;
    }

    if (rawMaterialData && rawMaterialData.used) {
      setErrMsg("This raw material has already been used");
      setLoading(false);
      return;
    }

    if (componentType === "Custom" && !customComponentType.trim()) {
      setErrMsg("Please specify the custom component type");
      setLoading(false);
      return;
    }

    if (!image.file) {
      setErrMsg("Please upload an image of the component");
      setLoading(false);
      return;
    }

    try {
      setActiveStep(2);
      setLoadingMessage("Uploading component image...");
      const uploadedFilename = await uploadImage();

      if (!uploadedFilename) {
        setErrMsg("Failed to upload image. Please try again.");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("✅ Image upload completed, filename:", uploadedFilename);

      setLoadingMessage("Saving to manufacturing database...");
      const dbSuccess = await saveToDatabase(uploadedFilename);

      if (!dbSuccess) {
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("✅ Database save completed");

      setLoadingMessage("Forging component on blockchain...");
      const blockchainSuccess = await registerOnBlockchain(uploadedFilename);

      if (blockchainSuccess) {
        setActiveStep(4);
        setSuccessMsg("Component forged successfully!");
        generateQRCode();
        console.log("✅ Full manufacturing process completed successfully");
      }
    } catch (error) {
      console.error("❌ Manufacturing process error:", error);
      setErrMsg(`Manufacturing failed: ${error.message}`);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleScanRawMaterial = () => {
    navigate("/scanner", {
      state: {
        returnTo: "/create-component",
        scanType: "raw-material",
      },
    });
  };

  const formatTimestamp = (timestamp) => {
    return ManufacturerTheme.utils.formatTimestamp(timestamp);
  };

  return (
    <DashboardLayout>
      <MainContainer maxWidth="lg">
        <Fade in timeout={800}>
          <PrecisionCard>
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
                  <Build
                    sx={{
                      fontSize: 40,
                      color: ManufacturerTheme.colors.primary,
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: ManufacturerTheme.typography.primary,
                      fontWeight: 700,
                      background: `linear-gradient(45deg, #ffffff 30%, ${ManufacturerTheme.colors.primary} 70%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1,
                    }}
                  >
                    Precision Component Forge
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: ManufacturerTheme.typography.secondary,
                    fontWeight: 300,
                  }}
                >
                  Transform premium materials into precision components
                </Typography>
              </HeaderSection>

              {/* Manufacturing Progress Stepper */}
              <ProgressSection>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {manufacturingSteps.map((label, index) => (
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
                                  ? ManufacturerTheme.colors.primary
                                  : ManufacturerTheme.colors.alpha.primary20,
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? ManufacturerTheme.colors.primary
                                  : ManufacturerTheme.colors.alpha.primary30
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
              </ProgressSection>

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
                      backgroundColor: ManufacturerTheme.colors.alpha.primary10,
                      border: `1px solid ${ManufacturerTheme.colors.alpha.primary30}`,
                      color: "#ffffff",
                    }}
                  >
                    {successMsg}
                  </Alert>
                </Zoom>
              )}

              {/* Raw Material Verification Card */}
              {!rawMaterialData ? (
                <RawMaterialCard sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: ManufacturerTheme.colors.warning,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Warning sx={{ mr: 1 }} />
                      Raw Material Required
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, color: "#ffffff" }}
                    >
                      Scan a certified raw material QR code to begin precision
                      manufacturing process.
                    </Typography>
                    <PrecisionButton
                      variant="contained"
                      fullWidth
                      startIcon={<QrCodeScanner />}
                      onClick={handleScanRawMaterial}
                    >
                      Scan Raw Material QR Code
                    </PrecisionButton>
                  </CardContent>
                </RawMaterialCard>
              ) : (
                <RawMaterialCard sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: ManufacturerTheme.colors.success,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircle sx={{ mr: 1 }} />
                      Raw Material Verified
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        {rawMaterialData.image &&
                        rawMaterialData.image !== "" ? (
                          <CardMedia
                            component="img"
                            sx={{
                              width: "100%",
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: `2px solid ${ManufacturerTheme.colors.alpha.primary30}`,
                            }}
                            image={`${api.defaults.baseURL}/file/raw-material/${rawMaterialData.image}`}
                            alt="Raw Material"
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 100,
                              height: 100,
                              fontSize: "2.5rem",
                              backgroundColor: ManufacturerTheme.colors.primary,
                            }}
                          >
                            📦
                          </Avatar>
                        )}
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Material ID:</strong>{" "}
                          {rawMaterialData.componentId}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Type:</strong>{" "}
                          {ManufacturerTheme.utils.getComponentIcon(
                            rawMaterialData.materialType
                          )}{" "}
                          {rawMaterialData.materialType}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Origin:</strong> {rawMaterialData.origin}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#ffffff" }}>
                          <strong>Supplier:</strong>{" "}
                          {ManufacturerTheme.utils.formatAddress(
                            rawMaterialData.supplier_address ||
                              rawMaterialData.supplier
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </RawMaterialCard>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Left Column - Component Specifications */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1000}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: ManufacturerTheme.colors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <PrecisionManufacturing sx={{ mr: 1 }} />
                          Component Specifications
                        </Typography>

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Component ID"
                          variant="outlined"
                          value={componentId}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AutoAwesome
                                sx={{
                                  mr: 1,
                                  color: ManufacturerTheme.colors.primary,
                                }}
                              />
                            ),
                          }}
                        />

                        <StyledAutocomplete
                          fullWidth
                          margin="normal"
                          options={componentTypes}
                          value={componentType}
                          onChange={(event, newValue) => {
                            setComponentType(newValue || componentTypes[0]);
                          }}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              margin="normal"
                              label="Component Type"
                              variant="outlined"
                              required
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <Build
                                    sx={{
                                      mr: 1,
                                      color: ManufacturerTheme.colors.primary,
                                    }}
                                  />
                                ),
                              }}
                            />
                          )}
                        />

                        {componentType === "Custom" && (
                          <Fade in>
                            <StyledTextField
                              fullWidth
                              margin="normal"
                              label="Custom Component Type"
                              variant="outlined"
                              value={customComponentType}
                              onChange={(e) =>
                                setCustomComponentType(e.target.value)
                              }
                              required
                            />
                          </Fade>
                        )}

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Serial Number"
                          variant="outlined"
                          value={serialNumber}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <Inventory2
                                sx={{
                                  mr: 1,
                                  color: ManufacturerTheme.colors.primary,
                                }}
                              />
                            ),
                          }}
                        />
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Right Column - Manufacturing Information */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1200}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: ManufacturerTheme.colors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <Security sx={{ mr: 1 }} />
                          Manufacturing Information
                        </Typography>

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Manufacturing Location"
                          variant="outlined"
                          value={currentLocation}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          multiline
                          rows={2}
                          InputProps={{
                            startAdornment: (
                              <LocationOn
                                sx={{
                                  mr: 1,
                                  color: ManufacturerTheme.colors.primary,
                                }}
                              />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Manufacturing Timestamp"
                          variant="outlined"
                          value={formatTimestamp(timestamp)}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <Schedule
                                sx={{
                                  mr: 1,
                                  color: ManufacturerTheme.colors.primary,
                                }}
                              />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Manufacturer Wallet"
                          variant="outlined"
                          value={ManufacturerTheme.utils.formatAddress(
                            currentAccount,
                            false
                          )}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AccountBalanceWallet
                                sx={{
                                  mr: 1,
                                  color: ManufacturerTheme.colors.primary,
                                }}
                              />
                            ),
                          }}
                        />
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Component Image Upload Section */}
                  <Grid item xs={12}>
                    <Grow in timeout={1400}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: ManufacturerTheme.colors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <PhotoCamera sx={{ mr: 1 }} />
                          Component Documentation
                        </Typography>

                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="component-image-upload"
                          type="file"
                          onChange={handleImage}
                        />
                        <label htmlFor="component-image-upload">
                          <ComponentUploadArea hasImage={!!image.filepreview}>
                            {image.filepreview ? (
                              <Box sx={{ position: "relative" }}>
                                <img
                                  src={image.filepreview}
                                  alt="Component Preview"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    borderRadius: "12px",
                                    boxShadow: `0 8px 25px ${ManufacturerTheme.colors.alpha.primary30}`,
                                  }}
                                />
                              </Box>
                            ) : (
                              <>
                                <CloudUpload
                                  sx={{
                                    fontSize: 60,
                                    color: ManufacturerTheme.colors.primary,
                                    mb: 2,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ color: "#ffffff", mb: 1 }}
                                >
                                  Upload Component Image
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                >
                                  High-resolution image for quality
                                  documentation
                                </Typography>
                              </>
                            )}
                          </ComponentUploadArea>
                        </label>
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Grow in timeout={1600}>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <PrecisionButton
                            variant="outlined"
                            fullWidth
                            onClick={handleBack}
                            startIcon={<ArrowBack />}
                            disabled={loading}
                            sx={{ height: "56px" }}
                          >
                            Back to Dashboard
                          </PrecisionButton>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <PrecisionButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading || !rawMaterialData}
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
                                Forging...
                              </Box>
                            ) : (
                              <>
                                <Build sx={{ mr: 1 }} />
                                Forge Component
                              </>
                            )}
                          </PrecisionButton>
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
                        sx={{ mr: 2, color: ManufacturerTheme.colors.primary }}
                      />
                      <Typography variant="body1" sx={{ color: "#ffffff" }}>
                        {loadingMessage}
                      </Typography>
                    </Box>
                  </InfoCard>
                </Zoom>
              )}

              {/* QR Code Section */}
              {qrData && (
                <Zoom in timeout={1000}>
                  <QRSection>
                    <CardContent sx={{ textAlign: "center", p: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 3,
                          color: ManufacturerTheme.colors.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                        }}
                      >
                        <QrCode2 sx={{ mr: 2, fontSize: 32 }} />
                        Component Authentication Code
                      </Typography>

                      <Box
                        sx={{
                          display: "inline-flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 2,
                          background: "#ffffff",
                          borderRadius: "16px",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <QRCode
                          id="ComponentQRCode"
                          value={qrData}
                          size={200}
                          level={"H"}
                          includeMargin={true}
                        />

                        <PrecisionButton
                          variant="contained"
                          startIcon={<Download />}
                          onClick={downloadQR}
                          sx={{ mt: 2, minWidth: "200px" }}
                        >
                          Download QR Code
                        </PrecisionButton>
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
                      mt: 3,
                      background: ManufacturerTheme.colors.gradients.premium,
                      border: `1px solid ${ManufacturerTheme.colors.alpha.primary30}`,
                      borderRadius: "16px",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: ManufacturerTheme.colors.primary,
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle sx={{ mr: 2 }} />
                        Component Forged Successfully!
                      </Typography>
                      <Divider
                        sx={{
                          mb: 2,
                          borderColor: ManufacturerTheme.colors.alpha.primary20,
                        }}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Component ID:</strong> {componentId}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Type:</strong>{" "}
                            {componentType === "Custom"
                              ? customComponentType
                              : componentType}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Serial Number:</strong> {serialNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Status:</strong>{" "}
                            <Chip
                              label="FORGED - AWAITING CERTIFICATION"
                              size="small"
                              sx={{
                                bgcolor: ManufacturerTheme.colors.warning,
                                color: "#ffffff",
                                fontWeight: "bold",
                              }}
                            />
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Image:</strong>{" "}
                            {uploadedImageFilename || "No image"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#ffffff" }}>
                            <strong>Ready for:</strong> Quality Certification
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Zoom>
              )}
            </CardContent>
          </PrecisionCard>
        </Fade>
      </MainContainer>
    </DashboardLayout>
  );
};

export default CreateComponent;
