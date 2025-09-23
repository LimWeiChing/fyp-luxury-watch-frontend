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
  Autocomplete,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  LinearProgress,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { styled, keyframes } from "@mui/material/styles";
import {
  LocalShipping,
  QrCodeScanner,
  ArrowBack,
  CheckCircle,
  Schedule,
  LocationOn,
  AccountBalanceWallet,
  Update,
  Security,
  TrendingUp,
  Verified,
  AutoAwesome,
  Refresh,
  Map as MapIcon,
  TrackChanges,
  Navigation,
  Token,
  Storage,
  CloudUpload,
  OpenInNew,
  Warning,
  BrokenImage,
  PhotoCamera,
  Error as ErrorIcon,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";
import ShippingMapVisualization from "../pages/ShippingMapVisualization";

// Import distributor theme
import {
  distributorColors,
  distributorAnimations,
  distributorStyles,
  distributorUtils,
  distributorConstants,
} from "./DistributorTheme";

// Enhanced animations for shipping theme
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

const shippingPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 188, 212, 0.3),
                0 0 40px rgba(0, 188, 212, 0.2),
                inset 0 0 20px rgba(0, 188, 212, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(0, 188, 212, 0.6),
                0 0 60px rgba(0, 188, 212, 0.4),
                inset 0 0 30px rgba(0, 188, 212, 0.2);
  }
`;

const truckAnimation = keyframes`
  0% { transform: translateX(0px); }
  25% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0px); }
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
      radial-gradient(circle at 20% 80%, rgba(0, 188, 212, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 172, 193, 0.1) 0%, transparent 50%)
    `,
    zIndex: -1,
    pointerEvents: "none",
  },
}));

const PremiumCard = styled(Card)(({ theme }) => ({
  ...distributorStyles.premiumCardWithShimmer,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 40%, rgba(0, 188, 212, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(0, 172, 193, 0.05) 0%, transparent 50%)
    `,
    zIndex: 1,
    pointerEvents: "none",
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  ...distributorStyles.pageHeader,
  marginBottom: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  ...distributorStyles.styledTextField,
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: distributorColors.alpha.primary05,
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: distributorColors.alpha.primary50,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: distributorColors.primary,
      boxShadow: `0 0 10px ${distributorColors.alpha.primary30}`,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: distributorColors.alpha.primary30,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: distributorColors.primary,
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiAutocomplete-paper": {
    background: "rgba(30, 30, 30, 0.95)",
    color: "#ffffff",
    border: `1px solid ${distributorColors.alpha.primary30}`,
  },
}));

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  ...distributorStyles.premiumButton[variant || "contained"],
}));

const ShippingButton = styled(Button)(({ theme }) => ({
  ...distributorStyles.premiumButton.shipping,
}));

const StepperSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiStepLabel-label": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-active": {
      color: distributorColors.primary,
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: distributorColors.primary,
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: distributorColors.alpha.primary30,
  },
  "& .Mui-active .MuiStepConnector-line": {
    borderColor: distributorColors.primary,
  },
  "& .Mui-completed .MuiStepConnector-line": {
    borderColor: distributorColors.primary,
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  ...distributorStyles.shippingStatusCard(),
}));

const ShippingTimelineCard = styled(Card)(({ theme }) => ({
  ...distributorStyles.shippingProgress,
}));

const EnhancedTimelineItem = styled(Box)(({ theme }) => ({
  ...distributorStyles.timelineItem,
}));

const WatchInfoCard = styled(Card)(({ theme }) => ({
  background: distributorColors.alpha.primary10,
  border: `1px solid ${distributorColors.alpha.primary20}`,
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
    background: distributorColors.gradients.shipping,
  },
}));

const NFTSection = styled(Card)(({ theme }) => ({
  background: "rgba(0, 188, 212, 0.05)",
  border: `1px solid ${distributorColors.alpha.primary20}`,
  borderRadius: "12px",
  marginTop: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #00bcd4, #0097a7, #00bcd4)",
  },
}));

// FIXED: Enhanced Image Display Component with proper React state management
const ImprovedImageDisplay = ({
  imageName,
  watchId,
  alt = "Luxury Watch",
  debugInfo = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log("FIXED: Enhanced Image Display Analysis:", {
    imageName,
    watchId,
    debugInfo: debugInfo
      ? {
          imageFileExists: debugInfo.image_file_exists,
          imageFilePath: debugInfo.image_file_path,
          imageType: debugInfo.image_type,
          imageIsNull: debugInfo.image_is_null,
          imageIsEmpty: debugInfo.image_is_empty,
          imageField: debugInfo.image_field,
        }
      : null,
  });

  // Reset states when imageName changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [imageName]);

  // Validation - check if we have a valid image name
  const hasValidImageName =
    imageName &&
    imageName.trim() !== "" &&
    imageName !== "null" &&
    imageName !== "undefined";

  if (!hasValidImageName) {
    console.log("FIXED: No valid image name, showing placeholder");
    return (
      <Box sx={{ position: "relative", textAlign: "center" }}>
        <Avatar
          sx={{
            width: 280,
            height: 280,
            fontSize: "4rem",
            backgroundColor: distributorColors.alpha.primary30,
            margin: "auto",
            border: `2px solid ${distributorColors.alpha.primary30}`,
          }}
        >
          ⌚
        </Avatar>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            mt: 1,
            display: "block",
          }}
        >
          No Image Available
        </Typography>
        {debugInfo && (
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 152, 0, 0.7)",
              mt: 0.5,
              display: "block",
              fontSize: "0.6rem",
            }}
          >
            Debug: {debugInfo.image_field || "No image field"}
          </Typography>
        )}
      </Box>
    );
  }

  // If we have debug info and know the file doesn't exist, show error immediately
  if (debugInfo && debugInfo.image_file_exists === false) {
    console.log(
      "FIXED: Debug info indicates file doesn't exist:",
      debugInfo.image_file_path
    );
    return (
      <Box sx={{ position: "relative", textAlign: "center" }}>
        <Box
          sx={{
            width: 280,
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            border: "2px dashed rgba(244, 67, 54, 0.3)",
            borderRadius: 2,
          }}
        >
          <BrokenImage
            sx={{ fontSize: "3rem", color: "rgba(244, 67, 54, 0.7)", mb: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              px: 2,
            }}
          >
            Image file not found on server
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              px: 2,
            }}
          >
            {imageName}
          </Typography>
        </Box>
      </Box>
    );
  }

  // If there was an error loading the image, show error state with retry
  if (imageError) {
    return (
      <Box sx={{ position: "relative", textAlign: "center" }}>
        <Box
          sx={{
            width: 280,
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            border: "2px dashed rgba(255, 152, 0, 0.3)",
            borderRadius: 2,
          }}
        >
          <ErrorIcon
            sx={{ fontSize: "3rem", color: "rgba(255, 152, 0, 0.7)", mb: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              px: 2,
            }}
          >
            Failed to load image
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              px: 2,
            }}
          >
            {imageName}
          </Typography>
          <Button
            size="small"
            onClick={() => {
              setImageError(false);
              setImageLoading(true);
            }}
            sx={{ mt: 1, color: distributorColors.primary }}
          >
            <Refresh sx={{ fontSize: 16, mr: 0.5 }} />
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  const imageUrl = `${api.defaults.baseURL}/file/watch/${imageName}`;
  console.log("FIXED: Image URL constructed:", imageUrl);

  return (
    <Box sx={{ position: "relative", textAlign: "center" }}>
      {/* Loading overlay */}
      {imageLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: 280,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: distributorColors.alpha.primary10,
            borderRadius: 2,
          }}
        >
          <CircularProgress
            size={40}
            sx={{ color: distributorColors.primary }}
          />
        </Box>
      )}

      {/* Actual image */}
      <CardMedia
        component="img"
        sx={{
          width: "100%",
          maxWidth: 280,
          height: 280,
          objectFit: "cover",
          borderRadius: 2,
          margin: "auto",
          display: "block",
          boxShadow: `0 8px 25px ${distributorColors.alpha.primary30}`,
          border: `1px solid ${distributorColors.alpha.primary30}`,
          transition: "all 0.3s ease",
          opacity: imageLoading ? 0 : 1,
        }}
        image={imageUrl}
        alt={alt}
        onLoad={(e) => {
          console.log("FIXED: Image loaded successfully:", e.target.src);
          setImageLoading(false);
          setImageError(false);
        }}
        onError={(e) => {
          console.log("FIXED: Image failed to load:", e.target.src);
          console.log("FIXED: Error details:", {
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight,
            complete: e.target.complete,
          });
          setImageLoading(false);
          setImageError(true);
        }}
      />
    </Box>
  );
};

// Shipping status options for distributors
const shippingStatusOptions = [
  {
    label: "SHIPPED",
    value: 1,
    description: "Package has been shipped from origin",
    color: distributorColors.warning,
    icon: "🚚",
  },
  {
    label: "IN TRANSIT",
    value: 2,
    description: "Package is in transit to destination",
    color: distributorColors.info,
    icon: "🚛",
  },
  {
    label: "DELIVERED",
    value: 3,
    description: "Package has been delivered to destination",
    color: distributorColors.success,
    icon: "✅",
  },
];

const updateSteps = [
  "Scan Watch QR",
  "Verify Watch Info",
  "Update Shipping Status",
  "Update NFT Metadata",
  "Blockchain Confirmation",
  "Update Complete",
];

const UpdateShipping = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [watchData, setWatchData] = useState(null);
  const [newShippingStatus, setNewShippingStatus] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [qrData, setQrData] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  // NFT-related state
  const [nftData, setNftData] = useState(null);
  const [nftUpdated, setNftUpdated] = useState(false);

  // Success dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(null);

  const CONTRACT_ADDRESS = distributorConstants.CONTRACT_ADDRESS;
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

    // FIXED: Always fetch fresh data from database to ensure image field is included
    if (navigationQrData) {
      setQrData(navigationQrData);
      setActiveStep(1);
      console.log("FIXED: Navigation data received:", {
        hasQrData: !!navigationQrData,
        hasEntityData: !!navigationEntityData,
        qrData: navigationQrData,
      });

      // CRITICAL FIX: Always use fetchWatchData to get complete data with image
      fetchWatchData(navigationQrData);
    }

    // Initialize Geocode
    Geocode.setApiKey(distributorConstants.GEOCODE_API_KEY);
  }, [navigationQrData, navigationEntityData]);

  const findMetaMaskAccount = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please install MetaMask!");
        return null;
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
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

  const processEntityData = (entityData) => {
    try {
      const watch = {
        watchId: entityData.watchId || entityData[0],
        componentIds: entityData.componentIds || entityData[1] || [],
        image: entityData.image || entityData[2],
        location: entityData.location || entityData[3],
        timestamp: entityData.timestamp || entityData[4],
        assembler: entityData.assembler || entityData[5],
        shippingStatus: entityData.shippingStatus || entityData[6] || 0,
        shippingTrail: entityData.shippingTrail || entityData[7] || [],
        availableForSale: entityData.availableForSale || entityData[8] || false,
        retailer: entityData.retailer || entityData[9],
        sold: entityData.sold || entityData[10] || false,
        currentOwner: entityData.currentOwner || entityData[11],
        ownershipHistory: entityData.ownershipHistory || entityData[12] || [],
        // NFT-related fields (for metadata updates only)
        nftMetadataURI: entityData.nftMetadataURI,
        nftGenerated: entityData.nftGenerated || false,
        // FIXED: Add debug info handling
        _debugImageInfo: entityData._debugImageInfo || null,
      };

      console.log("FIXED: Processing entity data with image details:", {
        watchId: watch.watchId,
        image: watch.image,
        nftGenerated: watch.nftGenerated,
        debugInfo: watch._debugImageInfo,
      });

      // Check if watch is already delivered
      if (parseInt(watch.shippingStatus) >= 3) {
        setErrMsg(
          "This watch has already been delivered and cannot be updated further."
        );
        return;
      }

      setWatchData(watch);
      setActiveStep(2);

      // Set appropriate next status options based on current status
      const currentStatus = parseInt(watch.shippingStatus);
      const availableOptions = shippingStatusOptions.filter(
        (option) => option.value === currentStatus + 1
      );

      if (availableOptions.length > 0) {
        setNewShippingStatus(availableOptions[0]);
      }
    } catch (error) {
      console.error("FIXED: Error processing entity data:", error);
      setErrMsg("Failed to process watch data");
    }
  };

  // FIXED: Enhanced fetchWatchData function with proper database response handling
  const fetchWatchData = async (scannedQrData) => {
    setLoading(true);
    setErrMsg("");

    const dataParts = scannedQrData.split(",");
    if (dataParts.length < 2) {
      setErrMsg("Invalid QR code format");
      setLoading(false);
      return;
    }

    const contractAddress = dataParts[0];
    const watchId = dataParts[1];

    if (contractAddress !== CONTRACT_ADDRESS) {
      setErrMsg("QR code does not belong to this system");
      setLoading(false);
      return;
    }

    try {
      // Try database first with enhanced debugging
      try {
        console.log(
          "FIXED: Fetching watch from database with debug info:",
          watchId
        );
        const dbResponse = await api.get(`/watch/${watchId}`);

        console.log("FIXED: Database response structure:", {
          dataExists: !!dbResponse.data,
          isArray: Array.isArray(dbResponse.data),
          length: dbResponse.data?.length,
          firstItemKeys: dbResponse.data?.[0]
            ? Object.keys(dbResponse.data[0])
            : null,
        });

        if (dbResponse.data && dbResponse.data.length > 0) {
          const watchFromDb = dbResponse.data[0];

          console.log("FIXED: Complete watch data from database:", {
            watchId: watchFromDb.watch_id,
            image: watchFromDb.image,
            imageType: typeof watchFromDb.image,
            imageLength: watchFromDb.image?.length,
            nftGenerated: watchFromDb.nft_generated,
            debugInfo: watchFromDb._debug_image_info,
            allFieldsRelatedToImage: {
              image: watchFromDb.image,
              nft_image_uri: watchFromDb.nft_image_uri,
              nft_generated: watchFromDb.nft_generated,
              nft_metadata_uri: watchFromDb.nft_metadata_uri,
            },
          });

          // FIXED: Enhanced watch data processing with proper field extraction
          const watchData = {
            watchId: watchFromDb.watch_id,
            componentIds: watchFromDb.component_ids || [],
            image: watchFromDb.image, // CRITICAL: Main image for display
            location: watchFromDb.location,
            timestamp: watchFromDb.timestamp,
            assembler: watchFromDb.assembler_address,
            shippingStatus: parseInt(watchFromDb.shipping_status) || 0,
            shippingTrail: watchFromDb.shipping_trail || [],
            availableForSale: Boolean(watchFromDb.available_for_sale),
            retailer: watchFromDb.retailer_address,
            sold: Boolean(watchFromDb.sold),
            currentOwner: watchFromDb.current_owner,
            ownershipHistory: watchFromDb.ownership_history || [],
            distributorAddress: watchFromDb.distributor_address,
            retailPrice: parseFloat(watchFromDb.retail_price) || 0,

            // NFT fields for metadata updates only
            nftMetadataURI: watchFromDb.nft_metadata_uri || null,
            nftImageURI: watchFromDb.nft_image_uri || null,
            nftGenerated: Boolean(watchFromDb.nft_generated),

            // CRITICAL FIX: Include debug information for image troubleshooting
            _debugImageInfo: watchFromDb._debug_image_info || null,
          };

          console.log("FIXED: Final processed watch data for frontend:", {
            watchId: watchData.watchId,
            hasImage: !!watchData.image,
            imageFilename: watchData.image,
            imageIsString: typeof watchData.image === "string",
            imageNotEmpty: watchData.image && watchData.image.trim() !== "",
            nftGenerated: watchData.nftGenerated,
            nftImageURI: watchData.nftImageURI,
            debugImageInfo: watchData._debugImageInfo,
            recommendedImageSource:
              watchData._debugImageInfo?.recommended_image_source,
          });

          // Detailed image validation
          if (!watchData.image || watchData.image.trim() === "") {
            console.warn("FIXED: Watch has no image field or image is empty");
            console.log("FIXED: Image alternatives:", {
              nftImageURI: watchData.nftImageURI,
              hasNftImageURI: !!watchData.nftImageURI,
              recommendedSource:
                watchData._debugImageInfo?.recommended_image_source,
            });
          } else {
            console.log("FIXED: Image field validation passed:", {
              image: watchData.image,
              length: watchData.image.length,
              trimmed: watchData.image.trim(),
            });
          }

          // Check if watch is already delivered
          if (parseInt(watchData.shippingStatus) >= 3) {
            setErrMsg(
              "This watch has already been delivered and cannot be updated further."
            );
          } else {
            setWatchData(watchData);
            setActiveStep(2);

            // Set appropriate next status
            const currentStatus = parseInt(watchData.shippingStatus);
            const availableOptions = shippingStatusOptions.filter(
              (option) => option.value === currentStatus + 1
            );

            if (availableOptions.length > 0) {
              setNewShippingStatus(availableOptions[0]);
            }
          }
          setLoading(false);
          return;
        } else {
          console.log("FIXED: No data returned from database");
        }
      } catch (dbError) {
        console.log(
          "FIXED: Database fetch failed, trying blockchain:",
          dbError.message
        );
        console.log("FIXED: Database error details:", {
          status: dbError.response?.status,
          data: dbError.response?.data,
          message: dbError.message,
        });
      }

      // Fallback to blockchain
      console.log("FIXED: Attempting blockchain fallback...");
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        const watch = await contract.getWatch(watchId);

        // Blockchain fallback with focus on local image
        const watchData = {
          watchId: watch.watchId,
          componentIds: watch.componentIds,
          image: watch.image, // Use blockchain image field
          location: watch.location,
          timestamp: watch.timestamp,
          assembler: watch.assembler,
          shippingStatus: watch.shippingStatus,
          shippingTrail: watch.shippingTrail,
          availableForSale: watch.availableForSale,
          retailer: watch.retailer,
          sold: watch.sold,
          currentOwner: watch.currentOwner,
          ownershipHistory: watch.ownershipHistory,
          // Keep NFT fields for metadata updates only
          nftMetadataURI: watch.metadataURI || null,
          nftGenerated: Boolean(watch.isNFTMinted || watch.nftGenerated),
          // No debug info from blockchain
          _debugImageInfo: null,
        };

        console.log("FIXED: Blockchain watch data:", {
          watchId: watchData.watchId,
          image: watchData.image,
          hasImage: !!watchData.image,
        });

        // Check if watch is already delivered
        if (parseInt(watchData.shippingStatus) >= 3) {
          setErrMsg(
            "This watch has already been delivered and cannot be updated further."
          );
        } else {
          setWatchData(watchData);
          setActiveStep(2);

          // Set appropriate next status
          const currentStatus = parseInt(watchData.shippingStatus);
          const availableOptions = shippingStatusOptions.filter(
            (option) => option.value === currentStatus + 1
          );

          if (availableOptions.length > 0) {
            setNewShippingStatus(availableOptions[0]);
          }
        }
      } else {
        setErrMsg("MetaMask not available. Please install MetaMask.");
      }
    } catch (error) {
      console.error("FIXED: Error fetching watch:", error);
      setErrMsg(`Failed to fetch watch data: ${error.message}`);
    }

    setLoading(false);
  };

  const getCurrentTimeLocation = () => {
    setTimestamp(dayjs().unix().toString());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Store coordinates for map visualization
            setCurrentCoordinates({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

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

  // Update NFT metadata with shipping progression
  const updateNFTMetadata = async () => {
    try {
      if (!watchData.nftGenerated || !watchData.nftMetadataURI) {
        console.log("No NFT metadata to update");
        return { success: true };
      }

      setLoadingMessage("Updating NFT metadata with shipping progression...");
      console.log("Updating NFT metadata for shipping update...");

      const updateData = {
        watchId: watchData.watchId,
        updateReason: `Shipping status updated to ${newShippingStatus.label}`,
        additionalData: {
          shipping_update: {
            new_status: newShippingStatus.value,
            new_status_label: newShippingStatus.label,
            distributor_address: currentAccount,
            update_location: currentLocation,
            update_timestamp: new Date().toISOString(),
            coordinates: currentCoordinates,
          },
          distributor_info: {
            address: currentAccount,
            location: currentLocation,
            timestamp: new Date().toISOString(),
          },
        },
      };

      const response = await api.post("/update-nft-metadata", updateData, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      if (response.data.success) {
        setNftData({
          metadataURI: response.data.newMetadataURI,
          updateReason: updateData.updateReason,
        });
        setNftUpdated(true);
        console.log(
          "NFT metadata updated successfully:",
          response.data.newMetadataURI
        );
        return { success: true, newMetadataURI: response.data.newMetadataURI };
      } else {
        console.warn("NFT metadata update failed, continuing anyway");
        return { success: true };
      }
    } catch (error) {
      console.error("NFT metadata update error:", error);
      // Don't fail the whole process for NFT metadata update
      return { success: true };
    }
  };

  const updateShippingOnBlockchain = async () => {
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
        setActiveStep(4);

        const updateTxn = await contract.updateShippingStatus(
          watchData.watchId,
          newShippingStatus.value,
          currentLocation,
          timestamp
        );

        setLoadingMessage(`Mining transaction: ${updateTxn.hash}...`);
        await updateTxn.wait();

        setLoadingMessage("");
        setSuccessMsg(
          `Shipping status updated to ${newShippingStatus.label} successfully!`
        );

        return { success: true, transactionHash: updateTxn.hash };
      } else {
        setErrMsg("Ethereum object doesn't exist!");
        return { success: false };
      }
    } catch (error) {
      console.error("Blockchain update error:", error);
      setLoadingMessage("");
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        setErrMsg("Transaction was rejected by user");
      } else {
        setErrMsg(`Blockchain error: ${error.message}`);
      }
      return { success: false };
    }
  };

  const saveToDatabase = async () => {
    try {
      const shippingData = {
        watchId: watchData.watchId,
        shippingStatus: newShippingStatus.value,
        location: currentLocation,
        distributorAddress: currentAccount,
      };

      const response = await api.post("/update-shipping", shippingData, {
        headers: { "Content-Type": "application/json" },
      });
      return true;
    } catch (error) {
      console.error("Database save error:", error);
      if (error.response?.data) {
        setErrMsg(`Database error: ${error.response.data}`);
      } else {
        setErrMsg("Failed to save to database");
      }
      return false;
    }
  };

  const showUpdateSuccessDialog = (details) => {
    setUpdateDetails(details);
    setShowSuccessDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    setActiveStep(3);

    // Validation
    if (!watchData) {
      setErrMsg("No watch data available. Please scan a watch QR code first.");
      setLoading(false);
      setActiveStep(0);
      return;
    }

    if (!currentAccount) {
      setErrMsg("Please connect your MetaMask wallet");
      setLoading(false);
      setActiveStep(0);
      return;
    }

    if (!newShippingStatus) {
      setErrMsg("Please select a shipping status");
      setLoading(false);
      setActiveStep(2);
      return;
    }

    if (parseInt(watchData.shippingStatus) >= 3) {
      setErrMsg("This watch has already been delivered");
      setLoading(false);
      setActiveStep(2);
      return;
    }

    try {
      // Step 1: Save to database
      setLoadingMessage("Saving shipping update to database...");
      const dbSuccess = await saveToDatabase();

      if (!dbSuccess) {
        setLoading(false);
        setActiveStep(2);
        return;
      }

      // Step 2: Update NFT metadata with shipping progression
      setActiveStep(3);
      const nftResult = await updateNFTMetadata();

      // Step 3: Update on blockchain
      setLoadingMessage("Recording shipping update on blockchain...");
      setActiveStep(4);
      const blockchainResult = await updateShippingOnBlockchain();

      if (blockchainResult.success) {
        // Update local state to reflect the change
        const newTrailEntry = `${
          newShippingStatus.label
        } at ${currentLocation.replace(
          /;/g,
          ", "
        )} on ${distributorUtils.formatTimestamp(timestamp)}`;

        setWatchData((prev) => ({
          ...prev,
          shippingStatus: newShippingStatus.value,
          shippingTrail: [...(prev.shippingTrail || []), newTrailEntry],
          currentOwner: currentAccount,
        }));

        // Show success dialog with update details
        showUpdateSuccessDialog({
          watchId: watchData.watchId,
          oldStatus: distributorUtils.getShippingStatusText(
            watchData.shippingStatus
          ),
          newStatus: newShippingStatus.label,
          location: currentLocation,
          distributorAddress: currentAccount,
          updateDate: distributorUtils.formatTimestamp(timestamp),
          transactionHash: blockchainResult.transactionHash,
          nftUpdated: nftUpdated,
          nftMetadataURI: nftResult.newMetadataURI,
        });

        setActiveStep(5);

        // Reset form for next update
        const nextStatus = shippingStatusOptions.find(
          (opt) => opt.value === newShippingStatus.value + 1
        );
        setNewShippingStatus(nextStatus || null);
        getCurrentTimeLocation();
      }
    } catch (error) {
      console.error("Shipping update error:", error);
      setErrMsg("Shipping update failed. Please try again.");
      setActiveStep(2);
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const handleBack = () => {
    navigate("/distributor");
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setUpdateDetails(null);
  };

  const getIPFSGatewayUrl = (ipfsUri) => {
    if (!ipfsUri) return null;
    if (ipfsUri.startsWith("ipfs://")) {
      return `https://gateway.pinata.cloud/ipfs/${ipfsUri.slice(7)}`;
    }
    if (ipfsUri.startsWith("Qm") && ipfsUri.length === 46) {
      return `https://gateway.pinata.cloud/ipfs/${ipfsUri}`;
    }
    return ipfsUri;
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
                  <LocalShipping
                    sx={{
                      fontSize: 40,
                      color: distributorColors.primary,
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      background: `linear-gradient(45deg, #ffffff 30%, ${distributorColors.primary} 70%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1,
                    }}
                  >
                    NFT Shipping Control Center
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
                  Real-time shipping status with NFT metadata updates
                </Typography>
              </HeaderSection>

              {/* Progress Stepper */}
              <StepperSection>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {updateSteps.map((label, index) => (
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
                                  ? distributorColors.primary
                                  : distributorColors.alpha.primary20,
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? distributorColors.primary
                                  : distributorColors.alpha.primary30
                              }`,
                              animation: active
                                ? `${shippingPulse} 2s infinite`
                                : "none",
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
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
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
                      backgroundColor: distributorColors.alpha.primary10,
                      border: `1px solid ${distributorColors.alpha.primary30}`,
                      color: "#ffffff",
                    }}
                  >
                    {successMsg}
                  </Alert>
                </Zoom>
              )}

              {watchData && (
                <Grow in timeout={1000}>
                  <WatchInfoCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          color: distributorColors.primary,
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                        }}
                      >
                        <AutoAwesome sx={{ mr: 2 }} />
                        NFT Luxury Timepiece Information
                      </Typography>

                      {/* FIXED: Use the improved image display component with proper debug info */}
                      <Box
                        sx={{
                          textAlign: "center",
                          mb: 3,
                          position: "relative",
                        }}
                      >
                        <ImprovedImageDisplay
                          imageName={watchData.image}
                          watchId={watchData.watchId}
                          alt="Luxury Watch"
                          debugInfo={watchData._debugImageInfo}
                        />

                        {/* NFT Indicator Badge - Shows NFT is generated */}
                        {watchData.nftGenerated && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: "50%",
                              transform: "translateX(50%)",
                              zIndex: 10,
                            }}
                          >
                            <Chip
                              size="small"
                              label="NFT"
                              icon={<Token sx={{ fontSize: 12 }} />}
                              sx={{
                                backgroundColor:
                                  distributorColors.primary + "30",
                                color: distributorColors.primary,
                                fontSize: "0.6rem",
                                height: 20,
                                fontWeight: 600,
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                              }}
                            />
                          </Box>
                        )}
                      </Box>

                      {/* Watch Details Grid */}
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor:
                                distributorColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${distributorColors.alpha.primary20}`,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold", color: "#ffffff" }}
                            >
                              <AutoAwesome
                                sx={{
                                  fontSize: 18,
                                  mr: 1,
                                  verticalAlign: "middle",
                                }}
                              />
                              Watch ID:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: distributorColors.primary,
                                fontFamily: '"JetBrains Mono", monospace',
                                fontWeight: 600,
                                fontSize: "1rem",
                                mt: 0.5,
                              }}
                            >
                              {watchData.watchId}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor:
                                distributorColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${distributorColors.alpha.primary20}`,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold", color: "#ffffff" }}
                            >
                              <Security
                                sx={{
                                  fontSize: 18,
                                  mr: 1,
                                  verticalAlign: "middle",
                                }}
                              />
                              Assembler:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: "0.85rem",
                                wordBreak: "break-all",
                                color: "rgba(255, 255, 255, 0.9)",
                                mt: 0.5,
                              }}
                            >
                              {distributorUtils.formatAddress(
                                watchData.assembler
                              )}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor:
                                distributorColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${distributorColors.alpha.primary20}`,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold", color: "#ffffff" }}
                            >
                              <Schedule
                                sx={{
                                  fontSize: 18,
                                  mr: 1,
                                  verticalAlign: "middle",
                                }}
                              />
                              Assembly Date:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                mt: 0.5,
                              }}
                            >
                              {distributorUtils.formatTimestamp(
                                watchData.timestamp
                              )}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor:
                                distributorColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${distributorColors.alpha.primary20}`,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold", color: "#ffffff" }}
                            >
                              <Verified
                                sx={{
                                  fontSize: 18,
                                  mr: 1,
                                  verticalAlign: "middle",
                                }}
                              />
                              Components:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                mt: 0.5,
                              }}
                            >
                              {watchData.componentIds?.length || 0} certified
                              components
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor:
                                distributorColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${distributorColors.alpha.primary20}`,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "bold",
                                color: "#ffffff",
                                mb: 1,
                              }}
                            >
                              <LocalShipping
                                sx={{
                                  fontSize: 18,
                                  mr: 1,
                                  verticalAlign: "middle",
                                }}
                              />
                              Current Status:
                            </Typography>
                            <Chip
                              icon={<LocalShipping />}
                              label={distributorUtils.getShippingStatusText(
                                watchData.shippingStatus
                              )}
                              sx={{
                                backgroundColor:
                                  distributorUtils.getShippingStatusColor(
                                    watchData.shippingStatus
                                  ),
                                color: "#ffffff",
                                fontWeight: 600,
                                animation:
                                  parseInt(watchData.shippingStatus) < 3
                                    ? `${truckAnimation} 3s infinite`
                                    : "none",
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </WatchInfoCard>
                </Grow>
              )}

              {/* Shipping Trail & Map Visualization */}
              {watchData &&
                watchData.shippingTrail &&
                watchData.shippingTrail.length > 0 && (
                  <Grow in timeout={1200}>
                    <ShippingTimelineCard>
                      <CardContent sx={{ p: 3 }}>
                        {/* Map Component */}
                        <ShippingMapVisualization
                          shippingTrail={watchData.shippingTrail}
                          currentCoordinates={currentCoordinates}
                          showToggleButton={true}
                          initialShowMap={false}
                          height="400px"
                          title="🌍 Global NFT Shipping Route Tracker"
                          themeColors={{
                            primary: distributorColors.primary,
                            secondary: distributorColors.secondary,
                            accent: distributorColors.accent,
                            routeColor: distributorColors.primary,
                            routeGlow: distributorColors.alpha.primary30,
                          }}
                        />

                        {/* Enhanced Timeline View */}
                        <Box sx={{ mt: 4 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 3,
                              color: distributorColors.primary,
                              display: "flex",
                              alignItems: "center",
                              fontWeight: 600,
                            }}
                          >
                            <TrackChanges sx={{ mr: 2 }} />
                            NFT Shipping Timeline History
                          </Typography>
                          <Timeline
                            sx={{
                              [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0.3,
                              },
                            }}
                          >
                            {watchData.shippingTrail.map((entry, index) => {
                              const extractTimestamp = (entry) => {
                                try {
                                  const match = entry.match(
                                    /^(.*?)\s+at\s+(.*?)\s+on\s+(.*)$/
                                  );
                                  if (match) {
                                    const timestampStr = match[3].trim();
                                    const timestampRegex = /(\d{10,13})/;
                                    const unixMatch =
                                      timestampStr.match(timestampRegex);

                                    if (unixMatch) {
                                      const timestamp = parseInt(unixMatch[1]);
                                      const timestampMs =
                                        timestamp.toString().length === 10
                                          ? timestamp * 1000
                                          : timestamp;
                                      const date = dayjs(timestampMs);
                                      return date.isValid()
                                        ? date.format("DD/MM/YYYY h:mmA")
                                        : timestampStr;
                                    }

                                    const date = dayjs(timestampStr);
                                    return date.isValid()
                                      ? date.format("DD/MM/YYYY h:mmA")
                                      : timestampStr;
                                  }
                                  return dayjs().format("DD/MM/YYYY h:mmA");
                                } catch (error) {
                                  console.warn(
                                    "Error extracting timestamp:",
                                    error
                                  );
                                  return dayjs().format("DD/MM/YYYY h:mmA");
                                }
                              };

                              const formattedTimestamp =
                                extractTimestamp(entry);

                              return (
                                <TimelineItem key={index}>
                                  <TimelineOppositeContent
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.9)",
                                      fontSize: "0.875rem",
                                      fontWeight: 600,
                                      textAlign: "right",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: distributorColors.primary,
                                        fontFamily:
                                          '"JetBrains Mono", monospace',
                                        fontWeight: 700,
                                      }}
                                    >
                                      {formattedTimestamp}
                                    </Typography>
                                  </TimelineOppositeContent>
                                  <TimelineSeparator>
                                    <TimelineDot
                                      sx={{
                                        backgroundColor:
                                          distributorUtils.getShippingStatusColor(
                                            index + 1
                                          ),
                                        boxShadow: `0 0 15px ${distributorUtils.getShippingStatusColor(
                                          index + 1
                                        )}80`,
                                        width: 48,
                                        height: 48,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.2rem",
                                        border: `2px solid ${distributorUtils.getShippingStatusColor(
                                          index + 1
                                        )}`,
                                        animation:
                                          index ===
                                          watchData.shippingTrail.length - 1
                                            ? `${shippingPulse} 2s infinite`
                                            : "none",
                                      }}
                                    >
                                      {distributorUtils.getShippingStatusIcon(
                                        index + 1
                                      )}
                                    </TimelineDot>
                                    {index <
                                      watchData.shippingTrail.length - 1 && (
                                      <TimelineConnector
                                        sx={{
                                          backgroundColor:
                                            distributorColors.primary,
                                          width: 4,
                                          boxShadow: `0 0 8px ${distributorColors.alpha.primary50}`,
                                        }}
                                      />
                                    )}
                                  </TimelineSeparator>
                                  <TimelineContent>
                                    <EnhancedTimelineItem>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          color: "#ffffff",
                                          fontWeight: 600,
                                          mb: 1,
                                        }}
                                      >
                                        {entry.split(" on ")[0]}
                                      </Typography>

                                      <Box
                                        sx={{
                                          mt: 1,
                                          display: "flex",
                                          gap: 1,
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <Chip
                                          size="small"
                                          label="📍 NFT Verified"
                                          sx={{
                                            backgroundColor:
                                              distributorColors.alpha.primary20,
                                            color: distributorColors.primary,
                                            fontSize: "0.7rem",
                                            height: 20,
                                          }}
                                        />
                                        {index ===
                                          watchData.shippingTrail.length -
                                            1 && (
                                          <Chip
                                            size="small"
                                            label="🔄 Current"
                                            sx={{
                                              backgroundColor:
                                                distributorColors.success +
                                                "30",
                                              color: distributorColors.success,
                                              fontSize: "0.7rem",
                                              height: 20,
                                              animation: `${shippingPulse} 2s infinite`,
                                            }}
                                          />
                                        )}
                                      </Box>
                                    </EnhancedTimelineItem>
                                  </TimelineContent>
                                </TimelineItem>
                              );
                            })}
                          </Timeline>
                        </Box>
                      </CardContent>
                    </ShippingTimelineCard>
                  </Grow>
                )}

              {/* QR Scanner Call-to-Action */}
              {!watchData && !loading && (
                <Grow in timeout={600}>
                  <InfoCard sx={{ textAlign: "center", p: 4 }}>
                    <QrCodeScanner
                      sx={{
                        fontSize: 60,
                        color: distributorColors.primary,
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                      Scan NFT Watch QR Code to Begin
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      Use the QR scanner to identify the NFT luxury timepiece
                      for shipping updates
                    </Typography>
                    <PremiumButton
                      variant="contained"
                      startIcon={<QrCodeScanner />}
                      onClick={() => navigate("/scanner")}
                    >
                      Open QR Scanner
                    </PremiumButton>
                  </InfoCard>
                </Grow>
              )}

              {/* Shipping Update Form */}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Left Column - Distributor Information */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1400}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: distributorColors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <Security sx={{ mr: 1 }} />
                          Distributor Information
                        </Typography>

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Distributor Wallet Address"
                          variant="outlined"
                          value={currentAccount}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AccountBalanceWallet
                                sx={{ mr: 1, color: distributorColors.primary }}
                              />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Current Location"
                          variant="outlined"
                          value={currentLocation.replace(/;/g, ", ")}
                          disabled
                          multiline
                          rows={2}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <LocationOn
                                sx={{ mr: 1, color: distributorColors.primary }}
                              />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Update Timestamp"
                          variant="outlined"
                          value={
                            timestamp
                              ? distributorUtils.formatTimestamp(timestamp)
                              : ""
                          }
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <Schedule
                                sx={{ mr: 1, color: distributorColors.primary }}
                              />
                            ),
                          }}
                        />
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Right Column - Shipping Status Update */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1600}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: distributorColors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <Update sx={{ mr: 1 }} />
                          NFT Shipping Status Update
                        </Typography>

                        {watchData &&
                          parseInt(watchData.shippingStatus) < 3 && (
                            <StyledAutocomplete
                              options={shippingStatusOptions.filter(
                                (option) =>
                                  option.value ===
                                  parseInt(watchData.shippingStatus) + 1
                              )}
                              getOptionLabel={(option) =>
                                `${option.icon} ${option.label} - ${option.description}`
                              }
                              value={newShippingStatus}
                              onChange={(event, newValue) => {
                                setNewShippingStatus(newValue);
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.value === value?.value
                              }
                              renderInput={(params) => (
                                <StyledTextField
                                  {...params}
                                  fullWidth
                                  margin="normal"
                                  label="New Shipping Status"
                                  variant="outlined"
                                  required
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <TrendingUp
                                        sx={{
                                          mr: 1,
                                          color: distributorColors.primary,
                                        }}
                                      />
                                    ),
                                  }}
                                />
                              )}
                              disabled={loading}
                              sx={{ mt: 2 }}
                            />
                          )}

                        {watchData &&
                          parseInt(watchData.shippingStatus) >= 3 && (
                            <Alert
                              severity="success"
                              sx={{
                                mt: 2,
                                backgroundColor:
                                  distributorColors.alpha.primary10,
                                border: `1px solid ${distributorColors.alpha.primary30}`,
                                color: "#ffffff",
                              }}
                            >
                              This NFT luxury timepiece has been successfully
                              delivered and cannot be updated further.
                            </Alert>
                          )}

                        {/* Progress indicator for current update */}
                        {newShippingStatus && (
                          <Box
                            sx={{
                              mt: 3,
                              p: 2,
                              backgroundColor:
                                distributorColors.alpha.primary05,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ mb: 2, color: "#ffffff" }}
                            >
                              <strong>NFT Update Progress:</strong>
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (activeStep / (updateSteps.length - 1)) * 100
                              }
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor:
                                  distributorColors.alpha.primary20,
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: distributorColors.primary,
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1,
                                color: "rgba(255, 255, 255, 0.7)",
                                display: "block",
                              }}
                            >
                              This will update both blockchain state and NFT
                              metadata
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Grow in timeout={1800}>
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
                          <ShippingButton
                            type="submit"
                            fullWidth
                            disabled={
                              loading ||
                              !currentAccount ||
                              !watchData ||
                              !newShippingStatus ||
                              parseInt(watchData?.shippingStatus || 0) >= 3
                            }
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
                                Updating NFT...
                              </Box>
                            ) : (
                              <>
                                <Verified sx={{ mr: 1 }} />
                                Update NFT Shipping Status
                              </>
                            )}
                          </ShippingButton>
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
                        sx={{ mr: 2, color: distributorColors.primary }}
                      />
                      <Typography variant="body1" sx={{ color: "#ffffff" }}>
                        {loadingMessage}
                      </Typography>
                    </Box>
                  </InfoCard>
                </Zoom>
              )}

              {/* NFT Update Status */}
              {nftUpdated && nftData && (
                <NFTSection>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: distributorColors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                      }}
                    >
                      <Token sx={{ mr: 2, fontSize: 28 }} />
                      NFT Metadata Updated Successfully
                    </Typography>

                    <Box
                      sx={{
                        p: 2,
                        background: "rgba(0, 188, 212, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid rgba(0, 188, 212, 0.3)",
                        mb: 2,
                      }}
                    >
                      <CloudUpload
                        sx={{ color: distributorColors.primary, mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                      >
                        Updated IPFS Metadata
                      </Typography>
                      {nftData.metadataURI && (
                        <Button
                          href={getIPFSGatewayUrl(nftData.metadataURI)}
                          target="_blank"
                          sx={{
                            color: distributorColors.primary,
                            fontSize: "0.75rem",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                        >
                          {nftData.metadataURI.slice(7, 20)}...
                          <OpenInNew sx={{ fontSize: 12, ml: 0.5 }} />
                        </Button>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      NFT metadata has been updated with shipping progression
                      details, distributor information, and complete supply
                      chain history.
                    </Typography>
                  </CardContent>
                </NFTSection>
              )}
            </CardContent>
          </PremiumCard>
        </Fade>

        {/* Success Dialog */}
        <Dialog
          open={showSuccessDialog}
          onClose={handleCloseSuccessDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: distributorColors.gradients.card,
              border: `1px solid ${distributorColors.alpha.primary30}`,
              borderRadius: "16px",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              backgroundColor: distributorColors.alpha.primary10,
              color: distributorColors.primary,
              borderRadius: "16px 16px 0 0",
            }}
          >
            <LocalShipping sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="div" sx={{ color: "#ffffff" }}>
              🚚 NFT Shipping Status Updated Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ mt: 2, color: "#ffffff" }}>
            {updateDetails && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: distributorColors.primary }}
                >
                  📋 NFT Update Summary:
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>⌚ Watch ID:</strong> {updateDetails.watchId}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>🔄 Status Change:</strong>{" "}
                      {updateDetails.oldStatus} → {updateDetails.newStatus}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>📅 Update Date:</strong>{" "}
                      {updateDetails.updateDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>🚚 Distributor:</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        backgroundColor: distributorColors.alpha.primary10,
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {updateDetails.distributorAddress}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>📍 Location:</strong> {updateDetails.location}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider
                  sx={{ my: 2, borderColor: distributorColors.alpha.primary30 }}
                />

                {/* NFT Update Info */}
                {updateDetails.nftUpdated && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>🎨 NFT Metadata:</strong> Updated Successfully
                    </Typography>
                    {updateDetails.nftMetadataURI && (
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-all",
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          backgroundColor: distributorColors.alpha.primary10,
                          p: 2,
                          borderRadius: 1,
                          border: `1px solid ${distributorColors.alpha.primary20}`,
                        }}
                      >
                        {updateDetails.nftMetadataURI}
                      </Typography>
                    )}
                  </Box>
                )}

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>🔗 Blockchain Transaction:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    backgroundColor: distributorColors.alpha.primary10,
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${distributorColors.alpha.primary20}`,
                  }}
                >
                  {updateDetails.transactionHash}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <PremiumButton
              onClick={handleCloseSuccessDialog}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Navigation />}
            >
              Continue NFT Tracking Journey
            </PremiumButton>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </DashboardLayout>
  );
};

export default UpdateShipping;
