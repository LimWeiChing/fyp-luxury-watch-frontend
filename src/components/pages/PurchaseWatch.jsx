import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import api from "../../api/axios";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  TextField,
  Divider,
  Container,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Fade,
  Grow,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  ShoppingCart,
  CheckCircle,
  AccountBalanceWallet,
  Gavel,
  Diamond,
  Security,
  Schedule,
  Verified,
  AutoAwesome,
  EmojiEvents,
  QrCodeScanner,
  ArrowBack,
  Favorite,
  VerifiedUser,
  CloudUpload,
  Person,
  Token,
  Storage,
  OpenInNew,
  Warning,
  BrokenImage,
  Error as ErrorIcon,
  Refresh,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";
import {
  consumerColors,
  consumerTypography,
  consumerConstants,
  consumerUtils,
} from "./ConsumerTheme";

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

const nftPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 111, 0, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 111, 0, 0.6);
  }
`;

// Styled Components
const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const OptimizedCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(8px)",
  border: `1px solid ${consumerColors.alpha.primary20}`,
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  position: "relative",
  overflow: "hidden",
  animation: `${fadeInUp} 0.6s ease-out`,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const SimpleHeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: "2rem",
  animation: `${fadeInUp} 0.8s ease-out`,
}));

const EfficientTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(255, 111, 0, 0.05)",
    borderRadius: "12px",
    color: "#ffffff",
    transition: "border-color 0.2s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: consumerColors.alpha.primary50,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: consumerColors.primary,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: consumerColors.alpha.primary30,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: consumerColors.primary,
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

const OptimizedButton = styled(Button)(({ theme, variant, luxury }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.2s ease",
  ...(luxury === "true" && {
    background: consumerColors.gradients.gold,
    color: "#ffffff",
    border: `2px solid ${consumerColors.accent}`,
    "&:hover": {
      transform: "translateY(-1px)",
    },
  }),
  ...(variant === "contained" &&
    luxury !== "true" && {
      background: consumerColors.gradients.primary,
      color: "#ffffff",
      "&:hover": {
        background: consumerColors.gradients.secondary,
        transform: "translateY(-1px)",
      },
    }),
  ...(variant === "outlined" && {
    border: `1px solid ${consumerColors.alpha.primary50}`,
    color: consumerColors.primary,
    background: "rgba(255, 111, 0, 0.05)",
    "&:hover": {
      background: "rgba(255, 111, 0, 0.1)",
      borderColor: consumerColors.primary,
    },
  }),
}));

const SimplePriceCard = styled(Card)(({ theme }) => ({
  background: consumerColors.gradients.gold,
  border: `2px solid ${consumerColors.accent}`,
  borderRadius: "16px",
  padding: "1rem",
  textAlign: "center",
}));

const StatusChipContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const OptimizedStatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "available":
        return {
          background: consumerColors.gradients.primary,
          color: "#ffffff",
        };
      case "sold":
        return {
          background: "linear-gradient(45deg, #757575 30%, #424242 70%)",
          color: "#ffffff",
        };
      case "owner":
        return {
          background: consumerColors.gradients.gold,
          color: "#000000",
        };
      case "nft":
        return {
          background: "linear-gradient(45deg, #ff6f00 30%, #ff8f00 70%)",
          color: "#ffffff",
          animation: `${nftPulse} 3s infinite`,
        };
      default:
        return {
          background: consumerColors.gradients.primary,
          color: "#ffffff",
        };
    }
  };

  return {
    ...getStatusStyles(),
    fontFamily: consumerTypography.accent,
    fontSize: "0.9rem",
    fontWeight: 600,
    padding: theme.spacing(0.5, 1),
  };
});

const SimpleInfoCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 111, 0, 0.1)",
  border: `1px solid ${consumerColors.alpha.primary20}`,
  borderRadius: "12px",
  padding: "1.5rem",
  color: "#ffffff",
  marginBottom: "1.5rem",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
  },
}));

const OptimizedStepperSection = styled(Box)(({ theme }) => ({
  marginBottom: "2rem",
  "& .MuiStepLabel-label": {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: consumerTypography.accent,
    "&.Mui-active": {
      color: consumerColors.primary,
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: consumerColors.accent,
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: consumerColors.alpha.primary30,
  },
}));

const NFTSection = styled(Card)(({ theme }) => ({
  background: "rgba(255, 111, 0, 0.05)",
  border: `1px solid ${consumerColors.alpha.primary20}`,
  borderRadius: "12px",
  marginTop: theme.spacing(2),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #ff6f00, #ff8f00, #ff6f00)",
  },
}));

// FIXED: Improved Image Display Component with Better Error Handling
const WatchImageDisplay = ({
  imageName,
  watchId,
  alt = "Luxury Watch NFT",
  nftData = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log("FIXED: Watch Image Display Debug:", {
    imageName,
    watchId,
    hasImageName: !!imageName,
    imageNameType: typeof imageName,
    imageNameTrimmed: imageName?.trim(),
    nftGenerated: nftData?.nftGenerated,
  });

  // Reset states when imageName changes
  useEffect(() => {
    if (imageName && imageName.trim() !== "") {
      setImageError(false);
      setImageLoading(true);
    }
  }, [imageName]);

  // Check if we have a valid image name
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
            backgroundColor: consumerColors.alpha.primary30,
            margin: "auto",
            border: `2px solid ${consumerColors.alpha.primary30}`,
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
        {nftData?.nftGenerated && (
          <Chip
            size="small"
            label="NFT Generated"
            icon={<Token sx={{ fontSize: 12 }} />}
            sx={{
              mt: 1,
              backgroundColor: consumerColors.primary + "30",
              color: consumerColors.primary,
              fontSize: "0.6rem",
              height: 20,
            }}
          />
        )}
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
            sx={{ mt: 1, color: consumerColors.primary }}
          >
            <Refresh sx={{ fontSize: 16, mr: 0.5 }} />
            Retry
          </Button>
        </Box>
        {nftData?.nftGenerated && (
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              label="NFT Verified"
              icon={<Token sx={{ fontSize: 12 }} />}
              sx={{
                backgroundColor: consumerColors.primary + "30",
                color: consumerColors.primary,
                fontSize: "0.6rem",
                height: 20,
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // FIXED: Construct proper image URL
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
            backgroundColor: consumerColors.alpha.primary10,
            borderRadius: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: consumerColors.primary }} />
        </Box>
      )}

      {/* NFT Indicator Badge */}
      {nftData?.nftGenerated && (
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
              backgroundColor: consumerColors.primary + "30",
              color: consumerColors.primary,
              fontSize: "0.6rem",
              height: 20,
              fontWeight: 600,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              animation: `${nftPulse} 3s infinite`,
            }}
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
          boxShadow: `0 8px 25px ${consumerColors.alpha.primary30}`,
          border: `1px solid ${consumerColors.alpha.primary30}`,
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

// Helper Functions
const generateConsumerTimestamp = () => {
  const now = new Date();
  const isoTimestamp = now.toISOString();
  console.log("Consumer: Generated timestamp:", isoTimestamp);
  return isoTimestamp;
};

const formatDisplayTimestamp = (timestamp, format = "full") => {
  if (
    !timestamp ||
    timestamp === "0" ||
    timestamp === null ||
    timestamp === undefined
  ) {
    return format === "full" ? "Unknown Date & Time" : "Unknown Date";
  }

  try {
    let date;
    const timestampStr = timestamp.toString().trim();
    const timestampNum = parseInt(timestampStr);

    if (!isNaN(timestampNum) && timestampStr === timestampNum.toString()) {
      const timestampMs =
        timestampStr.length === 10 ? timestampNum * 1000 : timestampNum;
      date = dayjs(timestampMs);
    } else {
      date = dayjs(timestamp);
    }

    if (date && date.isValid()) {
      switch (format) {
        case "date":
          return date.format("DD/MM/YYYY");
        case "time":
          return date.format("h:mm A");
        case "full":
        default:
          return date.format("DD/MM/YYYY h:mm A");
      }
    } else {
      return format === "full" ? "Parse Error" : "Parse Error";
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return format === "full" ? "Error" : "Error";
  }
};

const findMetaMaskAccount = async () => {
  try {
    if (!window.ethereum) {
      console.log("MetaMask not detected");
      return null;
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    console.log("Found accounts:", accounts);

    if (accounts.length !== 0) {
      console.log("Using existing connection:", accounts[0]);
      return accounts[0];
    } else {
      console.log("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error("Error finding MetaMask account:", error);
    return null;
  }
};

const PurchaseWatch = () => {
  const CONTRACT_ADDRESS = consumerConstants.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const [watchData, setWatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const errRef = useRef();

  // Get navigation data
  const navigationQrData = location.state?.qrData;

  useEffect(() => {
    setErrMsg("");
    setSuccessMsg("");

    // Initialize wallet
    const initializeWallet = async () => {
      try {
        const account = await findMetaMaskAccount();
        console.log("Initial wallet check result:", account);
        if (account !== null) {
          setCurrentAccount(account);
          setActiveStep(1);
        } else {
          setActiveStep(0);
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
        setActiveStep(0);
      }
    };

    initializeWallet();

    // Handle QR data from navigation
    if (navigationQrData) {
      console.log("Navigation QR data received:", navigationQrData);
      setActiveStep(1);
      fetchWatchData(navigationQrData);
    }
  }, [navigationQrData]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Connecting to MetaMask...");

      if (!window.ethereum) {
        setErrMsg("Please install MetaMask!");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      console.log("Requesting account access...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Received accounts:", accounts);

      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        setActiveStep(1);
        setErrMsg("");
        setSuccessMsg("Wallet connected successfully!");
        console.log("Wallet connected successfully:", accounts[0]);

        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrMsg("No accounts found");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setErrMsg(
        `Failed to connect wallet: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // FIXED: Enhanced fetchWatchData with better image handling
  const fetchWatchData = async (scannedQrData) => {
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    setLoadingMessage("Loading NFT watch information...");

    console.log("FIXED: Starting fetchWatchData with QR:", scannedQrData);

    const dataParts = scannedQrData.split(",");
    if (dataParts.length < 2) {
      setErrMsg("Invalid QR code format");
      setLoading(false);
      setLoadingMessage("");
      return;
    }

    const contractAddress = dataParts[0];
    const watchId = dataParts[1];

    if (contractAddress !== CONTRACT_ADDRESS) {
      setErrMsg("QR code does not belong to this system");
      setLoading(false);
      setLoadingMessage("");
      return;
    }

    try {
      // Try database first
      console.log("FIXED: Fetching watch from database:", watchId);
      const dbResponse = await api.get(`/watch/${watchId}`);

      console.log("FIXED: Database response:", {
        dataExists: !!dbResponse.data,
        isArray: Array.isArray(dbResponse.data),
        length: dbResponse.data?.length,
      });

      if (dbResponse.data && dbResponse.data.length > 0) {
        const dbWatch = dbResponse.data[0];

        console.log("FIXED: Raw database watch data:", {
          watchId: dbWatch.watch_id,
          image: dbWatch.image,
          imageType: typeof dbWatch.image,
          imageLength: dbWatch.image?.length,
          nftGenerated: dbWatch.nft_generated,
          availableForSale: dbWatch.available_for_sale,
          sold: dbWatch.sold,
          retailPrice: dbWatch.retail_price,
        });

        // FIXED: Process watch data with explicit image handling
        const processedWatchData = {
          watchId: dbWatch.watch_id,
          componentIds: dbWatch.component_ids || [],
          image: dbWatch.image, // CRITICAL: This is the main image field
          location: dbWatch.location,
          timestamp: dbWatch.timestamp,
          assembler: dbWatch.assembler_address,
          shippingStatus: parseInt(dbWatch.shipping_status) || 0,
          shippingTrail: dbWatch.shipping_trail || [],
          availableForSale: Boolean(dbWatch.available_for_sale),
          retailer: dbWatch.retailer_address,
          sold: Boolean(dbWatch.sold),
          currentOwner: dbWatch.current_owner,
          ownershipHistory: dbWatch.ownership_history || [],
          distributorAddress: dbWatch.distributor_address,
          retailPrice: parseFloat(dbWatch.retail_price) || 0,

          // Timestamp fields
          assemblerTimestamp: dbWatch.timestamp,
          distributorTimestamp: dbWatch.distributor_timestamp,
          retailerTimestamp: dbWatch.retailer_timestamp,
          consumerTimestamp: dbWatch.consumer_timestamp,
          lastTransferTimestamp: dbWatch.last_transfer_timestamp,

          // NFT fields
          nftMetadataURI: dbWatch.nft_metadata_uri || null,
          nftImageURI: dbWatch.nft_image_uri || null,
          nftGenerated: Boolean(dbWatch.nft_generated),
        };

        console.log("FIXED: Processed watch data for frontend:", {
          watchId: processedWatchData.watchId,
          hasImage: !!processedWatchData.image,
          imageFilename: processedWatchData.image,
          nftGenerated: processedWatchData.nftGenerated,
          retailPrice: processedWatchData.retailPrice,
          availableForSale: processedWatchData.availableForSale,
          sold: processedWatchData.sold,
        });

        setWatchData(processedWatchData);
        setActiveStep(2);
        setLoading(false);
        setLoadingMessage("");
        return;
      } else {
        console.log("No data returned from database");
      }
    } catch (dbError) {
      console.log("Database fetch failed, trying blockchain:", dbError.message);

      // Fallback to blockchain
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractABI,
            provider
          );

          const watch = await contract.getWatch(watchId);
          const blockchainWatchData = {
            watchId: watch.watchId,
            componentIds: watch.componentIds,
            image: watch.image,
            location: watch.location,
            timestamp: watch.timestamp,
            assembler: watch.assembler,
            shippingStatus: parseInt(watch.shippingStatus),
            shippingTrail: watch.shippingTrail,
            availableForSale: watch.availableForSale === true,
            retailer: watch.retailer,
            sold: watch.sold === true,
            currentOwner: watch.currentOwner,
            ownershipHistory: watch.ownershipHistory,
            retailPrice: watch.retailPrice
              ? parseFloat(ethers.utils.formatEther(watch.retailPrice))
              : 0,
            nftMetadataURI: null,
            nftImageURI: null,
            nftGenerated: false,
          };

          console.log("Blockchain watch data:", blockchainWatchData);
          setWatchData(blockchainWatchData);
          setActiveStep(2);
        } else {
          setErrMsg("MetaMask not available. Please install MetaMask.");
        }
      } catch (blockchainError) {
        console.error("Blockchain fetch failed:", blockchainError);
        setErrMsg(`Failed to fetch watch data: ${blockchainError.message}`);
      }
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const handleConfirmPurchase = () => {
    if (!watchData || !currentAccount) {
      setErrMsg("Missing required information for purchase");
      return;
    }
    setActiveStep(3);
    setConfirmDialogOpen(true);
  };

  const handlePurchase = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    setActiveStep(4);
    setLoadingMessage("Processing NFT ownership transfer...");

    console.log("Starting NFT purchase process at:", new Date().toISOString());

    try {
      // Update database first
      setLoadingMessage("Updating NFT database ownership...");
      const dbResult = await updateDatabasePurchase();

      if (!dbResult.success) {
        setLoading(false);
        setLoadingMessage("");
        setActiveStep(3);
        return;
      }

      // Update blockchain state
      setLoadingMessage("Updating NFT blockchain state...");
      const blockchainResult = await updateBlockchainState();

      if (dbResult.success) {
        const purchaseTimestamp =
          dbResult.consumerTimestamp || generateConsumerTimestamp();

        setWatchData((prev) => ({
          ...prev,
          sold: true,
          currentOwner: currentAccount,
          availableForSale: false,
          consumerTimestamp: purchaseTimestamp,
          ownershipHistory: [...(prev.ownershipHistory || []), currentAccount],
        }));

        const currentTime = new Date();
        setPurchaseDetails({
          watchId: watchData.watchId,
          displayPrice: watchData.retailPrice,
          newOwner: currentAccount,
          purchaseDate: currentTime.toLocaleString(),
          consumerTimestamp: purchaseTimestamp,
          consumerTimestampFormatted: formatDisplayTimestamp(
            purchaseTimestamp,
            "full"
          ),
          transactionHash: blockchainResult?.transactionHash || "DB_ONLY",
          componentCount: watchData.componentIds?.length || 0,
          transactionId: consumerUtils.generateTransactionId(),
          timestamp: currentTime.toISOString(),
          nftGenerated: watchData.nftGenerated,
          nftMetadataURI: watchData.nftMetadataURI,
        });

        setActiveStep(5);
        setShowSuccessDialog(true);

        console.log(
          "NFT Purchase completed successfully at:",
          purchaseTimestamp
        );
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setErrMsg("Failed to complete NFT ownership transfer. Please try again.");
      setActiveStep(3);
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const updateDatabasePurchase = async () => {
    try {
      const consumerTimestamp = generateConsumerTimestamp();

      console.log("Sending NFT purchase request:", {
        watchId: watchData.watchId,
        buyerAddress: currentAccount,
        consumerTimestamp: consumerTimestamp,
      });

      const purchaseData = {
        watchId: watchData.watchId,
        buyerAddress: currentAccount,
        consumerTimestamp: consumerTimestamp,
      };
      const response = await api.post("/purchase-watch", purchaseData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      console.log("NFT Purchase response:", response.data);

      if (response.data.success !== false) {
        console.log("Database NFT purchase successful");
        return {
          success: true,
          data: response.data,
          consumerTimestamp: consumerTimestamp,
        };
      } else {
        setErrMsg(response.data.message || "Purchase failed");
        return { success: false };
      }
    } catch (error) {
      console.error("Database purchase error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          `HTTP ${error.response.status}`;
        setErrMsg(`Purchase failed: ${errorMessage}`);
      } else if (error.request) {
        setErrMsg("No response from server. Please check your connection.");
      } else {
        setErrMsg(`Request error: ${error.message}`);
      }

      return { success: false };
    }
  };

  const updateBlockchainState = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        return { success: true, transactionHash: null };
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      setLoadingMessage("Please approve the NFT transaction in your wallet...");
      const updateTxn = await contract.purchaseWatch(watchData.watchId);

      setLoadingMessage(`Mining NFT transaction: ${updateTxn.hash}...`);
      await updateTxn.wait();

      setLoadingMessage("");
      return { success: true, transactionHash: updateTxn.hash };
    } catch (error) {
      console.error("Blockchain update error:", error);
      setLoadingMessage("");
      return { success: true, transactionHash: null };
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setPurchaseDetails(null);
    navigate("/watch-collection");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getCurrentDisplayTime = () => {
    const now = new Date();
    return dayjs(now).format("MMMM D, YYYY h:mm:ss A");
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

  // Purchase eligibility logic
  const canPurchase =
    watchData &&
    watchData.retailPrice > 0 &&
    watchData.availableForSale === true &&
    watchData.sold === false &&
    currentAccount &&
    watchData.currentOwner?.toLowerCase() !== currentAccount.toLowerCase();

  const isOwner =
    watchData &&
    currentAccount &&
    watchData.currentOwner?.toLowerCase() === currentAccount.toLowerCase();

  const steps = consumerConstants.PURCHASE_STEPS;

  // Debug logging
  console.log("Purchase state validation:", {
    watchId: watchData?.watchId,
    retailPrice: watchData?.retailPrice,
    availableForSale: watchData?.availableForSale,
    sold: watchData?.sold,
    currentAccount,
    currentOwner: watchData?.currentOwner,
    canPurchase,
    isOwner,
    nftGenerated: watchData?.nftGenerated,
  });

  if (loading && !loadingMessage) {
    return (
      <DashboardLayout>
        <MainContainer maxWidth="lg">
          <Fade in timeout={600}>
            <OptimizedCard>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress
                  size={60}
                  sx={{ color: consumerColors.primary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    fontFamily: consumerTypography.accent,
                  }}
                >
                  Loading luxury NFT watch information...
                </Typography>
              </CardContent>
            </OptimizedCard>
          </Fade>
        </MainContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MainContainer maxWidth="xl">
        <Fade in timeout={600}>
          <OptimizedCard>
            <CardContent sx={{ p: 4 }}>
              <SimpleHeaderSection>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <EmojiEvents
                    sx={{ fontSize: 40, color: consumerColors.primary, mr: 2 }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: consumerTypography.luxury,
                      fontWeight: 700,
                      background: `linear-gradient(45deg, #ffffff 30%, ${consumerColors.primary} 70%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {isOwner
                      ? "Your NFT Luxury Watch"
                      : "Acquire NFT Luxury Watch"}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: consumerTypography.secondary,
                    fontWeight: 300,
                  }}
                >
                  {isOwner
                    ? "Your authenticated NFT luxury timepiece portfolio"
                    : "Browse and acquire authenticated NFT luxury timepieces"}
                </Typography>
              </SimpleHeaderSection>

              {/* Progress Stepper */}
              <OptimizedStepperSection>
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
                                  ? consumerColors.primary
                                  : consumerColors.alpha.primary20,
                              color: "#ffffff",
                              fontWeight: "bold",
                              border: `2px solid ${
                                completed || active
                                  ? consumerColors.accent
                                  : consumerColors.alpha.primary30
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
              </OptimizedStepperSection>

              {/* Error Messages */}
              {errMsg && (
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
              )}

              {/* Success Messages */}
              {successMsg && (
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
              )}

              {/* MetaMask Connection */}
              {!currentAccount && (
                <SimpleInfoCard sx={{ textAlign: "center" }}>
                  <AccountBalanceWallet
                    sx={{ fontSize: 50, color: consumerColors.primary, mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                    Connect Your Digital Wallet
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    Please connect your MetaMask wallet to proceed with the NFT
                    luxury watch acquisition.
                  </Typography>
                  <OptimizedButton
                    variant="contained"
                    luxury="true"
                    size="large"
                    startIcon={<AccountBalanceWallet />}
                    onClick={connectWallet}
                    disabled={loading}
                    sx={{ minWidth: 200 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Connecting...
                      </>
                    ) : (
                      "Connect Wallet"
                    )}
                  </OptimizedButton>
                </SimpleInfoCard>
              )}

              {/* Watch Information Card */}
              {watchData && (
                <OptimizedCard sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Diamond
                        sx={{
                          fontSize: 28,
                          color: consumerColors.primary,
                          mr: 2,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          color: consumerColors.primary,
                          fontFamily: consumerTypography.accent,
                          fontWeight: 600,
                        }}
                      >
                        NFT Luxury Watch Details
                      </Typography>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid item xs={12} md={5}>
                        <Box sx={{ textAlign: "center" }}>
                          {/* FIXED: Use the improved image display component */}
                          <WatchImageDisplay
                            imageName={watchData.image}
                            watchId={watchData.watchId}
                            alt="NFT Luxury Watch"
                            nftData={{
                              nftGenerated: watchData.nftGenerated,
                              nftMetadataURI: watchData.nftMetadataURI,
                              nftImageURI: watchData.nftImageURI,
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <Typography
                          variant="h4"
                          sx={{
                            mb: 3,
                            fontWeight: "bold",
                            color: "#ffffff",
                            fontFamily: consumerTypography.primary,
                          }}
                        >
                          {watchData.watchId}
                        </Typography>

                        {/* Price Display */}
                        {watchData.retailPrice > 0 && (
                          <SimplePriceCard sx={{ mb: 3 }}>
                            <CardContent sx={{ py: 2, textAlign: "center" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  variant="h3"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#000000",
                                    fontFamily: consumerTypography.mono,
                                  }}
                                >
                                  {consumerUtils.formatPrice(
                                    watchData.retailPrice
                                  )}
                                </Typography>
                              </Box>
                            </CardContent>
                          </SimplePriceCard>
                        )}

                        {/* Status Chips */}
                        <StatusChipContainer>
                          <OptimizedStatusChip
                            icon={<VerifiedUser />}
                            label="Supply Chain Verified"
                            status="available"
                          />
                          <OptimizedStatusChip
                            icon={<Security />}
                            label="Blockchain Authenticated"
                            status="available"
                          />
                          {watchData.nftGenerated && (
                            <OptimizedStatusChip
                              icon={<Token />}
                              label="NFT Certified"
                              status="nft"
                            />
                          )}
                          {canPurchase && (
                            <OptimizedStatusChip
                              icon={<ShoppingCart />}
                              label="Ready for Purchase"
                              status="available"
                            />
                          )}
                          {watchData.sold === true && (
                            <OptimizedStatusChip
                              icon={<CheckCircle />}
                              label="Sold"
                              status="sold"
                            />
                          )}
                          {isOwner && (
                            <OptimizedStatusChip
                              icon={<EmojiEvents />}
                              label="You Own This NFT"
                              status="owner"
                            />
                          )}
                        </StatusChipContainer>

                        {/* Watch Details Grid */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <EfficientTextField
                              fullWidth
                              margin="normal"
                              label="Assembler"
                              variant="outlined"
                              value={consumerUtils.formatAddress(
                                watchData.assembler
                              )}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <Person
                                    sx={{
                                      mr: 1,
                                      color: consumerColors.primary,
                                    }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <EfficientTextField
                              fullWidth
                              margin="normal"
                              label="Assembly Date"
                              variant="outlined"
                              value={formatDisplayTimestamp(
                                watchData.assemblerTimestamp ||
                                  watchData.timestamp,
                                "full"
                              )}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <Schedule
                                    sx={{
                                      mr: 1,
                                      color: consumerColors.primary,
                                    }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <EfficientTextField
                              fullWidth
                              margin="normal"
                              label="Certified Components"
                              variant="outlined"
                              value={`${
                                watchData.componentIds?.length || 0
                              } components`}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <Verified
                                    sx={{
                                      mr: 1,
                                      color: consumerColors.primary,
                                    }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <EfficientTextField
                              fullWidth
                              margin="normal"
                              label="Current Owner"
                              variant="outlined"
                              value={consumerUtils.formatAddress(
                                watchData.currentOwner
                              )}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <AccountBalanceWallet
                                    sx={{
                                      mr: 1,
                                      color: consumerColors.primary,
                                    }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          {/* Show consumer timestamp if watch is sold */}
                          {watchData.sold && watchData.consumerTimestamp && (
                            <Grid item xs={12}>
                              <EfficientTextField
                                fullWidth
                                margin="normal"
                                label="Consumer Purchase Date"
                                variant="outlined"
                                value={formatDisplayTimestamp(
                                  watchData.consumerTimestamp,
                                  "full"
                                )}
                                disabled
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                  startAdornment: (
                                    <Schedule
                                      sx={{
                                        mr: 1,
                                        color: consumerColors.accent,
                                      }}
                                    />
                                  ),
                                }}
                                helperText={`ISO Timestamp: ${watchData.consumerTimestamp}`}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </OptimizedCard>
              )}
              {/* Consumer Account Info */}
              {currentAccount && (
                <OptimizedCard sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: consumerColors.primary,
                        fontFamily: consumerTypography.accent,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Person sx={{ mr: 1 }} />
                      Consumer Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <EfficientTextField
                          fullWidth
                          margin="normal"
                          label="Your Wallet Address"
                          variant="outlined"
                          value={currentAccount || "Not connected"}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <AccountBalanceWallet
                                sx={{ mr: 1, color: consumerColors.primary }}
                              />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <EfficientTextField
                          fullWidth
                          margin="normal"
                          label="Current Session Time"
                          variant="outlined"
                          value={getCurrentDisplayTime()}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <Schedule
                                sx={{ mr: 1, color: consumerColors.primary }}
                              />
                            ),
                          }}
                          helperText="NFT Purchase timestamp will be recorded at transaction time"
                        />
                      </Grid>
                      {/* Show existing consumer timestamp if watch is owned */}
                      {isOwner && watchData.consumerTimestamp && (
                        <Grid item xs={12}>
                          <EfficientTextField
                            fullWidth
                            margin="normal"
                            label="Your NFT Purchase Date"
                            variant="outlined"
                            value={formatDisplayTimestamp(
                              watchData.consumerTimestamp,
                              "full"
                            )}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <CheckCircle
                                  sx={{ mr: 1, color: consumerColors.accent }}
                                />
                              ),
                            }}
                            helperText={`Raw timestamp: ${watchData.consumerTimestamp}`}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </OptimizedCard>
              )}
              {/* Purchase Actions */}
              {watchData && currentAccount && (
                <OptimizedCard
                  sx={{
                    mb: 3,
                    background: canPurchase
                      ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 111, 0, 0.1) 100%)"
                      : isOwner
                      ? "linear-gradient(135deg, rgba(255, 171, 0, 0.1) 0%, rgba(255, 111, 0, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(117, 117, 117, 0.1) 0%, rgba(66, 66, 66, 0.1) 100%)",
                    border: canPurchase
                      ? `2px solid ${consumerColors.primary}`
                      : isOwner
                      ? `2px solid ${consumerColors.accent}`
                      : "1px solid rgba(117, 117, 117, 0.3)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        color: canPurchase
                          ? consumerColors.primary
                          : isOwner
                          ? consumerColors.accent
                          : "#757575",
                        fontFamily: consumerTypography.accent,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {canPurchase && (
                        <>
                          <ShoppingCart sx={{ mr: 2, fontSize: 28 }} />
                          NFT Luxury Acquisition Available
                        </>
                      )}
                      {isOwner && (
                        <>
                          <EmojiEvents sx={{ mr: 2, fontSize: 28 }} />
                          NFT Ownership Confirmed
                        </>
                      )}
                      {!canPurchase && !isOwner && (
                        <>
                          <Security sx={{ mr: 2, fontSize: 28 }} />
                          NFT Purchase Status
                        </>
                      )}
                    </Typography>

                    {canPurchase && (
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ mb: 3, color: "#ffffff" }}
                        >
                          This exquisite NFT luxury watch is available for
                          acquisition at{" "}
                          <strong style={{ color: consumerColors.accent }}>
                            {consumerUtils.formatPrice(watchData.retailPrice)}
                          </strong>
                          . Complete NFT ownership transfer through our secure
                          blockchain system.
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <OptimizedButton
                            variant="contained"
                            luxury="true"
                            size="large"
                            startIcon={<Gavel />}
                            onClick={handleConfirmPurchase}
                            disabled={loading}
                            sx={{ minWidth: 200 }}
                          >
                            Acquire NFT Ownership
                          </OptimizedButton>
                          <OptimizedButton
                            variant="outlined"
                            onClick={() =>
                              navigate("/view-watch", {
                                state: { qrData: navigationQrData },
                              })
                            }
                          >
                            <Security sx={{ mr: 1 }} />
                            View NFT Traceability
                          </OptimizedButton>
                        </Box>
                      </Box>
                    )}

                    {isOwner && (
                      <Box>
                        <Alert
                          severity="success"
                          sx={{
                            mb: 3,
                            backgroundColor: "rgba(255, 171, 0, 0.1)",
                            border: `1px solid ${consumerColors.accent}`,
                            color: "#ffffff",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Congratulations!</strong> You are the
                            verified owner of this exceptional NFT luxury
                            timepiece.
                            {watchData.consumerTimestamp && (
                              <>
                                <br />
                                <strong>NFT Purchased:</strong>{" "}
                                {formatDisplayTimestamp(
                                  watchData.consumerTimestamp,
                                  "full"
                                )}
                              </>
                            )}
                          </Typography>
                        </Alert>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <OptimizedButton
                            variant="contained"
                            onClick={() => navigate("/watch-collection")}
                            sx={{ minWidth: 180 }}
                          >
                            <Favorite sx={{ mr: 1 }} />
                            View NFT Collection
                          </OptimizedButton>
                          <OptimizedButton
                            variant="outlined"
                            onClick={() =>
                              navigate("/view-watch", {
                                state: { qrData: navigationQrData },
                              })
                            }
                          >
                            <Security sx={{ mr: 1 }} />
                            View NFT Certificate
                          </OptimizedButton>
                        </Box>
                      </Box>
                    )}

                    {!canPurchase && !isOwner && (
                      <Box>
                        <Alert
                          severity="warning"
                          sx={{
                            mb: 3,
                            backgroundColor: "rgba(117, 117, 117, 0.1)",
                            border: "1px solid rgba(117, 117, 117, 0.3)",
                            color: "#ffffff",
                          }}
                        >
                          <Typography variant="body2">
                            {watchData.sold === true
                              ? "This NFT timepiece has been acquired by another collector."
                              : watchData.retailPrice <= 0
                              ? "This NFT watch does not have a retail value assigned."
                              : !watchData.availableForSale
                              ? "This NFT watch is not currently available for acquisition."
                              : "This NFT watch cannot be acquired at this time."}
                          </Typography>
                        </Alert>
                        <OptimizedButton
                          variant="outlined"
                          onClick={() =>
                            navigate("/view-watch", {
                              state: { qrData: navigationQrData },
                            })
                          }
                          sx={{ minWidth: 180 }}
                        >
                          <Security sx={{ mr: 1 }} />
                          View NFT Authentication Only
                        </OptimizedButton>
                      </Box>
                    )}
                  </CardContent>
                </OptimizedCard>
              )}

              {/* No Watch Data */}
              {!watchData && !loading && (
                <SimpleInfoCard sx={{ textAlign: "center" }}>
                  <QrCodeScanner
                    sx={{ fontSize: 50, color: consumerColors.primary, mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                    No NFT Watch Selected
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Please scan a luxury NFT watch QR code to view ownership
                    transfer options
                  </Typography>
                  <OptimizedButton
                    variant="outlined"
                    onClick={() => navigate("/scanner")}
                    sx={{ minWidth: 180 }}
                  >
                    <QrCodeScanner sx={{ mr: 1 }} />
                    Scan NFT Watch QR Code
                  </OptimizedButton>
                </SimpleInfoCard>
              )}

              {/* Loading Status */}
              {loading && loadingMessage && (
                <SimpleInfoCard sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress
                      size={28}
                      sx={{ mr: 2, color: consumerColors.primary }}
                    />
                    <Typography variant="body1" sx={{ color: "#ffffff" }}>
                      {loadingMessage}
                    </Typography>
                  </Box>
                </SimpleInfoCard>
              )}

              <Divider
                sx={{ my: 3, borderColor: consumerColors.alpha.primary30 }}
              />

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <OptimizedButton
                  onClick={handleBack}
                  disabled={loading}
                  sx={{ minWidth: 100 }}
                >
                  <ArrowBack sx={{ mr: 1 }} />
                  Back
                </OptimizedButton>

                <OptimizedButton
                  onClick={() => navigate("/consumer")}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  <EmojiEvents sx={{ mr: 1 }} />
                  Dashboard
                </OptimizedButton>
              </Box>

              {/* Confirmation Dialog */}
              <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    textAlign: "center",
                    background: consumerColors.gradients.gold,
                    color: "#000000",
                    py: 3,
                  }}
                >
                  <Gavel sx={{ fontSize: 40, mb: 1 }} />
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontFamily: consumerTypography.luxury }}
                  >
                    Confirm NFT Ownership Transfer
                  </Typography>
                </DialogTitle>
                <DialogContent
                  sx={{
                    mt: 2,
                    background:
                      "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
                    color: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      textAlign: "center",
                      color: consumerColors.primary,
                    }}
                  >
                    Are you ready to acquire ownership of this NFT luxury
                    timepiece?
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#ffffff" }}
                      >
                        <strong>Watch ID:</strong> {watchData?.watchId}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#ffffff" }}
                      >
                        <strong>Display Value:</strong>{" "}
                        {consumerUtils.formatPrice(watchData?.retailPrice || 0)}
                      </Typography>
                      {watchData?.nftGenerated && (
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>NFT Status:</strong> Verified & Authenticated
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#ffffff" }}
                      >
                        <strong>Components:</strong>{" "}
                        {watchData?.componentIds?.length || 0} certified
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#ffffff" }}
                      >
                        <strong>Your Address:</strong>{" "}
                        {consumerUtils.formatAddress(currentAccount)}
                      </Typography>
                      {watchData?.nftMetadataURI && (
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, color: "#ffffff" }}
                        >
                          <strong>NFT Metadata:</strong> IPFS Verified
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                      backgroundColor: "rgba(255, 111, 0, 0.1)",
                      border: `1px solid ${consumerColors.primary}`,
                      color: "#ffffff",
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      This transaction will permanently transfer NFT ownership
                      to you and update the watch status in both database and
                      blockchain systems.
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Purchase will be recorded at:</strong>{" "}
                      {getCurrentDisplayTime()}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Timezone:</strong>{" "}
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </Typography>
                    {watchData?.nftGenerated && (
                      <Typography variant="caption" sx={{ display: "block" }}>
                        <strong>NFT Transfer:</strong> Digital ownership will be
                        transferred
                      </Typography>
                    )}
                  </Alert>
                </DialogContent>
                <DialogActions
                  sx={{ p: 3, background: "rgba(30, 30, 30, 0.98)" }}
                >
                  <OptimizedButton
                    onClick={() => setConfirmDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </OptimizedButton>
                  <OptimizedButton
                    onClick={handlePurchase}
                    variant="contained"
                    luxury="true"
                    disabled={loading}
                    autoFocus
                  >
                    Confirm NFT Ownership Transfer
                  </OptimizedButton>
                </DialogActions>
              </Dialog>

              {/* Success Dialog */}
              <Dialog
                open={showSuccessDialog}
                onClose={handleCloseSuccessDialog}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    textAlign: "center",
                    background: consumerColors.gradients.gold,
                    color: "#000000",
                    py: 3,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 50, mb: 2 }} />
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontFamily: consumerTypography.luxury }}
                  >
                    NFT Ownership Transfer Successful!
                  </Typography>
                </DialogTitle>
                <DialogContent
                  sx={{
                    mt: 2,
                    background: "#1a1a1a",
                    color: "#ffffff",
                  }}
                >
                  {purchaseDetails && (
                    <Box sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 3,
                          color: consumerColors.primary,
                          fontFamily: consumerTypography.accent,
                          textAlign: "center",
                        }}
                      >
                        Congratulations on Your New NFT Luxury Timepiece!
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, color: consumerColors.accent }}
                          >
                            NFT Watch Details:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Watch ID:</strong> {purchaseDetails.watchId}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Acquisition Value:</strong>{" "}
                            {consumerUtils.formatPrice(
                              purchaseDetails.displayPrice
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Components:</strong>{" "}
                            {purchaseDetails.componentCount} certified
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Transaction ID:</strong>{" "}
                            {purchaseDetails.transactionId}
                          </Typography>
                          {purchaseDetails.nftGenerated && (
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, color: "#ffffff" }}
                            >
                              <strong>NFT Status:</strong> Successfully
                              Transferred
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, color: consumerColors.accent }}
                          >
                            Ownership Details:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>New Owner:</strong>{" "}
                            {consumerUtils.formatAddress(
                              purchaseDetails.newOwner,
                              false
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Purchase Date:</strong>{" "}
                            {typeof purchaseDetails.consumerTimestampFormatted ===
                            "string"
                              ? purchaseDetails.consumerTimestampFormatted
                              : formatDisplayTimestamp(
                                  purchaseDetails.consumerTimestamp,
                                  "full"
                                )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Consumer Timestamp (ISO):</strong>{" "}
                            {purchaseDetails.consumerTimestamp}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "#ffffff" }}
                          >
                            <strong>Local Time Zone:</strong>{" "}
                            {Intl.DateTimeFormat().resolvedOptions().timeZone}
                          </Typography>
                          {purchaseDetails.nftMetadataURI && (
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, color: "#ffffff" }}
                            >
                              <strong>NFT Metadata:</strong> IPFS Updated
                            </Typography>
                          )}
                          {purchaseDetails.transactionHash &&
                            purchaseDetails.transactionHash !== "DB_ONLY" && (
                              <Typography
                                variant="body2"
                                sx={{ mb: 1, color: "#ffffff" }}
                              >
                                <strong>Blockchain Hash:</strong>{" "}
                                {purchaseDetails.transactionHash.slice(0, 20)}
                                ...
                              </Typography>
                            )}
                        </Grid>
                      </Grid>

                      <Alert
                        severity="success"
                        sx={{
                          mt: 3,
                          backgroundColor: "rgba(255, 171, 0, 0.1)",
                          border: `2px solid ${consumerColors.accent}`,
                          color: "#ffffff",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>NFT Ownership Confirmed!</strong> You are now
                          the authenticated owner of this luxury NFT watch.
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 1 }}
                        >
                          Consumer timestamp recorded:{" "}
                          {purchaseDetails.consumerTimestamp}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block" }}>
                          Display format:{" "}
                          {purchaseDetails.consumerTimestampFormatted ||
                            formatDisplayTimestamp(
                              purchaseDetails.consumerTimestamp,
                              "full"
                            )}
                        </Typography>
                        {purchaseDetails.nftGenerated && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block" }}
                          >
                            NFT digital ownership has been successfully
                            transferred to your wallet.
                          </Typography>
                        )}
                      </Alert>
                    </Box>
                  )}
                </DialogContent>
                <DialogActions
                  sx={{ p: 3, background: "rgba(30, 30, 30, 0.98)" }}
                >
                  <OptimizedButton
                    onClick={handleCloseSuccessDialog}
                    variant="contained"
                    luxury="true"
                    size="large"
                  >
                    <Favorite sx={{ mr: 1 }} />
                    View in NFT Collection
                  </OptimizedButton>
                </DialogActions>
              </Dialog>
            </CardContent>
          </OptimizedCard>
        </Fade>
      </MainContainer>
    </DashboardLayout>
  );
};

export default PurchaseWatch;
