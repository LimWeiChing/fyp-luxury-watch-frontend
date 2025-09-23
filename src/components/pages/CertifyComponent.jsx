import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import api from "../../api/axios";
import Geocode from "react-geocode";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  CardMedia,
  Container,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Zoom,
  Paper,
  Autocomplete,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  PhotoCamera,
  ArrowBack,
  CheckCircle,
  QrCodeScanner,
  VerifiedUser,
  Home,
  Security,
  Assignment,
  LocationOn,
  Schedule,
  AccountBalanceWallet,
  CloudUpload,
  Verified,
  AutoAwesome,
  GppGood,
  Diamond,
  Build,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";
import {
  certifierColors,
  certifierAnimations,
  certifierStyles,
  certifierUtils,
  certifierConstants,
} from "./CertifierTheme";

// Enhanced animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const certificationGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.3),
                0 0 40px rgba(33, 150, 243, 0.2),
                inset 0 0 20px rgba(33, 150, 243, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(33, 150, 243, 0.6),
                0 0 60px rgba(33, 150, 243, 0.4),
                inset 0 0 30px rgba(33, 150, 243, 0.2);
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
      radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 176, 255, 0.1) 0%, transparent 50%)
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
  border: "1px solid rgba(33, 150, 243, 0.2)",
  borderRadius: "20px",
  boxShadow: `
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(33, 150, 243, 0.1),
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
      rgba(33, 150, 243, 0.8), 
      rgba(0, 176, 255, 0.8), 
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
      rgba(33, 150, 243, 0.8), 
      transparent
    )`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(33, 150, 243, 0.05)",
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(33, 150, 243, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2196f3",
      boxShadow: "0 0 10px rgba(33, 150, 243, 0.3)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#2196f3",
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
    background: "rgba(33, 150, 243, 0.05)",
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(33, 150, 243, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2196f3",
      boxShadow: "0 0 10px rgba(33, 150, 243, 0.3)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#2196f3",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiAutocomplete-paper": {
    background: "rgba(30, 30, 30, 0.95)",
    color: "#ffffff",
    border: "1px solid rgba(33, 150, 243, 0.3)",
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
      #2196f3 0%, 
      #42a5f5 50%, 
      #2196f3 100%
    )`,
    color: "#ffffff",
    border: "1px solid rgba(33, 150, 243, 0.3)",
    "&:hover": {
      background: `linear-gradient(45deg, 
        #42a5f5 0%, 
        #2196f3 50%, 
        #42a5f5 100%
      )`,
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(33, 150, 243, 0.3)",
    },
  }),
  ...(variant === "outlined" && {
    border: "1px solid rgba(33, 150, 243, 0.5)",
    color: "#2196f3",
    background: "rgba(33, 150, 243, 0.05)",
    "&:hover": {
      background: "rgba(33, 150, 243, 0.1)",
      borderColor: "#2196f3",
      transform: "translateY(-2px)",
    },
  }),
}));

const ImageUploadArea = styled(Box)(({ theme, hasImage }) => ({
  border: `2px dashed ${hasImage ? "#2196f3" : "rgba(33, 150, 243, 0.3)"}`,
  borderRadius: "16px",
  padding: theme.spacing(4),
  textAlign: "center",
  background: hasImage
    ? "rgba(33, 150, 243, 0.05)"
    : "rgba(33, 150, 243, 0.02)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    borderColor: "#2196f3",
    background: "rgba(33, 150, 243, 0.08)",
    transform: "translateY(-2px)",
  },
  ...(hasImage && {
    animation: `${certificationGlow} 2s infinite`,
  }),
}));

const StepperSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiStepLabel-label": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-active": {
      color: "#2196f3",
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: "#2196f3",
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  "& .Mui-active .MuiStepConnector-line": {
    borderColor: "#2196f3",
  },
  "& .Mui-completed .MuiStepConnector-line": {
    borderColor: "#2196f3",
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  background: "rgba(33, 150, 243, 0.1)",
  border: "1px solid rgba(33, 150, 243, 0.2)",
  borderRadius: "12px",
  padding: theme.spacing(2),
  color: "#ffffff",
  marginBottom: theme.spacing(2),
}));

const ComponentCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    rgba(33, 150, 243, 0.1) 0%, 
    rgba(33, 150, 243, 0.05) 100%
  )`,
  border: "1px solid rgba(33, 150, 243, 0.3)",
  borderRadius: "16px",
  marginBottom: theme.spacing(3),
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
      #2196f3, 
      #00b0ff, 
      #2196f3
    )`,
  },
}));

// Quality grades and certification standards
const qualityGrades = certifierConstants.QUALITY_GRADES;
const certificationStandards = certifierConstants.CERTIFICATION_STANDARDS;
const steps = certifierConstants.CERTIFICATION_STEPS;

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

const CertifyComponent = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [componentData, setComponentData] = useState(null);
  const [scannedComponentId, setScannedComponentId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [qualityGrade, setQualityGrade] = useState(qualityGrades[0]);
  const [certificationStandard, setCertificationStandard] = useState(
    certificationStandards[0]
  );
  const [certifierImage, setCertifierImage] = useState({
    file: null,
    filepreview: null,
  });
  const [currentLocation, setCurrentLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const CONTRACT_ADDRESS = certifierConstants.CONTRACT_ADDRESS;
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
    getCurrentTimeLocation();
    Geocode.setApiKey(certifierConstants.GEOCODE_API_KEY);

    // If we have QR data from scanner, process it
    if (navigationQrData) {
      processQrData(navigationQrData);
    }
    if (navigationEntityData) {
      processEntityData(navigationEntityData);
    }
  }, [navigationQrData, navigationEntityData]);

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

  const processQrData = (qrData) => {
    try {
      const parts = qrData.split(",");
      if (parts.length >= 2) {
        const componentId = parts[1];
        setScannedComponentId(componentId);
        fetchComponentData(componentId);
      }
    } catch (error) {
      console.error("Error processing QR data:", error);
      setErrMsg("Invalid QR code format");
    }
  };

  const processEntityData = (entityData) => {
    const component = {
      componentId: entityData.componentId || entityData[0],
      componentType: entityData.componentType || entityData[1],
      serialNumber: entityData.serialNumber || entityData[2],
      rawMaterialId: entityData.rawMaterialId || entityData[3],
      image: entityData.image || entityData[4],
      location: entityData.location || entityData[5],
      timestamp: entityData.timestamp || entityData[6],
      manufacturer: entityData.manufacturer || entityData[7],
      status: entityData.status || entityData[8] || 0,
      certifiedBy: entityData.certifiedBy || entityData[9],
      certificationTimestamp:
        entityData.certificationTimestamp || entityData[10],
      certifierRemarks: entityData.certifierRemarks || entityData[11],
      certifierImage: entityData.certifierImage || entityData[12],
    };

    if (parseInt(component.status) === 1 || component.status === "1") {
      setErrMsg("This component has already been certified");
      return;
    }

    setComponentData(component);
    setScannedComponentId(component.componentId);
  };

  const fetchComponentData = async (componentId) => {
    try {
      setActiveStep(0);
      console.log("Fetching component data for ID:", componentId);

      const dbResponse = await api.get(`/component/${componentId}`);
      console.log("Database response:", dbResponse.data);

      if (dbResponse.data && dbResponse.data.length > 0) {
        const componentInfo = dbResponse.data[0];

        console.log("Component found, status:", componentInfo.status);

        if (componentInfo.status === "1" || componentInfo.status === 1) {
          setErrMsg(
            "This component has already been certified and cannot be certified again."
          );
          setComponentData(componentInfo);
          return;
        }

        if (
          componentInfo.status !== "0" &&
          componentInfo.status !== 0 &&
          componentInfo.status !== null
        ) {
          setErrMsg(
            `Component has invalid status: ${componentInfo.status}. Expected status: 0 (uncertified).`
          );
          return;
        }

        setComponentData(componentInfo);
        setScannedComponentId(componentId);
        setActiveStep(1);
        console.log("Component loaded successfully for certification");
      } else {
        setErrMsg(
          "Component not found in database. Please ensure the component was created by a manufacturer first."
        );
        return;
      }

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          provider
        );

        try {
          const componentBlockchain = await contract.getComponent(componentId);
          if (componentBlockchain && componentBlockchain.exists) {
            console.log(
              "Blockchain verification - Component status:",
              parseInt(componentBlockchain.status)
            );

            if (parseInt(componentBlockchain.status) === 1) {
              setErrMsg(
                "This component is already certified on the blockchain."
              );
              return;
            }
          }
        } catch (blockchainError) {
          console.log(
            "Blockchain fetch error (non-critical):",
            blockchainError.message
          );
        }
      }
    } catch (error) {
      console.error("Error fetching component data:", error);
      if (error.response?.status === 404) {
        setErrMsg(
          "Component not found. Please verify the QR code is correct and the component was created by a manufacturer."
        );
      } else if (error.response?.status === 500) {
        setErrMsg("Database error. Please try again or contact support.");
      } else {
        setErrMsg(
          "Failed to fetch component data. Please check your connection and try again."
        );
      }
    }
  };

  const handleImage = async (e) => {
    if (e.target.files[0]) {
      setCertifierImage({
        file: e.target.files[0],
        filepreview: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate("/certifier");
  };

  const certifyOnBlockchain = async (imageName) => {
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

        const certifyTxn = await contract.certifyComponent(
          scannedComponentId,
          remarks,
          imageName,
          timestamp
        );

        setLoadingMessage(`Mining transaction: ${certifyTxn.hash}...`);
        await certifyTxn.wait();

        setLoadingMessage("");
        setSuccessMsg("Component certified on blockchain successfully!");

        return true;
      } else {
        setErrMsg("Ethereum object doesn't exist!");
        return false;
      }
    } catch (error) {
      console.error("Blockchain certification error:", error);
      setLoadingMessage("");
      if (error.code === "USER_REJECTED") {
        setErrMsg("Transaction was rejected by user");
      } else if (error.message.includes("too many arguments")) {
        setErrMsg(
          "Smart contract error: Invalid number of parameters. Please contact support."
        );
      } else {
        setErrMsg(`Blockchain error: ${error.message}`);
      }
      return false;
    }
  };

  const saveToDatabase = async (imageName) => {
    try {
      const certificationData = {
        componentId: scannedComponentId,
        remarks,
        qualityGrade,
        certificationStandard,
        certifierImage: imageName,
        location: currentLocation,
        timestamp,
        certifierAddress: currentAccount,
      };

      console.log("Sending certification data to database:", certificationData);

      const response = await api.post("/certify-component", certificationData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Database save response:", response.data);
      return true;
    } catch (error) {
      console.error("Database save error:", error);
      if (error.response?.data) {
        if (
          typeof error.response.data === "string" &&
          error.response.data.includes(
            "Component not found or not in correct status"
          )
        ) {
          setErrMsg(
            "Component not found or not in correct status for certification. The component may have already been certified or doesn't exist in the database."
          );
        } else {
          setErrMsg(`Database error: ${error.response.data}`);
        }
      } else {
        setErrMsg(
          "Failed to save to database. Please check your connection and try again."
        );
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    if (!scannedComponentId) {
      setErrMsg("Please scan a component QR code first");
      setLoading(false);
      return;
    }

    if (!remarks.trim()) {
      setErrMsg("Please provide certification remarks");
      setLoading(false);
      return;
    }

    if (!componentData) {
      setErrMsg("Component data not loaded. Please scan the QR code again.");
      setLoading(false);
      return;
    }

    if (parseInt(componentData.status) !== 0 && componentData.status !== "0") {
      setErrMsg(
        "Component is not eligible for certification. Only components with status 0 (uncertified) can be certified."
      );
      setLoading(false);
      return;
    }

    try {
      setActiveStep(2);
      setLoadingMessage("Processing certification...");
      let imageName = "";
      if (certifierImage.file) {
        setLoadingMessage("Uploading certification image...");
        const data = new FormData();
        data.append("image", certifierImage.file);

        try {
          const res = await api.post("/upload/certifier", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageName = res.data.filename || "";
          console.log("Image uploaded successfully:", imageName);
        } catch (error) {
          console.error("Error uploading image:", error);
          setErrMsg("Failed to upload certification image. Please try again.");
          setLoading(false);
          return;
        }
      }

      setLoadingMessage("Saving certification to database...");
      const dbSuccess = await saveToDatabase(imageName);

      if (!dbSuccess) {
        setLoading(false);
        return;
      }

      setLoadingMessage("Certifying on blockchain...");
      const blockchainSuccess = await certifyOnBlockchain(imageName);

      if (blockchainSuccess) {
        setComponentData({
          ...componentData,
          status: 1,
          certifiedBy: currentAccount,
          certificationTimestamp: timestamp,
          certifierRemarks: remarks,
          certifierImage: imageName,
          certifierLocation: currentLocation,
          qualityGrade,
          certificationStandard,
        });
        setLoadingMessage("");
        setLoading(false);
        setActiveStep(4);

        setRemarks("");
        setQualityGrade(qualityGrades[0]);
        setCertificationStandard(certificationStandards[0]);
        setCertifierImage({ file: null, filepreview: null });
      }
    } catch (error) {
      console.error("Certification error:", error);
      setErrMsg("Certification failed. Please try again.");
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const handleScanComponent = () => {
    navigate("/scanner", {
      state: {
        returnTo: "/certify-component",
        scanType: "component",
      },
    });
  };

  const formatFullAddress = (address) => {
    if (!address) return "Not connected";
    return address;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    try {
      const date = dayjs(parseInt(timestamp) * 1000);
      return date.isValid()
        ? date.format("MMMM D, YYYY hh:mm:ss A")
        : "Invalid Date";
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <DashboardLayout>
      <MainContainer maxWidth="xl">
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
                  <VerifiedUser
                    sx={{ fontSize: 40, color: "#2196f3", mr: 2 }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      background:
                        "linear-gradient(45deg, #ffffff 30%, #2196f3 70%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1,
                    }}
                  >
                    Quality Certification Center
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
                  Professional Component Quality Verification & Certification
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
                                  ? "#2196f3"
                                  : "rgba(33, 150, 243, 0.2)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? "#2196f3"
                                  : "rgba(33, 150, 243, 0.3)"
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

              {/* Certifier Information Display */}
              <Grow in timeout={600}>
                <ComponentCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: "#2196f3" }}>
                      <Security sx={{ mr: 1, verticalAlign: "middle" }} />
                      Certification Authority Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Certifier Wallet Address:</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                            backgroundColor: "rgba(33, 150, 243, 0.1)",
                            p: 1,
                            borderRadius: 1,
                            mb: 2,
                            color: "#ffffff",
                          }}
                        >
                          {formatFullAddress(currentAccount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Certification Location:</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "rgba(33, 150, 243, 0.1)",
                            p: 1,
                            borderRadius: 1,
                            mb: 2,
                            color: "#ffffff",
                          }}
                        >
                          {currentLocation || "Loading location..."}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Certifier Authority:</strong> Quality
                          Assurance Bureau
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Certification Date:</strong>{" "}
                          {formatTimestamp(timestamp)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>License Number:</strong> QAB-CERT-2024-001
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Accreditation:</strong> ISO/IEC 17025:2017
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </ComponentCard>
              </Grow>

              {/* Component Information Card */}
              {!componentData ? (
                <Grow in timeout={800}>
                  <ComponentCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: "#2196f3" }}>
                        Component Required for Certification
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, color: "#ffffff" }}
                      >
                        Please scan a component QR code to proceed with quality
                        certification.
                      </Typography>
                      <PremiumButton
                        variant="contained"
                        fullWidth
                        startIcon={<QrCodeScanner />}
                        onClick={handleScanComponent}
                      >
                        Scan Component QR Code
                      </PremiumButton>
                    </CardContent>
                  </ComponentCard>
                </Grow>
              ) : (
                <Grow in timeout={1000}>
                  <ComponentCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: "#2196f3" }}>
                        <Build sx={{ mr: 1, verticalAlign: "middle" }} />
                        Component Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          {componentData.image && componentData.image !== "" ? (
                            <CardMedia
                              component="img"
                              sx={{
                                width: "100%",
                                height: 150,
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "2px solid rgba(33, 150, 243, 0.3)",
                              }}
                              image={`${api.defaults.baseURL}/file/component/${componentData.image}`}
                              alt="Component"
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 150,
                                height: 150,
                                fontSize: "3rem",
                                backgroundColor: "#2196f3",
                              }}
                            >
                              🔧
                            </Avatar>
                          )}
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Component ID:</strong>{" "}
                            {componentData.componentId ||
                              componentData.component_id ||
                              scannedComponentId}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Type:</strong>{" "}
                            {componentData.component_type ||
                              componentData.componentType}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Serial Number:</strong>{" "}
                            {componentData.serial_number ||
                              componentData.serialNumber}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Manufacturer:</strong>{" "}
                            {certifierUtils.formatAddress(
                              componentData.manufacturer_address ||
                                componentData.manufacturer,
                              false
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Manufacturing Date:</strong>{" "}
                            {formatTimestamp(componentData.timestamp)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Manufacturing Location:</strong>{" "}
                            {componentData.location}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#ffffff" }}>
                            <strong>Current Status:</strong>{" "}
                            {parseInt(componentData.status) === 0 ||
                            componentData.status === "0" ? (
                              <Chip
                                label="AWAITING CERTIFICATION"
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #ff9800 30%, #ffb74d 70%)",
                                  color: "#ffffff",
                                  fontWeight: 600,
                                }}
                                size="small"
                              />
                            ) : (
                              <Chip
                                label="CERTIFIED"
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #4caf50 30%, #66bb6a 70%)",
                                  color: "#ffffff",
                                  fontWeight: 600,
                                }}
                                size="small"
                              />
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </ComponentCard>
                </Grow>
              )}

              {/* Certification Form */}
              {componentData &&
                (parseInt(componentData.status) === 0 ||
                  componentData.status === "0") && (
                  <form onSubmit={handleSubmit}>
                    <Grow in timeout={1200}>
                      <ComponentCard>
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 3,
                              color: "#2196f3",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <GppGood sx={{ mr: 1, verticalAlign: "middle" }} />
                            Quality Certification Assessment
                          </Typography>

                          <Grid container spacing={3}>
                            {/* Left Column */}
                            <Grid item xs={12} md={6}>
                              <StyledTextField
                                fullWidth
                                margin="normal"
                                label="Certification Remarks"
                                variant="outlined"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                required
                                multiline
                                rows={4}
                                placeholder="Enter detailed quality assessment, inspection results, compliance notes, and any relevant observations..."
                                InputProps={{
                                  startAdornment: (
                                    <Assignment
                                      sx={{ mr: 1, color: "#2196f3" }}
                                    />
                                  ),
                                }}
                              />

                              <StyledAutocomplete
                                fullWidth
                                margin="normal"
                                options={qualityGrades}
                                value={qualityGrade}
                                onChange={(event, newValue) => {
                                  setQualityGrade(newValue || qualityGrades[0]);
                                }}
                                renderInput={(params) => (
                                  <StyledTextField
                                    {...params}
                                    margin="normal"
                                    label="Quality Grade"
                                    variant="outlined"
                                    required
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <Diamond
                                          sx={{ mr: 1, color: "#2196f3" }}
                                        />
                                      ),
                                    }}
                                  />
                                )}
                              />

                              <StyledAutocomplete
                                fullWidth
                                margin="normal"
                                options={certificationStandards}
                                value={certificationStandard}
                                onChange={(event, newValue) => {
                                  setCertificationStandard(
                                    newValue || certificationStandards[0]
                                  );
                                }}
                                renderInput={(params) => (
                                  <StyledTextField
                                    {...params}
                                    margin="normal"
                                    label="Certification Standard"
                                    variant="outlined"
                                    required
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <Verified
                                          sx={{ mr: 1, color: "#2196f3" }}
                                        />
                                      ),
                                    }}
                                  />
                                )}
                              />
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} md={6}>
                              <StyledTextField
                                fullWidth
                                margin="normal"
                                label="Certification Location"
                                variant="outlined"
                                value={currentLocation}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                multiline
                                rows={2}
                                InputProps={{
                                  startAdornment: (
                                    <LocationOn
                                      sx={{ mr: 1, color: "#2196f3" }}
                                    />
                                  ),
                                }}
                              />

                              <StyledTextField
                                fullWidth
                                margin="normal"
                                label="Certification Timestamp"
                                variant="outlined"
                                value={formatTimestamp(timestamp)}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                  startAdornment: (
                                    <Schedule
                                      sx={{ mr: 1, color: "#2196f3" }}
                                    />
                                  ),
                                }}
                              />

                              <StyledTextField
                                fullWidth
                                margin="normal"
                                label="Certifier Wallet Address"
                                variant="outlined"
                                value={formatFullAddress(currentAccount)}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                  startAdornment: (
                                    <AccountBalanceWallet
                                      sx={{ mr: 1, color: "#2196f3" }}
                                    />
                                  ),
                                }}
                              />
                            </Grid>

                            {/* Image Upload Section */}
                            <Grid item xs={12}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#2196f3",
                                  mb: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  fontWeight: 600,
                                }}
                              >
                                <PhotoCamera sx={{ mr: 1 }} />
                                Certification Documentation Image
                              </Typography>

                              <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="certifier-image-upload"
                                type="file"
                                onChange={handleImage}
                              />
                              <label htmlFor="certifier-image-upload">
                                <ImageUploadArea
                                  hasImage={!!certifierImage.filepreview}
                                >
                                  {certifierImage.filepreview ? (
                                    <Box sx={{ position: "relative" }}>
                                      <img
                                        src={certifierImage.filepreview}
                                        alt="Certification Preview"
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "300px",
                                          borderRadius: "12px",
                                          boxShadow:
                                            "0 8px 25px rgba(33, 150, 243, 0.3)",
                                        }}
                                      />
                                    </Box>
                                  ) : (
                                    <>
                                      <CloudUpload
                                        sx={{
                                          fontSize: 60,
                                          color: "#2196f3",
                                          mb: 2,
                                        }}
                                      />
                                      <Typography
                                        variant="h6"
                                        sx={{ color: "#ffffff", mb: 1 }}
                                      >
                                        Upload Certification Image
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.7)",
                                        }}
                                      >
                                        Optional: Certification documentation or
                                        test results
                                      </Typography>
                                    </>
                                  )}
                                </ImageUploadArea>
                              </label>
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12}>
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
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <CircularProgress
                                          size={24}
                                          color="inherit"
                                          sx={{ mr: 1 }}
                                        />
                                        Certifying...
                                      </Box>
                                    ) : (
                                      <>
                                        <GppGood sx={{ mr: 1 }} />
                                        Certify Component
                                      </>
                                    )}
                                  </PremiumButton>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </ComponentCard>
                    </Grow>
                  </form>
                )}

              {/* Already Certified Warning */}
              {componentData &&
                (parseInt(componentData.status) === 1 ||
                  componentData.status === "1") &&
                !successMsg && (
                  <Zoom in timeout={1000}>
                    <ComponentCard>
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: "#ff9800" }}
                        >
                          ⚠️ Component Already Certified
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          This component has already been certified and cannot
                          be certified again.
                        </Typography>
                        <Divider
                          sx={{ my: 2, borderColor: "rgba(33, 150, 243, 0.2)" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Certified By:</strong>{" "}
                          {certifierUtils.formatAddress(
                            componentData.certifier_address ||
                              componentData.certifiedBy,
                            false
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>Certification Date:</strong>{" "}
                          {formatTimestamp(
                            componentData.certify_timestamp ||
                              componentData.certificationTimestamp
                          )}
                        </Typography>
                        {componentData.certifier_location && (
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Certification Location:</strong>{" "}
                            {componentData.certifier_location}
                          </Typography>
                        )}
                        {componentData.certifier_remarks && (
                          <Typography
                            variant="body2"
                            sx={{ mb: 3, color: "#ffffff" }}
                          >
                            <strong>Remarks:</strong>{" "}
                            {componentData.certifier_remarks}
                          </Typography>
                        )}
                      </CardContent>
                    </ComponentCard>
                  </Zoom>
                )}

              {/* Loading Status */}
              {loading && loadingMessage && (
                <Zoom in>
                  <InfoCard sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress
                        size={24}
                        sx={{ mr: 2, color: "#2196f3" }}
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

export default CertifyComponent;
