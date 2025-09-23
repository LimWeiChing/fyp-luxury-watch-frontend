import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Stack,
  Badge,
  Container,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Divider,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PhotoCamera,
  QrCode2,
  Download,
  ArrowBack,
  Build,
  Delete,
  Add,
  Watch,
  Verified,
  CheckCircle,
  BuildCircle,
  Security,
  Schedule,
  AccountBalanceWallet,
  CloudUpload,
  AutoAwesome,
  PrecisionManufacturing,
  Engineering,
  LocationOn,
  Token,
  Storage,
  OpenInNew,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";
import {
  assemblerColors,
  assemblerUtils,
  assemblerConstants,
} from "./AssemblerTheme";

// Optimized Styled Components - Minimal animations, lighter effects
const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  position: "relative",
}));

const PremiumCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.98) 100%)",
  border: "1px solid rgba(103, 58, 183, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, #673ab7, transparent)",
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
  position: "relative",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(103, 58, 183, 0.08)",
    borderRadius: "8px",
    color: "#ffffff",
    transition: "border-color 0.2s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(103, 58, 183, 0.6)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#673ab7",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(103, 58, 183, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#673ab7",
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

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.2s ease",
  ...(variant === "contained" && {
    background: "#673ab7",
    color: "#ffffff",
    "&:hover": {
      background: "#7e57c2",
      transform: "translateY(-1px)",
    },
  }),
  ...(variant === "outlined" && {
    border: "1px solid rgba(103, 58, 183, 0.5)",
    color: "#673ab7",
    background: "rgba(103, 58, 183, 0.05)",
    "&:hover": {
      background: "rgba(103, 58, 183, 0.1)",
      borderColor: "#673ab7",
    },
  }),
}));

const ImageUploadArea = styled(Box)(({ theme, hasImage }) => ({
  border: `2px dashed ${hasImage ? "#673ab7" : "rgba(103, 58, 183, 0.3)"}`,
  borderRadius: "12px",
  padding: theme.spacing(3),
  textAlign: "center",
  background: hasImage
    ? "rgba(103, 58, 183, 0.08)"
    : "rgba(103, 58, 183, 0.03)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  minHeight: "180px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    borderColor: "#673ab7",
    background: "rgba(103, 58, 183, 0.1)",
  },
}));

const ComponentCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "rgba(103, 58, 183, 0.08)",
  border: "1px solid rgba(103, 58, 183, 0.2)",
  borderRadius: "12px",
  transition: "transform 0.2s ease",
  position: "relative",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "#673ab7",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "#673ab7",
  },
}));

const ProgressSection = styled(Card)(({ theme }) => ({
  background: "rgba(103, 58, 183, 0.05)",
  border: "1px solid rgba(103, 58, 183, 0.2)",
  borderRadius: "12px",
  marginBottom: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "#673ab7",
  },
}));

const QRSection = styled(Card)(({ theme }) => ({
  background: "rgba(103, 58, 183, 0.05)",
  border: "1px solid rgba(103, 58, 183, 0.2)",
  borderRadius: "12px",
  marginTop: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "#673ab7",
  },
}));

const NFTSection = styled(Card)(({ theme }) => ({
  background: "rgba(103, 58, 183, 0.05)",
  border: "1px solid rgba(103, 58, 183, 0.2)",
  borderRadius: "12px",
  marginTop: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #673ab7, #9c27b0, #673ab7)",
  },
}));

const StepperSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiStepLabel-label": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-active": {
      color: "#673ab7",
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: "#673ab7",
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: "rgba(103, 58, 183, 0.3)",
  },
  "& .Mui-active .MuiStepConnector-line": {
    borderColor: "#673ab7",
  },
  "& .Mui-completed .MuiStepConnector-line": {
    borderColor: "#673ab7",
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: "rgba(103, 58, 183, 0.08)",
  border: "1px solid rgba(103, 58, 183, 0.2)",
  borderRadius: "8px",
  padding: theme.spacing(2),
  color: "#ffffff",
  marginBottom: theme.spacing(2),
}));

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

const AssembleWatch = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [watchId, setWatchId] = useState("");
  const [scannedComponents, setScannedComponents] = useState([]);
  const [image, setImage] = useState({ file: null, filepreview: null });
  const [currentLocation, setCurrentLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [qrData, setQrData] = useState("");
  const [processingComponent, setProcessingComponent] = useState(false);
  const [uploadedImageFilename, setUploadedImageFilename] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  // NFT-related state
  const [nftData, setNftData] = useState(null);
  const [nftGenerated, setNftGenerated] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";
  const contractABI = abi.abi;
  const MINIMUM_COMPONENTS_REQUIRED =
    assemblerConstants.MINIMUM_COMPONENTS_REQUIRED;

  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const STORAGE_KEY = "assembleWatch_components_session";
  const lastProcessedComponentRef = useRef(null);
  const isProcessingRef = useRef(false);
  const hasLoadedFromStorageRef = useRef(false);

  const steps = [
    "Collect Components",
    "Upload Documentation",
    "Generate NFT Metadata",
    "Blockchain Assembly",
    "NFT Minted Successfully",
  ];

  // Load components from localStorage on mount
  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) {
      const savedComponents = localStorage.getItem(STORAGE_KEY);
      if (savedComponents) {
        try {
          const parsedComponents = JSON.parse(savedComponents);
          if (Array.isArray(parsedComponents) && parsedComponents.length > 0) {
            setScannedComponents(parsedComponents);
            console.log(
              "Loaded components from localStorage:",
              parsedComponents.map((c) => c.component_id)
            );
          }
        } catch (error) {
          console.error("Error parsing saved components:", error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      hasLoadedFromStorageRef.current = true;
    }
  }, []);

  // Save components to localStorage
  useEffect(() => {
    if (hasLoadedFromStorageRef.current && scannedComponents.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scannedComponents));
      console.log(
        "Saved components to localStorage:",
        scannedComponents.map((c) => c.component_id)
      );
    }
  }, [scannedComponents]);

  useEffect(() => {
    setErrMsg("");
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
    generateWatchId();
    getCurrentTimeLocation();
    Geocode.setApiKey("AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0");
  }, []);

  // Handle scanned components from navigation
  useEffect(() => {
    const navigationState = location.state;

    if (!navigationState) return;

    const componentId = navigationState.scannedComponentId;
    const entityData = navigationState.entityData;

    console.log("Navigation state:", navigationState);
    console.log("Component ID:", componentId);
    console.log("Entity data:", entityData);

    let targetComponentId = null;

    if (componentId) {
      targetComponentId = componentId;
    } else if (entityData) {
      targetComponentId =
        entityData.componentId || entityData.component_id || entityData[0];
    }

    if (
      targetComponentId &&
      targetComponentId !== lastProcessedComponentRef.current &&
      !isProcessingRef.current
    ) {
      console.log("Processing new component:", targetComponentId);
      isProcessingRef.current = true;
      lastProcessedComponentRef.current = targetComponentId;

      handleNewScannedComponent(targetComponentId, entityData);
    }
  }, [location.state]);

  const handleNewScannedComponent = useCallback(
    async (componentId, entityData = null) => {
      setProcessingComponent(true);
      setErrMsg("");
      setSuccessMsg("");

      try {
        console.log("Processing component:", componentId);
        console.log(
          "Current components:",
          scannedComponents.map((c) => c.component_id)
        );

        const alreadyExists = scannedComponents.find(
          (c) => c.component_id === componentId
        );
        if (alreadyExists) {
          setErrMsg("This component has already been added to the assembly");
          return;
        }

        let componentData = null;

        if (entityData) {
          componentData = {
            component_id:
              entityData.componentId ||
              entityData.component_id ||
              entityData[0],
            component_type:
              entityData.componentType ||
              entityData.component_type ||
              entityData[1],
            serial_number:
              entityData.serialNumber ||
              entityData.serial_number ||
              entityData[2],
            image: entityData.image || entityData[3],
            location: entityData.location || entityData[4],
            timestamp: entityData.timestamp || entityData[5],
            manufacturer_address:
              entityData.manufacturerAddress ||
              entityData.manufacturer_address ||
              entityData.manufacturer ||
              entityData[6],
            status: entityData.status || entityData[7] || "1",
            raw_material_id:
              entityData.rawMaterialId ||
              entityData.raw_material_id ||
              entityData[3],
          };
          console.log("Using entity data:", componentData);
        } else {
          console.log("Fetching from API:", componentId);
          const response = await api.get(`/component/${componentId}`);

          if (response.data && response.data.length > 0) {
            componentData = response.data[0];
            console.log("API response:", componentData);
          } else {
            setErrMsg(`Component "${componentId}" not found in database`);
            return;
          }
        }

        if (componentData.status !== "1" && componentData.status !== 1) {
          setErrMsg(
            `Component "${componentId}" must be certified (status = 1) before assembly. Current status: ${componentData.status}`
          );
          return;
        }

        if (componentData.status === "2" || componentData.status === 2) {
          setErrMsg(
            `Component "${componentId}" has already been used in another assembly`
          );
          return;
        }

        setScannedComponents((prevComponents) => {
          const newComponents = [...prevComponents, componentData];
          setActiveStep(
            Math.min(
              1,
              newComponents.length >= MINIMUM_COMPONENTS_REQUIRED ? 1 : 0
            )
          );
          console.log(
            "Added component. New list:",
            newComponents.map((c) => c.component_id)
          );
          return newComponents;
        });

        setSuccessMsg(`Component "${componentId}" added successfully!`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (error) {
        console.error("Error processing component:", error);
        if (error.response?.status === 404) {
          setErrMsg(`Component "${componentId}" not found`);
        } else {
          setErrMsg("Failed to fetch component data. Please try again.");
        }
      } finally {
        setProcessingComponent(false);
        isProcessingRef.current = false;
      }
    },
    [scannedComponents, location.pathname, navigate]
  );

  const generateWatchId = async () => {
    try {
      const response = await api.get("/generate-id/watch");
      setWatchId(response.data.id);
    } catch (error) {
      console.error("Error generating watch ID:", error);
      const fallbackId = assemblerUtils.generateWatchId();
      setWatchId(fallbackId);
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
      setActiveStep(
        scannedComponents.length >= MINIMUM_COMPONENTS_REQUIRED ? 1 : 0
      );
    }
  };

  const uploadImage = async () => {
    if (!image.file) {
      throw new Error("No image file selected");
    }

    const data = new FormData();
    data.append("image", image.file);

    try {
      console.log("Starting image upload...");
      const res = await api.post("/upload/watch", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Image upload response:", res.data);

      let filename = null;

      if (res.data.success && res.data.filename) {
        filename = res.data.filename;
      } else if (res.data.filename) {
        filename = res.data.filename;
      } else if (typeof res.data === "string" && res.data.includes(".")) {
        filename = res.data;
      }

      if (filename) {
        console.log("Image uploaded successfully:", filename);
        setUploadedImageFilename(filename);
        return filename;
      } else {
        console.error("No filename found in response:", res.data);
        throw new Error("Upload failed: No filename returned from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
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

  const generateNFTMetadata = async (imageFilename) => {
    try {
      console.log("Generating NFT metadata...");
      setLoadingMessage("Generating NFT metadata and uploading to IPFS...");
      setActiveStep(2);

      const componentIds = scannedComponents.map((c) => c.component_id);

      const watchData = {
        watchId,
        componentIds,
        image: imageFilename,
        location: currentLocation,
        timestamp,
        assemblerAddress: currentAccount,
        generateNFT: true,
      };

      console.log("Sending watch data for NFT generation:", watchData);

      const response = await api.post("/watch", watchData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Watch created with NFT metadata:", response.data);

      if (response.data.success && response.data.nftData) {
        setNftData(response.data.nftData);
        setNftGenerated(true);
        console.log(
          "NFT metadata generated:",
          response.data.nftData.metadataURI
        );
        return response.data.nftData.metadataURI;
      } else {
        throw new Error("NFT metadata generation failed");
      }
    } catch (error) {
      console.error("Error generating NFT metadata:", error);
      throw error;
    }
  };

  const handleScanComponent = () => {
    navigate("/scanner", {
      state: {
        returnTo: "/assemble-watch",
        scanType: "component",
        existingComponents: scannedComponents.map((c) => c.component_id),
      },
    });
  };

  const removeComponent = useCallback((componentId) => {
    console.log("Removing component:", componentId);

    setScannedComponents((prevComponents) => {
      const filteredComponents = prevComponents.filter(
        (c) => c.component_id !== componentId
      );
      console.log(
        "Components after removal:",
        filteredComponents.map((c) => c.component_id)
      );
      return filteredComponents;
    });

    setSuccessMsg("Component removed from assembly");
    setTimeout(() => setSuccessMsg(""), 2000);
  }, []);

  const clearAllComponents = useCallback(() => {
    setScannedComponents([]);
    localStorage.removeItem(STORAGE_KEY);
    setActiveStep(0);
    setSuccessMsg("All components cleared");
    setTimeout(() => setSuccessMsg(""), 2000);
  }, []);

  const generateQRCode = () => {
    const data = `${CONTRACT_ADDRESS},${watchId}`;
    setQrData(data);
    console.log("QR Code generated:", data);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("WatchQRCode");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${watchId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleBack = () => {
    navigate("/assembler");
  };

  // FIXED: Updated assembleOnBlockchain function for NFT integration
  const assembleOnBlockchain = async (metadataURI) => {
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

        setLoadingMessage(
          "Please approve the NFT minting transaction in your wallet..."
        );
        setActiveStep(3);

        const componentIds = scannedComponents.map((c) => c.component_id);
        console.log("Assembling with components:", componentIds);
        console.log("NFT Metadata URI:", metadataURI);

        // FIXED: Call the NEW assembleWatch function with metadata URI (6 parameters)
        const assembleTxn = await contract.assembleWatch(
          watchId,
          componentIds,
          uploadedImageFilename, // Use the uploaded filename
          currentLocation,
          timestamp,
          metadataURI // Add the NFT metadata URI
        );

        setLoadingMessage(`Mining NFT transaction: ${assembleTxn.hash}...`);
        await assembleTxn.wait();

        console.log("NFT minted successfully on blockchain");

        // FIXED: Get the token ID from the new NFT-enabled contract
        try {
          const tokenIdResult = await contract.getWatchTokenId(watchId);
          setTokenId(tokenIdResult.toString());
          console.log("Token ID retrieved:", tokenIdResult.toString());
        } catch (tokenError) {
          console.log("Token ID retrieval failed:", tokenError);
          // Try alternative method for getting latest token ID
          try {
            const totalMinted = await contract.totalNFTsMinted();
            const possibleTokenId = totalMinted.toNumber() - 1;
            setTokenId(possibleTokenId.toString());
            console.log("Token ID estimated:", possibleTokenId);
          } catch (estimateError) {
            console.log("Token ID estimation failed:", estimateError);
          }
        }

        setActiveStep(4);
        setLoadingMessage("");
        setSuccessMsg("Watch assembled and NFT minted successfully!");
        generateQRCode();

        clearAllComponents();

        return true;
      } else {
        setErrMsg("Ethereum object doesn't exist!");
        return false;
      }
    } catch (error) {
      console.error("Blockchain assembly error:", error);
      setLoadingMessage("");

      // IMPROVED: Better error handling for NFT-specific errors
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        setErrMsg("Transaction was rejected by user");
      } else if (error.message.includes("Minimum 3 components required")) {
        setErrMsg(
          `Smart contract requires minimum ${MINIMUM_COMPONENTS_REQUIRED} components. You currently have ${scannedComponents.length} component(s).`
        );
      } else if (error.message.includes("already exists")) {
        setErrMsg(
          "Watch ID already exists on blockchain. Please generate a new Watch ID."
        );
      } else if (error.message.includes("Empty metadata URI")) {
        setErrMsg("NFT metadata generation failed. Please try again.");
      } else if (error.message.includes("gas")) {
        setErrMsg(
          "Transaction failed due to insufficient gas. Please try again with higher gas limit."
        );
      } else {
        setErrMsg(`Blockchain error: ${error.message}`);
      }
      return false;
    }
  };

  // FIXED: Updated handleSubmit to properly chain IPFS → Blockchain
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    setLoadingMessage("");

    if (!watchId || !currentAccount) {
      setErrMsg("Please connect your wallet");
      setLoading(false);
      return;
    }

    if (scannedComponents.length < MINIMUM_COMPONENTS_REQUIRED) {
      setErrMsg(
        `Smart contract requires minimum ${MINIMUM_COMPONENTS_REQUIRED} certified components. You currently have ${
          scannedComponents.length
        } component(s). Please add ${
          MINIMUM_COMPONENTS_REQUIRED - scannedComponents.length
        } more component(s).`
      );
      setLoading(false);
      return;
    }

    if (!image.file) {
      setErrMsg("Please upload an image of the assembled watch");
      setLoading(false);
      return;
    }

    const uncertifiedComponents = scannedComponents.filter(
      (c) => c.status !== "1" && c.status !== 1
    );
    if (uncertifiedComponents.length > 0) {
      setErrMsg(
        `Cannot assemble: ${uncertifiedComponents.length} component(s) are not certified`
      );
      setLoading(false);
      return;
    }

    try {
      // Step 1: Upload image
      setLoadingMessage("Uploading image...");
      const uploadedFilename = await uploadImage();

      if (!uploadedFilename) {
        setErrMsg("Failed to upload image. Please try again.");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("Image upload completed, filename:", uploadedFilename);

      // Step 2: Generate NFT metadata and save to database
      const metadataURI = await generateNFTMetadata(uploadedFilename);

      if (!metadataURI) {
        setErrMsg("Failed to generate NFT metadata. Please try again.");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("NFT metadata generated:", metadataURI);

      // Step 3: FIXED: Mint NFT on blockchain with metadata URI
      setLoadingMessage("Minting NFT on blockchain...");
      const blockchainSuccess = await assembleOnBlockchain(metadataURI);

      if (blockchainSuccess) {
        console.log("Full NFT assembly process completed successfully");
      }
    } catch (error) {
      console.error("Assembly process error:", error);
      setErrMsg(`Assembly failed: ${error.message}`);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
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

  const getComponentProgress = () => {
    return Math.min(
      (scannedComponents.length / MINIMUM_COMPONENTS_REQUIRED) * 100,
      100
    );
  };

  const getIPFSGatewayUrl = (ipfsUri) => {
    if (!ipfsUri) return null;
    if (ipfsUri.startsWith("ipfs://")) {
      return `https://gateway.pinata.cloud/ipfs/${ipfsUri.slice(7)}`;
    }
    return ipfsUri;
  };

  return (
    <DashboardLayout>
      <MainContainer maxWidth="lg">
        <Fade in timeout={500}>
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
                  <Token sx={{ fontSize: 36, color: "#673ab7", mr: 2 }} />
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      background:
                        "linear-gradient(45deg, #ffffff 30%, #673ab7 70%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1,
                    }}
                  >
                    NFT Watch Assembly Lab
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
                  Create unique NFT timepieces with full blockchain provenance
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
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor:
                                completed || active
                                  ? "#673ab7"
                                  : "rgba(103, 58, 183, 0.2)",
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? "#673ab7"
                                  : "rgba(103, 58, 183, 0.3)"
                              }`,
                            }}
                          >
                            {completed ? (
                              <CheckCircle sx={{ fontSize: 20 }} />
                            ) : (
                              index + 1
                            )}
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
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: "8px",
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                    color: "#ffffff",
                  }}
                  ref={errRef}
                >
                  {errMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: "8px",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    color: "#ffffff",
                  }}
                >
                  {successMsg}
                </Alert>
              )}

              {processingComponent && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: "8px",
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                    border: "1px solid rgba(33, 150, 243, 0.3)",
                    color: "#ffffff",
                  }}
                >
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  Processing scanned component...
                </Alert>
              )}

              <Grid container spacing={3}>
                {/* Left Column - Assembly Information */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#673ab7",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      <Engineering sx={{ mr: 1 }} />
                      Assembly Information
                    </Typography>

                    <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Watch ID"
                      variant="outlined"
                      value={watchId}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <AutoAwesome sx={{ mr: 1, color: "#673ab7" }} />
                        ),
                      }}
                    />

                    <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Assembly Location"
                      variant="outlined"
                      value={currentLocation}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      multiline
                      rows={2}
                      InputProps={{
                        startAdornment: (
                          <LocationOn sx={{ mr: 1, color: "#673ab7" }} />
                        ),
                      }}
                    />

                    <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Assembly Timestamp"
                      variant="outlined"
                      value={formatTimestamp(timestamp)}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <Schedule sx={{ mr: 1, color: "#673ab7" }} />
                        ),
                      }}
                    />

                    <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Assembler Wallet"
                      variant="outlined"
                      value={currentAccount}
                      disabled
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <AccountBalanceWallet
                            sx={{ mr: 1, color: "#673ab7" }}
                          />
                        ),
                      }}
                    />
                  </Box>
                </Grid>

                {/* Right Column - Component Progress */}
                <Grid item xs={12} md={6}>
                  <ProgressSection>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#673ab7",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                        }}
                      >
                        <PrecisionManufacturing sx={{ mr: 1 }} />
                        Assembly Progress
                      </Typography>

                      <Stack spacing={2}>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              Components Required
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#673ab7", fontWeight: 600 }}
                            >
                              {scannedComponents.length}/
                              {MINIMUM_COMPONENTS_REQUIRED}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getComponentProgress()}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "rgba(103, 58, 183, 0.2)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                background:
                                  scannedComponents.length >=
                                  MINIMUM_COMPONENTS_REQUIRED
                                    ? "#673ab7"
                                    : "#ff9800",
                              },
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={
                              scannedComponents.length >=
                              MINIMUM_COMPONENTS_REQUIRED
                                ? "Ready to Mint NFT"
                                : `${
                                    MINIMUM_COMPONENTS_REQUIRED -
                                    scannedComponents.length
                                  } More Needed`
                            }
                            color={
                              scannedComponents.length >=
                              MINIMUM_COMPONENTS_REQUIRED
                                ? "success"
                                : "warning"
                            }
                            icon={
                              scannedComponents.length >=
                              MINIMUM_COMPONENTS_REQUIRED ? (
                                <Token />
                              ) : (
                                <Build />
                              )
                            }
                            sx={{ fontWeight: 600 }}
                          />
                          <Badge
                            badgeContent={scannedComponents.length}
                            color="primary"
                            sx={{
                              "& .MuiBadge-badge": {
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                              },
                            }}
                          >
                            <Watch sx={{ color: "#673ab7", fontSize: 28 }} />
                          </Badge>
                        </Box>
                      </Stack>
                    </CardContent>
                  </ProgressSection>
                </Grid>

                {/* Components Section */}
                <Grid item xs={12}>
                  <ProgressSection>
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#673ab7",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <QrCode2 sx={{ mr: 1 }} />
                          Certified Components
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <PremiumButton
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleScanComponent}
                            disabled={processingComponent}
                          >
                            {processingComponent
                              ? "Processing..."
                              : "Scan Component"}
                          </PremiumButton>
                          {scannedComponents.length > 0 && (
                            <PremiumButton
                              variant="outlined"
                              color="error"
                              onClick={clearAllComponents}
                              disabled={processingComponent}
                            >
                              Clear All
                            </PremiumButton>
                          )}
                        </Stack>
                      </Box>

                      {scannedComponents.length === 0 ? (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 4,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <Build sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            No Components Added
                          </Typography>
                          <Typography variant="body2">
                            Scan QR codes to add certified components for NFT
                            assembly
                          </Typography>
                        </Box>
                      ) : (
                        <Grid container spacing={2}>
                          {scannedComponents.map((component, index) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={`component-${component.component_id}-${index}`}
                            >
                              <ComponentCard>
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "rgba(244, 67, 54, 0.1)",
                                    color: "error.main",
                                    zIndex: 1,
                                    "&:hover": {
                                      bgcolor: "error.main",
                                      color: "white",
                                    },
                                  }}
                                  size="small"
                                  onClick={() =>
                                    removeComponent(component.component_id)
                                  }
                                  disabled={processingComponent}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>

                                <CardContent sx={{ p: 2, textAlign: "center" }}>
                                  <Box sx={{ mb: 2 }}>
                                    {component.image &&
                                    component.image !== "" ? (
                                      <Avatar
                                        src={`${api.defaults.baseURL}/file/component/${component.image}`}
                                        alt={component.component_type}
                                        sx={{
                                          width: 50,
                                          height: 50,
                                          mx: "auto",
                                          border: "2px solid #673ab7",
                                        }}
                                      />
                                    ) : (
                                      <Avatar
                                        sx={{
                                          width: 50,
                                          height: 50,
                                          mx: "auto",
                                          backgroundColor: "#673ab7",
                                          fontSize: "1.2rem",
                                          border: "2px solid #9c27b0",
                                        }}
                                      >
                                        <PrecisionManufacturing />
                                      </Avatar>
                                    )}
                                  </Box>

                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#ffffff",
                                      mb: 1,
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {component.component_type}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontFamily: "monospace",
                                      color: "#673ab7",
                                      fontWeight: 600,
                                      display: "block",
                                      mb: 1,
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    {component.component_id}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.6)",
                                      display: "block",
                                      mb: 1,
                                      fontSize: "0.65rem",
                                    }}
                                  >
                                    Serial: {component.serial_number}
                                  </Typography>

                                  <Chip
                                    label="CERTIFIED"
                                    color="success"
                                    size="small"
                                    icon={<Verified />}
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "0.6rem",
                                      height: "20px",
                                    }}
                                  />
                                </CardContent>
                              </ComponentCard>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </CardContent>
                  </ProgressSection>
                </Grid>

                {/* Image Upload Section */}
                <Grid item xs={12}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#673ab7",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      <PhotoCamera sx={{ mr: 1 }} />
                      NFT Watch Documentation
                    </Typography>

                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="watch-image-upload"
                      type="file"
                      onChange={handleImage}
                    />
                    <label htmlFor="watch-image-upload">
                      <ImageUploadArea hasImage={!!image.filepreview}>
                        {image.filepreview ? (
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={image.filepreview}
                              alt="Watch Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "250px",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        ) : (
                          <>
                            <CloudUpload
                              sx={{ fontSize: 48, color: "#673ab7", mb: 2 }}
                            />
                            <Typography
                              variant="h6"
                              sx={{ color: "#ffffff", mb: 1 }}
                            >
                              Upload NFT Watch Image
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              High-resolution image for your unique NFT
                              timepiece
                            </Typography>
                          </>
                        )}
                      </ImageUploadArea>
                    </label>
                  </Box>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <PremiumButton
                        variant="outlined"
                        fullWidth
                        onClick={handleBack}
                        startIcon={<ArrowBack />}
                        disabled={loading}
                        sx={{ height: "48px" }}
                      >
                        Back to Dashboard
                      </PremiumButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PremiumButton
                        onClick={handleSubmit}
                        variant="contained"
                        fullWidth
                        disabled={
                          loading ||
                          scannedComponents.length <
                            MINIMUM_COMPONENTS_REQUIRED ||
                          !image.file ||
                          processingComponent
                        }
                        sx={{ height: "48px" }}
                      >
                        {loading ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Minting NFT...
                          </Box>
                        ) : scannedComponents.length <
                          MINIMUM_COMPONENTS_REQUIRED ? (
                          `Need ${
                            MINIMUM_COMPONENTS_REQUIRED -
                            scannedComponents.length
                          } More Components`
                        ) : (
                          <>
                            <Token sx={{ mr: 1 }} />
                            Mint NFT Watch
                          </>
                        )}
                      </PremiumButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Loading Status */}
              {loading && loadingMessage && (
                <InfoCard sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress
                      size={20}
                      sx={{ mr: 2, color: "#673ab7" }}
                    />
                    <Typography variant="body1" sx={{ color: "#ffffff" }}>
                      {loadingMessage}
                    </Typography>
                  </Box>
                </InfoCard>
              )}

              {/* NFT Success Section */}
              {nftGenerated && nftData && (
                <NFTSection>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "#673ab7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                      }}
                    >
                      <Token sx={{ mr: 2, fontSize: 28 }} />
                      NFT Successfully Created
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            p: 2,
                            background: "rgba(103, 58, 183, 0.1)",
                            borderRadius: "8px",
                            border: "1px solid rgba(103, 58, 183, 0.3)",
                          }}
                        >
                          <Storage sx={{ color: "#673ab7", mb: 1 }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                          >
                            IPFS Metadata
                          </Typography>
                          {nftData.metadataURI && (
                            <Link
                              href={getIPFSGatewayUrl(nftData.metadataURI)}
                              target="_blank"
                              sx={{
                                color: "#673ab7",
                                fontSize: "0.75rem",
                                fontFamily: "monospace",
                                wordBreak: "break-all",
                              }}
                            >
                              {nftData.metadataURI.slice(7, 20)}...
                              <OpenInNew sx={{ fontSize: 12, ml: 0.5 }} />
                            </Link>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            p: 2,
                            background: "rgba(103, 58, 183, 0.1)",
                            borderRadius: "8px",
                            border: "1px solid rgba(103, 58, 183, 0.3)",
                          }}
                        >
                          <PhotoCamera sx={{ color: "#673ab7", mb: 1 }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                          >
                            IPFS Image
                          </Typography>
                          {nftData.imageURI && (
                            <Link
                              href={getIPFSGatewayUrl(nftData.imageURI)}
                              target="_blank"
                              sx={{
                                color: "#673ab7",
                                fontSize: "0.75rem",
                                fontFamily: "monospace",
                                wordBreak: "break-all",
                              }}
                            >
                              {nftData.imageURI.slice(7, 20)}...
                              <OpenInNew sx={{ fontSize: 12, ml: 0.5 }} />
                            </Link>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            p: 2,
                            background: "rgba(103, 58, 183, 0.1)",
                            borderRadius: "8px",
                            border: "1px solid rgba(103, 58, 183, 0.3)",
                          }}
                        >
                          <Token sx={{ color: "#673ab7", mb: 1 }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                          >
                            Token ID
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#673ab7",
                              fontFamily: "monospace",
                              fontWeight: 600,
                            }}
                          >
                            {tokenId || "Generating..."}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider
                      sx={{ my: 2, borderColor: "rgba(103, 58, 183, 0.3)" }}
                    />

                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2 }}
                    >
                      Your luxury watch has been minted as an NFT with complete
                      supply chain provenance stored on IPFS. The NFT includes
                      all component details, assembly information, and
                      blockchain verification.
                    </Typography>
                  </CardContent>
                </NFTSection>
              )}

              {/* QR Code Section */}
              {qrData && (
                <QRSection>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "#673ab7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                      }}
                    >
                      <QrCode2 sx={{ mr: 2, fontSize: 28 }} />
                      NFT Authentication Code
                    </Typography>

                    <Box
                      sx={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <QRCode
                        id="WatchQRCode"
                        value={qrData}
                        size={180}
                        level={"H"}
                        includeMargin={true}
                      />

                      <PremiumButton
                        variant="contained"
                        startIcon={<Download />}
                        onClick={downloadQR}
                        sx={{ mt: 2, minWidth: "180px" }}
                      >
                        Download QR Code
                      </PremiumButton>
                    </Box>

                    {/* Success Summary */}
                    {successMsg && activeStep === 4 && (
                      <Box sx={{ mt: 2 }}>
                        <Divider
                          sx={{ my: 2, borderColor: "rgba(103, 58, 183, 0.3)" }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 1,
                            color: "#673ab7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle sx={{ mr: 1 }} />
                          NFT Assembly Complete
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Watch "{watchId}" has been successfully assembled with{" "}
                          {scannedComponents.length} certified components,
                          minted as NFT with full supply chain metadata stored
                          on IPFS, and permanently recorded on the blockchain.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </QRSection>
              )}
            </CardContent>
          </PremiumCard>
        </Fade>
      </MainContainer>
    </DashboardLayout>
  );
};

export default AssembleWatch;
