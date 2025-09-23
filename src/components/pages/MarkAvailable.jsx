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
  CardMedia,
  Divider,
  Chip,
  Container,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  LinearProgress,
  Fade,
  Grow,
  Zoom,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import {
  Storefront,
  QrCodeScanner,
  AttachMoney,
  CheckCircle,
  ArrowBack,
  Verified,
  Schedule,
  LocationOn,
  AccountBalanceWallet,
  LocalShipping,
  Diamond,
  Security,
  ShoppingBag,
  TrendingUp,
  AutoAwesome,
  Sell,
  TrackChanges,
  BrokenImage,
  Warning,
  Refresh,
  ErrorIcon,
  Token,
  PhotoCamera,
  Navigation,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import ShippingMapVisualization from "../pages/ShippingMapVisualization";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";
import {
  retailerColors,
  retailerAnimations,
  retailerStyles,
  retailerUtils,
  retailerConstants,
} from "./RetailerTheme";

// Enhanced animations
const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  `;

const luxuryGlow = keyframes`
    0%, 100% { 
      box-shadow: 0 0 20px rgba(233, 30, 99, 0.3),
                  0 0 40px rgba(233, 30, 99, 0.2),
                  inset 0 0 20px rgba(233, 30, 99, 0.1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(233, 30, 99, 0.6),
                  0 0 60px rgba(233, 30, 99, 0.4),
                  inset 0 0 30px rgba(233, 30, 99, 0.2);
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

const retailerPulse = keyframes`
    0%, 100% { 
      box-shadow: 0 0 20px rgba(233, 30, 99, 0.3),
                  0 0 40px rgba(233, 30, 99, 0.2),
                  inset 0 0 20px rgba(233, 30, 99, 0.1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(233, 30, 99, 0.6),
                  0 0 60px rgba(233, 30, 99, 0.4),
                  inset 0 0 30px rgba(233, 30, 99, 0.2);
    }
  `;

// Styled Components (adapted from UpdateShipping.jsx)
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
        radial-gradient(circle at 20% 80%, rgba(233, 30, 99, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(194, 24, 91, 0.1) 0%, transparent 50%)
      `,
    zIndex: -1,
    pointerEvents: "none",
  },
}));

const PremiumCard = styled(Card)(({ theme }) => ({
  ...retailerStyles.premiumCardWithShimmer,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
        radial-gradient(circle at 30% 40%, rgba(233, 30, 99, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 70% 60%, rgba(194, 24, 91, 0.05) 0%, transparent 50%)
      `,
    zIndex: 1,
    pointerEvents: "none",
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  ...retailerStyles.pageHeader,
  marginBottom: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  ...retailerStyles.styledTextField,
}));

const PriceTextField = styled(TextField)(({ theme }) => ({
  ...retailerStyles.priceInput,
}));

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  ...retailerStyles.premiumButton[variant || "contained"],
}));

const RetailerButton = styled(Button)(({ theme }) => ({
  ...retailerStyles.premiumButton.contained,
  background: retailerColors.gradients.retail,
  "&:hover": {
    background: retailerColors.gradients.retailHover,
    transform: "translateY(-2px)",
    boxShadow: `0 8px 25px ${retailerColors.alpha.primary50}`,
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.3)",
  },
}));

const StepperSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiStepLabel-label": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-active": {
      color: retailerColors.primary,
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: retailerColors.primary,
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: retailerColors.alpha.primary30,
  },
  "& .Mui-active .MuiStepConnector-line": {
    borderColor: retailerColors.primary,
  },
  "& .Mui-completed .MuiStepConnector-line": {
    borderColor: retailerColors.primary,
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  background: retailerColors.alpha.primary10,
  border: `1px solid ${retailerColors.alpha.primary20}`,
  borderRadius: "12px",
  padding: theme.spacing(2),
  color: "#ffffff",
  marginBottom: theme.spacing(2),
  animation: `${fadeInUp} 0.4s ease-out`,
}));

const WatchInfoCard = styled(Card)(({ theme }) => ({
  background: retailerColors.alpha.primary10,
  border: `1px solid ${retailerColors.alpha.primary20}`,
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
    background: retailerColors.gradients.retail,
  },
}));

const ShippingTimelineCard = styled(Card)(({ theme }) => ({
  ...retailerStyles.shippingProgress,
}));

const EnhancedTimelineItem = styled(Box)(({ theme }) => ({
  ...retailerStyles.timelineItem,
}));

// COPIED: Enhanced Image Display Component from UpdateShipping.jsx
const ImprovedImageDisplay = ({
  imageName,
  watchId,
  alt = "Luxury Watch",
  debugInfo = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log("Retailer: Enhanced Image Display Analysis:", {
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
    console.log("Retailer: No valid image name, showing placeholder");
    return (
      <Box sx={{ position: "relative", textAlign: "center" }}>
        <Avatar
          sx={{
            width: 280,
            height: 280,
            fontSize: "4rem",
            backgroundColor: retailerColors.alpha.primary30,
            margin: "auto",
            border: `2px solid ${retailerColors.alpha.primary30}`,
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
      "Retailer: Debug info indicates file doesn't exist:",
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
          <Warning
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
            sx={{ mt: 1, color: retailerColors.primary }}
          >
            <Refresh sx={{ fontSize: 16, mr: 0.5 }} />
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  const imageUrl = `${api.defaults.baseURL}/file/watch/${imageName}`;
  console.log("Retailer: Image URL constructed:", imageUrl);

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
            backgroundColor: retailerColors.alpha.primary10,
            borderRadius: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: retailerColors.primary }} />
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
          boxShadow: `0 8px 25px ${retailerColors.alpha.primary30}`,
          border: `1px solid ${retailerColors.alpha.primary30}`,
          transition: "all 0.3s ease",
          opacity: imageLoading ? 0 : 1,
        }}
        image={imageUrl}
        alt={alt}
        onLoad={(e) => {
          console.log("Retailer: Image loaded successfully:", e.target.src);
          setImageLoading(false);
          setImageError(false);
        }}
        onError={(e) => {
          console.log("Retailer: Image failed to load:", e.target.src);
          console.log("Retailer: Error details:", {
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

// Enhanced price validation utility (copied from original MarkAvailable.jsx)
const validatePriceEnhanced = (price) => {
  if (!price || price === "") {
    return { valid: false, message: "Price is required" };
  }

  const priceValue = parseFloat(price);

  if (isNaN(priceValue)) {
    return { valid: false, message: "Please enter a valid number" };
  }

  if (priceValue <= 0) {
    return { valid: false, message: "Price must be greater than 0" };
  }

  if (priceValue > 999999.99) {
    return { valid: false, message: "Price cannot exceed $999,999.99" };
  }

  const priceStr = price.toString();
  const decimalIndex = priceStr.indexOf(".");
  if (decimalIndex !== -1) {
    const decimals = priceStr.substring(decimalIndex + 1);
    if (decimals.length > 2) {
      return {
        valid: false,
        message: "Price cannot have more than 2 decimal places",
      };
    }
  }

  const formattedDisplay = priceValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return { valid: true, message: `Valid price: ${formattedDisplay}` };
};

const steps = [
  "Scan Watch QR",
  "Verify Watch Info",
  "Set Retail Price",
  "Record on Blockchain",
  "Update Database",
  "Listing Complete",
];

const MarkAvailable = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [watchData, setWatchData] = useState(null);
  const [retailPrice, setRetailPrice] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [qrData, setQrData] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Location and timestamp states (copied from UpdateShipping.jsx)
  const [currentLocation, setCurrentLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");

  // Success dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [availabilityDetails, setAvailabilityDetails] = useState(null);

  const CONTRACT_ADDRESS = retailerConstants.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Get data from navigation state (copied from UpdateShipping.jsx)
  const navigationQrData = location.state?.qrData;
  const navigationEntityData = location.state?.entityData;

  // COPIED: findMetaMaskAccount from UpdateShipping.jsx
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

  // COPIED: getCurrentTimeLocation from UpdateShipping.jsx
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

  useEffect(() => {
    setErrMsg("");
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
    getCurrentTimeLocation();

    // Initialize Geocode
    Geocode.setApiKey(retailerConstants.GEOCODE_API_KEY);

    // COPIED: Handle navigation data from UpdateShipping.jsx
    if (navigationQrData) {
      setQrData(navigationQrData);
      setActiveStep(1);
      console.log("Retailer: Navigation data received:", {
        hasQrData: !!navigationQrData,
        hasEntityData: !!navigationEntityData,
        qrData: navigationQrData,
      });

      // Always use fetchWatchData to get complete data with image
      fetchWatchData(navigationQrData);
    }
  }, [navigationQrData, navigationEntityData]);

  // COPIED: processEntityData from UpdateShipping.jsx but adapted for retailer
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
        retailPrice: parseFloat(entityData.retailPrice || entityData[13] || 0),
        // NFT-related fields (for metadata updates only)
        nftMetadataURI: entityData.nftMetadataURI,
        nftGenerated: entityData.nftGenerated || false,
        // COPIED: Add debug info handling
        _debugImageInfo: entityData._debugImageInfo || null,
      };

      console.log("Retailer: Processing entity data with image details:", {
        watchId: watch.watchId,
        image: watch.image,
        nftGenerated: watch.nftGenerated,
        debugInfo: watch._debugImageInfo,
      });

      // Retailer-specific validation: Check if watch is delivered and not already for sale
      if (parseInt(watch.shippingStatus) !== 3) {
        setErrMsg(
          `Watch must be delivered (status 3) before it can be marked available for sale. Current status: ${watch.shippingStatus}`
        );
        return;
      }

      if (watch.availableForSale === true) {
        setErrMsg("This watch is already marked as available for sale.");
        return;
      }

      if (watch.sold === true) {
        setErrMsg(
          "This watch has already been sold and cannot be marked for sale again."
        );
        return;
      }

      setWatchData(watch);
      setActiveStep(2);

      // Set existing price if available
      if (watch.retailPrice > 0) {
        setRetailPrice(watch.retailPrice.toString());
      }
    } catch (error) {
      console.error("Retailer: Error processing entity data:", error);
      setErrMsg("Failed to process watch data");
    }
  };

  // COPIED: Enhanced fetchWatchData function from UpdateShipping.jsx but adapted for retailer
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
          "Retailer: Fetching watch from database with debug info:",
          watchId
        );
        const dbResponse = await api.get(`/watch/${watchId}`);

        console.log("Retailer: Database response structure:", {
          dataExists: !!dbResponse.data,
          isArray: Array.isArray(dbResponse.data),
          length: dbResponse.data?.length,
          firstItemKeys: dbResponse.data?.[0]
            ? Object.keys(dbResponse.data[0])
            : null,
        });

        if (dbResponse.data && dbResponse.data.length > 0) {
          const watchFromDb = dbResponse.data[0];

          console.log("Retailer: Complete watch data from database:", {
            watchId: watchFromDb.watch_id,
            image: watchFromDb.image,
            imageType: typeof watchFromDb.image,
            imageLength: watchFromDb.image?.length,
            debugInfo: watchFromDb._debug_image_info,
            shippingStatus: watchFromDb.shipping_status,
            availableForSale: watchFromDb.available_for_sale,
            sold: watchFromDb.sold,
          });

          // Enhanced watch data processing with proper field extraction
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

            // CRITICAL: Include debug information for image troubleshooting
            _debugImageInfo: watchFromDb._debug_image_info || null,
          };

          console.log("Retailer: Final processed watch data for frontend:", {
            watchId: watchData.watchId,
            hasImage: !!watchData.image,
            imageFilename: watchData.image,
            imageIsString: typeof watchData.image === "string",
            imageNotEmpty: watchData.image && watchData.image.trim() !== "",
            shippingStatus: watchData.shippingStatus,
            availableForSale: watchData.availableForSale,
            sold: watchData.sold,
            debugImageInfo: watchData._debugImageInfo,
          });

          // Retailer-specific validation
          if (parseInt(watchData.shippingStatus) !== 3) {
            setErrMsg(
              `Watch must be delivered (status 3) before it can be marked available for sale. Current status: ${
                watchData.shippingStatus
              } (${retailerUtils.getShippingStatusText(
                watchData.shippingStatus
              )})`
            );
          } else if (watchData.availableForSale === true) {
            setErrMsg("This watch is already marked as available for sale.");
          } else if (watchData.sold === true) {
            setErrMsg(
              "This watch has already been sold and cannot be marked for sale again."
            );
          } else {
            setWatchData(watchData);
            setActiveStep(2);

            // Set existing price if available
            if (watchData.retailPrice > 0) {
              setRetailPrice(watchData.retailPrice.toString());
            }
          }
          setLoading(false);
          return;
        } else {
          console.log("Retailer: No data returned from database");
        }
      } catch (dbError) {
        console.log(
          "Retailer: Database fetch failed, trying blockchain:",
          dbError.message
        );
      }

      // Fallback to blockchain
      console.log("Retailer: Attempting blockchain fallback...");
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
          retailPrice: watch.retailPrice
            ? parseFloat(ethers.utils.formatEther(watch.retailPrice))
            : 0,
          // Keep NFT fields for metadata updates only
          nftMetadataURI: watch.metadataURI || null,
          nftGenerated: Boolean(watch.isNFTMinted || watch.nftGenerated),
          // No debug info from blockchain
          _debugImageInfo: null,
        };

        console.log("Retailer: Blockchain watch data:", {
          watchId: watchData.watchId,
          image: watchData.image,
          hasImage: !!watchData.image,
          shippingStatus: watchData.shippingStatus,
          availableForSale: watchData.availableForSale,
          sold: watchData.sold,
        });

        // Retailer-specific validation for blockchain data
        if (parseInt(watchData.shippingStatus) !== 3) {
          setErrMsg(
            `Watch must be delivered (status 3) before it can be marked available for sale. Current status: ${
              watchData.shippingStatus
            } (${retailerUtils.getShippingStatusText(
              watchData.shippingStatus
            )})`
          );
        } else if (watchData.availableForSale === true) {
          setErrMsg("This watch is already marked as available for sale.");
        } else if (watchData.sold === true) {
          setErrMsg(
            "This watch has already been sold and cannot be marked for sale again."
          );
        } else {
          setWatchData(watchData);
          setActiveStep(2);

          // Set existing price if available
          if (watchData.retailPrice > 0) {
            setRetailPrice(watchData.retailPrice.toString());
          }
        }
      } else {
        setErrMsg("MetaMask not available. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Retailer: Error fetching watch:", error);
      setErrMsg(`Failed to fetch watch data: ${error.message}`);
    }

    setLoading(false);
  };

  // COPIED: markAvailableOnBlockchain from original MarkAvailable.jsx
  const markAvailableOnBlockchain = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("MetaMask not available, skipping blockchain update");
        return { success: true, transactionHash: null };
      }

      console.log("Marking available on blockchain...");
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      setLoadingMessage("Please approve the transaction in your wallet...");
      setActiveStep(3);

      const formatPrecisePrice = (price) => {
        const priceStr = price.toString();
        const decimalIndex = priceStr.indexOf(".");
        if (decimalIndex === -1) {
          return `${priceStr}.00`;
        } else {
          const decimals = priceStr.substring(decimalIndex + 1);
          if (decimals.length === 0) {
            return `${priceStr}00`;
          } else if (decimals.length === 1) {
            return `${priceStr}0`;
          } else {
            return `${priceStr.substring(0, decimalIndex + 3)}`;
          }
        }
      };

      const priceValue = parseFloat(retailPrice);
      const formattedPriceStr = formatPrecisePrice(priceValue);
      const priceInWei = ethers.utils.parseEther(formattedPriceStr);

      console.log("Blockchain price conversion:", {
        input: retailPrice,
        parsed: priceValue,
        formatted: formattedPriceStr,
        wei: priceInWei.toString(),
      });

      const markTxn = await contract.markAvailableForSale(
        watchData.watchId,
        priceInWei
      );

      setLoadingMessage(`Mining transaction: ${markTxn.hash}...`);
      setActiveStep(4);
      console.log("Waiting for transaction confirmation...");
      await markTxn.wait();

      setLoadingMessage("");
      console.log("Blockchain marking successful:", markTxn.hash);

      return { success: true, transactionHash: markTxn.hash };
    } catch (error) {
      console.error("Blockchain update error:", error);
      setLoadingMessage("");

      if (error.code === "USER_REJECTED") {
        throw new Error("Transaction was rejected by user");
      } else {
        console.log("Blockchain update failed, continuing with database-only");
        return { success: true, transactionHash: null };
      }
    }
  };

  // COPIED: saveToDatabase from original MarkAvailable.jsx
  const saveToDatabase = async () => {
    try {
      console.log("Saving availability to database...");

      const formatPrecisePrice = (price) => {
        const priceStr = price.toString();
        const decimalIndex = priceStr.indexOf(".");
        if (decimalIndex === -1) {
          return `${priceStr}.00`;
        } else {
          const decimals = priceStr.substring(decimalIndex + 1);
          if (decimals.length === 0) {
            return `${priceStr}00`;
          } else if (decimals.length === 1) {
            return `${priceStr}0`;
          } else {
            return `${priceStr.substring(0, decimalIndex + 3)}`;
          }
        }
      };

      const priceValue = parseFloat(retailPrice);
      const formattedPrice = formatPrecisePrice(priceValue);

      let finalTimestamp = timestamp;
      if (!finalTimestamp) {
        finalTimestamp = new Date().toISOString();
        setTimestamp(finalTimestamp);
      }

      const timestampDate = new Date(finalTimestamp);
      if (isNaN(timestampDate.getTime())) {
        finalTimestamp = new Date().toISOString();
        setTimestamp(finalTimestamp);
      }

      const availableData = {
        watchId: watchData.watchId,
        retailerAddress: currentAccount,
        retailPrice: formattedPrice,
        location: currentLocation,
        timestamp: finalTimestamp,
      };

      console.log("Sending availability data:", availableData);

      const response = await api.post("/mark-available", availableData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      });
      console.log("Database save response:", response.data);

      if (response.data.success !== false) {
        return {
          success: true,
          storedPrice: formattedPrice,
          storedTimestamp: finalTimestamp,
          verificationData: response.data.verification,
        };
      } else {
        throw new Error(response.data.message || "Database update failed");
      }
    } catch (error) {
      console.error("Database save error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          `HTTP ${error.response.status}`;
        throw new Error(`Database error: ${errorMessage}`);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  };

  const showAvailabilitySuccessDialog = (details) => {
    setAvailabilityDetails(details);
    setShowSuccessDialog(true);
  };

  // CORE RETAILER FUNCTION: handleSubmit (adapted from original MarkAvailable.jsx)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    console.log("Starting mark available process...");

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

    const priceValidation = validatePriceEnhanced(retailPrice);
    if (!priceValidation.valid) {
      setErrMsg(priceValidation.message || "Please enter a valid retail price");
      setLoading(false);
      setActiveStep(2);
      return;
    }

    if (parseInt(watchData.shippingStatus) !== 3) {
      setErrMsg(
        `Watch must be delivered (status 3) before marking available for sale. Current status: ${
          watchData.shippingStatus
        } (${retailerUtils.getShippingStatusText(watchData.shippingStatus)})`
      );
      setLoading(false);
      setActiveStep(2);
      return;
    }

    if (watchData.availableForSale === true) {
      setErrMsg("This watch is already available for sale");
      setLoading(false);
      setActiveStep(2);
      return;
    }

    if (watchData.sold === true) {
      setErrMsg("This watch has already been sold");
      setLoading(false);
      setActiveStep(2);
      return;
    }

    try {
      setActiveStep(4);
      setLoadingMessage("Saving availability status to database...");

      const dbResult = await saveToDatabase();

      if (!dbResult.success) {
        setLoading(false);
        setActiveStep(2);
        return;
      }

      console.log("Database save successful:", dbResult);

      setLoadingMessage("Recording availability on blockchain...");
      const blockchainResult = await markAvailableOnBlockchain();

      if (blockchainResult.success) {
        setActiveStep(5);
        const priceValue = parseFloat(retailPrice);

        setWatchData((prev) => ({
          ...prev,
          availableForSale: true,
          retailer: currentAccount,
          retailPrice: priceValue,
          currentOwner: currentAccount,
          retailerTimestamp: dbResult.storedTimestamp || timestamp,
        }));

        showAvailabilitySuccessDialog({
          watchId: watchData.watchId,
          retailerAddress: currentAccount,
          retailPrice: priceValue,
          retailerLocation: currentLocation,
          availableDate: getDisplayTimestamp(),
          componentCount: watchData.componentIds?.length || 0,
          assemblerAddress: watchData.assembler,
          transactionHash: blockchainResult.transactionHash || "DB_ONLY",
          timestamp: timestamp,
          storedTimestamp: dbResult.storedTimestamp,
          verificationData: dbResult.verificationData,
        });

        setLoadingMessage("");

        const formattedPrice = priceValue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        setSuccessMsg(
          `Success! Watch "${
            watchData.watchId
          }" is now available for sale at ${formattedPrice} from ${currentLocation} at ${getDisplayTimestamp()}`
        );

        console.log("Mark available process completed successfully");
      }
    } catch (error) {
      console.error("Mark available error:", error);
      setErrMsg(
        error.message || "Failed to mark watch as available. Please try again."
      );
      setActiveStep(2);
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const handleBack = () => {
    navigate("/retailer");
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setAvailabilityDetails(null);
  };

  const getDisplayTimestamp = () => {
    if (timestamp) {
      try {
        const timestampDate = new Date(timestamp);
        if (!isNaN(timestampDate.getTime())) {
          return timestampDate.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "short",
          });
        } else {
          const now = new Date();
          return now.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "short",
          });
        }
      } catch (error) {
        console.error("Error formatting display timestamp:", error);
        const now = new Date();
        return now.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZoneName: "short",
        });
      }
    }
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  };

  const canMarkAvailable =
    watchData &&
    watchData.shippingStatus === 3 &&
    watchData.availableForSale === false &&
    watchData.sold === false &&
    currentAccount;

  const priceValidation = validatePriceEnhanced(retailPrice);

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
                  <Storefront
                    sx={{ fontSize: 40, color: retailerColors.primary, mr: 2 }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      background: `linear-gradient(45deg, #ffffff 30%, ${retailerColors.primary} 70%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1,
                    }}
                  >
                    Luxury NFT Boutique Listing
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
                  List luxury NFT timepieces in your premium collection
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
                                  ? retailerColors.primary
                                  : retailerColors.alpha.primary20,
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? retailerColors.primary
                                  : retailerColors.alpha.primary30
                              }`,
                              animation: active
                                ? `${retailerPulse} 2s infinite`
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
                      backgroundColor: retailerColors.alpha.primary10,
                      border: `1px solid ${retailerColors.alpha.primary30}`,
                      color: "#ffffff",
                    }}
                  >
                    {successMsg}
                  </Alert>
                </Zoom>
              )}

              {/* Watch Information Display */}
              {watchData && (
                <Grow in timeout={1000}>
                  <WatchInfoCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          color: retailerColors.primary,
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                        }}
                      >
                        <Diamond sx={{ mr: 2 }} />
                        NFT Luxury Timepiece Information
                      </Typography>

                      {/* Enhanced Image Display with improved image component */}
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

                        {/* NFT Indicator Badge */}
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
                                backgroundColor: retailerColors.primary + "30",
                                color: retailerColors.primary,
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
                              backgroundColor: retailerColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${retailerColors.alpha.primary20}`,
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
                                color: retailerColors.primary,
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
                              backgroundColor: retailerColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${retailerColors.alpha.primary20}`,
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
                              {retailerUtils.formatAddress(watchData.assembler)}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: retailerColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${retailerColors.alpha.primary20}`,
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
                              {retailerUtils.formatTimestamp(
                                watchData.timestamp
                              )}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: retailerColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${retailerColors.alpha.primary20}`,
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
                              backgroundColor: retailerColors.alpha.primary05,
                              borderRadius: 1,
                              border: `1px solid ${retailerColors.alpha.primary20}`,
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
                              label={retailerUtils.getShippingStatusText(
                                watchData.shippingStatus
                              )}
                              sx={{
                                backgroundColor:
                                  retailerUtils.getShippingStatusColor(
                                    watchData.shippingStatus
                                  ),
                                color: "#ffffff",
                                fontWeight: 600,
                                animation:
                                  parseInt(watchData.shippingStatus) === 3
                                    ? `${retailerPulse} 2s infinite`
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

              {/* QR Scanner Call-to-Action */}
              {!watchData && !loading && (
                <Grow in timeout={600}>
                  <InfoCard sx={{ textAlign: "center", p: 4 }}>
                    <QrCodeScanner
                      sx={{
                        fontSize: 60,
                        color: retailerColors.primary,
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
                      Use the QR scanner to identify the delivered NFT luxury
                      timepiece for retail listing
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

              {/* Main Form */}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Left Column - System Information */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1000}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: retailerColors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <Security sx={{ mr: 1 }} />
                          Retailer Information
                        </Typography>

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Retailer Address"
                          variant="outlined"
                          value={currentAccount}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AccountBalanceWallet
                                sx={{ mr: 1, color: retailerColors.primary }}
                              />
                            ),
                          }}
                        />

                        <StyledTextField
                          fullWidth
                          margin="normal"
                          label="Current Date & Time"
                          variant="outlined"
                          value={getDisplayTimestamp()}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <Schedule
                                sx={{ mr: 1, color: retailerColors.primary }}
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
                          InputLabelProps={{ shrink: true }}
                          multiline
                          rows={2}
                          InputProps={{
                            startAdornment: (
                              <LocationOn
                                sx={{ mr: 1, color: retailerColors.primary }}
                              />
                            ),
                          }}
                        />

                        {watchData && (
                          <StyledTextField
                            fullWidth
                            margin="normal"
                            label="Watch ID"
                            variant="outlined"
                            value={watchData.watchId}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <AutoAwesome
                                  sx={{ mr: 1, color: retailerColors.primary }}
                                />
                              ),
                            }}
                          />
                        )}
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Right Column - Pricing */}
                  <Grid item xs={12} md={6}>
                    <Grow in timeout={1200}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: retailerColors.primary,
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >
                          <AttachMoney sx={{ mr: 1 }} />
                          NFT Pricing Information
                        </Typography>

                        <PriceTextField
                          fullWidth
                          margin="normal"
                          label="Retail Price"
                          variant="outlined"
                          type="text"
                          value={retailPrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            const cleanValue = value.replace(/[^0-9.]/g, "");

                            const decimalParts = cleanValue.split(".");
                            if (decimalParts.length <= 2) {
                              if (
                                decimalParts.length === 2 &&
                                decimalParts[1].length > 2
                              ) {
                                const limitedDecimals =
                                  decimalParts[1].substring(0, 2);
                                setRetailPrice(
                                  `${decimalParts[0]}.${limitedDecimals}`
                                );
                              } else {
                                setRetailPrice(cleanValue);
                              }
                            }
                          }}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            inputProps: {
                              inputMode: "decimal",
                              pattern: "[0-9]*[.]?[0-9]*",
                              style: {
                                textAlign: "right",
                                fontSize: "1.1rem",
                                fontWeight: 600,
                              },
                            },
                          }}
                          InputLabelProps={{ shrink: true }}
                          helperText={
                            priceValidation.message ||
                            "Enter the retail price for this NFT luxury watch (max: $999,999.99)"
                          }
                          error={!priceValidation.valid && retailPrice !== ""}
                        />

                        {/* Progress indicator for current update */}
                        {loading && (
                          <Box
                            sx={{
                              mt: 3,
                              p: 2,
                              backgroundColor: retailerColors.alpha.primary05,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ mb: 2, color: "#ffffff" }}
                            >
                              <strong>NFT Listing Progress:</strong>
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(activeStep / (steps.length - 1)) * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: retailerColors.alpha.primary20,
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: retailerColors.primary,
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
                              {loadingMessage || "Processing NFT listing..."}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grow>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Grow in timeout={1400}>
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
                          <RetailerButton
                            type="submit"
                            fullWidth
                            disabled={
                              loading ||
                              !currentAccount ||
                              !canMarkAvailable ||
                              !priceValidation.valid
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
                                Processing NFT...
                              </Box>
                            ) : (
                              <>
                                <Sell sx={{ mr: 1 }} />
                                {retailPrice && priceValidation.valid
                                  ? `List NFT for Sale at ${parseFloat(
                                      retailPrice
                                    ).toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`
                                  : "List NFT Available for Sale"}
                              </>
                            )}
                          </RetailerButton>
                        </Grid>
                      </Grid>
                    </Grow>
                  </Grid>
                </Grid>
              </form>

              {/* Scan Watch Button */}
              {!watchData && !loading && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <PremiumButton
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/scanner")}
                      startIcon={<QrCodeScanner />}
                      sx={{ height: "56px" }}
                    >
                      Scan NFT Watch QR Code
                    </PremiumButton>
                  </Grid>
                </Grid>
              )}

              {/* Connection Warning */}
              {!currentAccount && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 3,
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 152, 0, 0.1)",
                    border: "1px solid rgba(255, 152, 0, 0.3)",
                    color: "#ffffff",
                  }}
                >
                  Please connect your MetaMask wallet to list NFT watches for
                  sale
                </Alert>
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
              background: retailerColors.gradients.card,
              border: `1px solid ${retailerColors.alpha.primary30}`,
              borderRadius: "16px",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              backgroundColor: retailerColors.alpha.primary10,
              color: retailerColors.primary,
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Storefront sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="div" sx={{ color: "#ffffff" }}>
              🎉 NFT Luxury Watch Listed Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ mt: 2, color: "#ffffff" }}>
            {availabilityDetails && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: retailerColors.primary }}
                >
                  📋 NFT Listing Summary:
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>⌚ Watch ID:</strong>{" "}
                      {availabilityDetails.watchId}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>💰 Retail Price:</strong>{" "}
                      <span
                        style={{
                          color: retailerColors.primary,
                          fontWeight: "bold",
                        }}
                      >
                        {availabilityDetails.retailPrice.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>📅 Listed Date:</strong>{" "}
                      {availabilityDetails.availableDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>🏪 Retailer:</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        backgroundColor: retailerColors.alpha.primary10,
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {availabilityDetails.retailerAddress}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>📍 Location:</strong>{" "}
                      {availabilityDetails.retailerLocation}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider
                  sx={{ my: 2, borderColor: retailerColors.alpha.primary30 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>🔗 Blockchain Transaction:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    backgroundColor: retailerColors.alpha.primary10,
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${retailerColors.alpha.primary20}`,
                  }}
                >
                  {availabilityDetails.transactionHash === "DB_ONLY"
                    ? "Database Only"
                    : availabilityDetails.transactionHash}
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
              Continue Luxury NFT Journey
            </PremiumButton>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </DashboardLayout>
  );
};

export default MarkAvailable;
