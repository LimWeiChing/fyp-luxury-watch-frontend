import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  LinearProgress,
  Fade,
  Stack,
  Tooltip,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Watch as WatchIcon,
  Visibility as ViewIcon,
  TransferWithinAStation as TransferIcon,
  Verified as VerifiedIcon,
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  QrCodeScanner as QrIcon,
  TrendingUp,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  AccountBalanceWallet as WalletIcon,
  Diamond as DiamondIcon,
  Star as StarIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  AutoAwesome as SparkleIcon,
  LocalOffer as TagIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Psychology as AiIcon,
  MonetizationOn as PriceIcon,
  ShowChart as ChartIcon,
  Assessment as AssessmentIcon,
  EmojiEvents,
  Token,
  Storage,
  Image,
  OpenInNew,
  Link as LinkIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import dayjs from "dayjs";
import DashboardLayout from "./DashboardLayout";
import { ethers } from "ethers";
import abi from "../../utils/LuxuryWatchNFT.json";
import AnalyzeModel from "./AnalyzeModel";
import ViewNFT from "./ViewNFT";
import PriceChart from "./PriceChart";
import {
  consumerColors,
  consumerTypography,
  consumerConstants,
  consumerUtils,
} from "./ConsumerTheme";

// PERFORMANCE OPTIMIZED: Minimal styled components with simple styles
const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  position: "relative",
  zIndex: 1,
}));

const SimpleCard = styled(Card)(({ theme }) => ({
  background: consumerColors.gradients.card,
  border: `1px solid ${consumerColors.alpha.primary20}`,
  borderRadius: "12px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  position: "relative",
  overflow: "hidden",
}));

const SimpleHeroCard = styled(Paper)(({ theme }) => ({
  background: consumerColors.alpha.white15,
  borderRadius: "12px",
  border: `1px solid ${consumerColors.alpha.white20}`,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4, 6),
  marginBottom: theme.spacing(4),
  position: "relative",
}));

const SimpleWatchCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: consumerColors.alpha.white95,
  borderRadius: "12px",
  border: `1px solid ${consumerColors.alpha.white20}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const SimpleEmptyCard = styled(Paper)(({ theme }) => ({
  background: consumerColors.alpha.white95,
  borderRadius: "12px",
  border: `1px solid ${consumerColors.alpha.white20}`,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(8),
  textAlign: "center",
  position: "relative",
}));

const SimpleStatsCard = styled(Paper)(({ theme }) => ({
  background: consumerColors.alpha.white10,
  borderRadius: "12px",
  border: `1px solid ${consumerColors.alpha.white20}`,
  padding: theme.spacing(3),
  textAlign: "center",
}));

const SimpleButton = styled(Button)(({ theme, variant, luxury }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.9rem",
  ...(luxury === "true" && {
    background: consumerColors.gradients.gold,
    color: "#ffffff",
    border: `2px solid ${consumerColors.accent}`,
  }),
  ...(variant === "contained" &&
    luxury !== "true" && {
      background: consumerColors.gradients.primary,
      color: "#ffffff",
    }),
  ...(variant === "outlined" && {
    border: `1px solid ${consumerColors.alpha.primary50}`,
    color: consumerColors.primary,
    background: consumerColors.alpha.primary05,
  }),
}));

const SimpleStatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "verified":
        return {
          background: "linear-gradient(45deg, #10b981, #059669)",
          color: "#ffffff",
        };
      case "security":
        return {
          background: consumerColors.gradients.primary,
          color: "#ffffff",
        };
      case "aiAnalyzed":
        return {
          background: "linear-gradient(45deg, #ff6f00, #ffab00)",
          color: "#ffffff",
        };
      case "owner":
        return {
          background: consumerColors.gradients.gold,
          color: "#000000",
        };
      case "sold":
        return {
          background: "linear-gradient(45deg, #757575 30%, #424242 70%)",
          color: "#ffffff",
        };
      case "nft":
        return {
          background: "linear-gradient(45deg, #9c27b0 30%, #673ab7 70%)",
          color: "#ffffff",
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
    fontSize: "0.8rem",
    fontWeight: 600,
  };
});

const SimpleTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: consumerColors.alpha.primary05,
    borderRadius: "8px",
    color: "#ffffff",
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

// Enhanced MetaMask detection function
const findMetaMaskAccount = async () => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length === 0) {
      return null;
    }

    return accounts[0];
  } catch (error) {
    console.error("Error checking MetaMask:", error);
    return null;
  }
};

const requestMetaMaskConnection = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts available");
    }

    return accounts[0];
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw error;
  }
};

// Enhanced image source determination with NFT support
const getWatchImageSource = (watchData) => {
  const sources = [];

  // Priority 1: Local image if available
  if (watchData.image && watchData.image.trim() !== "") {
    sources.push({
      type: "local",
      url: `${api.defaults.baseURL}/file/watch/${watchData.image}`,
    });
  }

  // Priority 2: NFT IPFS image
  if (watchData.nft_image_uri && watchData.nft_image_uri.trim() !== "") {
    if (watchData.nft_image_uri.startsWith("ipfs://")) {
      sources.push({
        type: "ipfs",
        url: `https://gateway.pinata.cloud/ipfs/${watchData.nft_image_uri.slice(
          7
        )}`,
        label: "IPFS Storage",
        ipfsHash: watchData.nft_image_uri.slice(7),
      });
    } else if (watchData.nft_image_uri.startsWith("http")) {
      sources.push({
        type: "http",
        url: watchData.nft_image_uri,
        label: "HTTP Storage",
      });
    }
  }

  return sources;
};

const WatchCollection = () => {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collectionStats, setCollectionStats] = useState(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");
  const [transferProgress, setTransferProgress] = useState(0);

  // Enhanced wallet state management
  const [walletAddress, setWalletAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletLoading, setWalletLoading] = useState(true);
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  // Price chart dialog state
  const [priceChartDialogOpen, setPriceChartDialogOpen] = useState(false);
  const [selectedWatchForChart, setSelectedWatchForChart] = useState(null);
  const [priceChartData, setPriceChartData] = useState([]);

  // Ownership history dialog state
  const [ownershipHistoryDialogOpen, setOwnershipHistoryDialogOpen] =
    useState(false);
  const [selectedWatchForHistory, setSelectedWatchForHistory] = useState(null);
  const [ownershipTimelineData, setOwnershipTimelineData] = useState([]);

  // NFT-specific state - SIMPLIFIED
  const [nftDialogOpen, setNftDialogOpen] = useState(false);
  const [selectedWatchForNft, setSelectedWatchForNft] = useState(null);

  const navigate = useNavigate();

  const CONTRACT_ADDRESS = consumerConstants.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  // ========================================
  // UTILITY FUNCTIONS FOR ADDRESS HANDLING
  // ========================================

  const normalizeAddress = (address) => {
    return consumerUtils.normalizeAddress(address);
  };

  const validateEthereumAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  };

  const formatAddress = (address) => {
    return consumerUtils.formatAddress(address);
  };

  // ========================================
  // PRICE CHART FUNCTIONS (SIMPLIFIED)
  // ========================================

  const preparePriceChartData = (watch) => {
    if (!watch.monthlyPrices || watch.monthlyPrices.length !== 12) {
      return [];
    }

    const monthLabels = consumerUtils.generateMonthRange();

    return watch.monthlyPrices.map((price, index) => ({
      month: monthLabels[index],
      price: parseFloat(price) || 0,
      monthIndex: index,
    }));
  };

  const handleViewPriceChart = async (watch) => {
    if (!watch.monthlyPrices) {
      try {
        const analysisResponse = await api.get(
          `/watch-analysis/${watch.watch_id}`
        );

        if (response.data && response.data.success) {
          const analysisData = response.data.data;
          watch.monthlyPrices = analysisData.monthlyPrices;
          watch.trendAnalysis = analysisData.trendAnalysis;
          watch.recommendations = analysisData.recommendations;
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    }

    setSelectedWatchForChart(watch);
    setPriceChartData(preparePriceChartData(watch));
    setPriceChartDialogOpen(true);
  };

  // ========================================
  // SIMPLIFIED NFT FUNCTIONS
  // ========================================

  const handleViewNft = (watch) => {
    setSelectedWatchForNft(watch);
    setNftDialogOpen(true);
  };

  const handleCloseNft = () => {
    setNftDialogOpen(false);
    setSelectedWatchForNft(null);
  };

  const handleNftError = (errorMessage) => {
    setError(errorMessage);
  };

  // ========================================
  // OWNERSHIP HISTORY FUNCTIONS
  // ========================================

  const fetchOwnershipHistory = async (watchId) => {
    try {
      const response = await api.get(`/watch/${watchId}/ownership-history`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Error fetching ownership history:", error);
      return null;
    }
  };

  const handleViewOwnershipHistory = async (watch) => {
    const historyData = await fetchOwnershipHistory(watch.watch_id);
    if (historyData) {
      setSelectedWatchForHistory(watch);
      setOwnershipTimelineData(historyData.timeline);
      setOwnershipHistoryDialogOpen(true);
    }
  };

  // ========================================
  // AI ANALYSIS CALLBACK HANDLER
  // ========================================

  const handleAnalysisComplete = (watchId, analysisData) => {
    setWatches((prevWatches) =>
      prevWatches.map((watch) =>
        watch.watch_id === watchId
          ? {
              ...watch,
              ...analysisData,
            }
          : watch
      )
    );

    const wasAlreadyAnalyzed = watches.find(
      (w) => w.watch_id === watchId
    )?.ai_analyzed;
    if (collectionStats && !wasAlreadyAnalyzed) {
      setCollectionStats((prev) => ({
        ...prev,
        aiAnalyzedWatches: prev.aiAnalyzedWatches + 1,
      }));
    }
  };

  // Enhanced wallet detection with retry mechanism
  useEffect(() => {
    const initializeWallet = async () => {
      setWalletLoading(true);
      setError("");

      try {
        const account = await findMetaMaskAccount();

        if (account) {
          const normalizedAccount = normalizeAddress(account);
          setWalletAddress(normalizedAccount);
          setWalletConnected(true);
          setConnectionAttempted(true);
        } else {
          setWalletConnected(false);
          setConnectionAttempted(true);
          setError(
            "Please connect your MetaMask wallet to view your watch collection."
          );
        }
      } catch (error) {
        console.error("Wallet initialization error:", error);
        setError(
          "Error detecting MetaMask wallet. Please ensure MetaMask is installed."
        );
        setWalletConnected(false);
        setConnectionAttempted(true);
      } finally {
        setWalletLoading(false);
      }
    };

    initializeWallet();

    // Enhanced event listeners for account changes
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          const newAccount = normalizeAddress(accounts[0]);
          setWalletAddress(newAccount);
          setWalletConnected(true);
          setError("");

          setTimeout(() => {
            fetchOwnedWatches(newAccount);
            fetchCollectionStats(newAccount);
          }, 100);
        } else {
          setWalletAddress("");
          setWalletConnected(false);
          setWatches([]);
          setError(
            "Wallet disconnected. Please reconnect to view your collection."
          );
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  }, []);

  // Enhanced data fetching when wallet connects
  useEffect(() => {
    if (walletConnected && walletAddress && connectionAttempted) {
      setError("");
      fetchOwnedWatches(walletAddress);
      fetchCollectionStats(walletAddress);
    }
  }, [walletConnected, walletAddress, connectionAttempted]);

  // Enhanced fetch owned watches function
  const fetchOwnedWatches = async (address = walletAddress) => {
    if (!address) {
      setLoading(false);
      return;
    }

    const normalizedAddress = normalizeAddress(address);

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/watches/owner/${normalizedAddress}`, {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.success !== false) {
        const watchList = response.data.watches || response.data || [];

        // PERFORMANCE OPTIMIZED: Simplified data fetching
        const watchesWithPriceData = await Promise.all(
          watchList.slice(0, 20).map(async (watch) => {
            // Limit to 20 watches for performance
            if (watch.ai_analyzed) {
              try {
                const response = await api.get(
                  `/watch-analysis/${watch.watch_id}`
                );

                if (analysisResponse.data && analysisResponse.data.success) {
                  const analysisData = analysisResponse.data.data;
                  return {
                    ...watch,
                    monthlyPrices: analysisData.monthlyPrices,
                    trendAnalysis: analysisData.trendAnalysis,
                    recommendations: analysisData.recommendations,
                  };
                }
              } catch (error) {
                // Silently fail for better performance
              }
            }
            return watch;
          })
        );

        setWatches(watchesWithPriceData);
        setError("");
      } else {
        setError(
          response.data.message || "Failed to fetch your watch collection"
        );
        setWatches([]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setWatches([]);
        setError("");
      } else if (err.code === "ECONNABORTED") {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to load your watch collection";
        setError(errorMsg);
      }
      setWatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced collection statistics fetch
  const fetchCollectionStats = async (address = walletAddress) => {
    if (!address) return;

    const normalizedAddress = normalizeAddress(address);

    try {
      const response = await api.get(
        `/collection/summary/${normalizedAddress}`,
        { timeout: 10000 }
      );

      if (response.data && response.data.success !== false) {
        setCollectionStats(response.data.summary);
      }
    } catch (err) {
      console.error("Error fetching collection stats:", err);
    }
  };

  // Enhanced manual wallet connection
  const connectWallet = async () => {
    try {
      setWalletLoading(true);
      setError("");

      const account = await requestMetaMaskConnection();

      if (account) {
        const normalizedAccount = normalizeAddress(account);
        setWalletAddress(normalizedAccount);
        setWalletConnected(true);
        setConnectionAttempted(true);

        setTimeout(() => {
          fetchOwnedWatches(normalizedAccount);
          fetchCollectionStats(normalizedAccount);
        }, 100);
      }
    } catch (error) {
      console.error("Manual connection failed:", error);

      if (error.code === 4001) {
        setError(
          "Connection rejected. Please approve the MetaMask connection request."
        );
      } else if (error.message.includes("not installed")) {
        setError(
          "MetaMask is not installed. Please install MetaMask to connect your wallet."
        );
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setWalletLoading(false);
    }
  };

  // Enhanced refresh function
  const refreshData = async () => {
    if (!walletAddress || !walletConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    setError("");
    await Promise.all([
      fetchOwnedWatches(walletAddress),
      fetchCollectionStats(walletAddress),
    ]);
  };

  // Enhanced view watch function
  const handleViewWatch = (watch) => {
    const qrCodeData = `${CONTRACT_ADDRESS},${watch.watch_id}`;
    const watchData = {
      watchId: watch.watch_id,
      componentIds: watch.component_ids || [],
      assemblerAddress: watch.assembler_address,
      timestamp: watch.timestamp,
      shippingStatus: parseInt(watch.shipping_status || 0),
      currentLocation: watch.location,
      lastUpdated: watch.updated_at || watch.timestamp,
      updatedAt: watch.updated_at,
      createdAt: watch.created_at,
      availableForSale: Boolean(watch.available_for_sale),
      sold: Boolean(watch.sold),
      currentOwner: watch.current_owner,
      image: watch.image,
      description: watch.description,
      retailPrice: parseFloat(watch.retail_price || 0),
      retailerAddress: watch.retailer_address,
      shippingTrail: watch.shipping_trail || [],
      ownershipHistory: watch.ownership_history || [],
      aiAnalyzed: Boolean(watch.ai_analyzed),
      aiWatchModel: watch.ai_watch_model,
      aiMarketPrice: parseFloat(watch.ai_market_price || 0),
      aiConfidenceScore: parseFloat(watch.ai_confidence_score || 0),
      aiAnalysisDate: watch.ai_analysis_date,
      monthlyPrices: watch.monthlyPrices || [],
      trendAnalysis: watch.trendAnalysis,
      recommendations: watch.recommendations,
      // NFT fields
      nft_generated: Boolean(watch.nft_generated),
      nft_metadata_uri: watch.nft_metadata_uri,
      nft_image_uri: watch.nft_image_uri,
    };

    navigate("/view-watch", {
      state: {
        qrData: qrCodeData,
        watchData: watchData,
        scanType: "watch",
      },
    });
  };

  // ========================================
  // FIXED TRANSFER FUNCTIONS
  // ========================================

  // Transfer ownership function
  const handleTransferOwnership = (watch) => {
    setSelectedWatch(watch);
    setTransferDialogOpen(true);
    setTransferToAddress("");
    setTransferError("");
    setTransferSuccess("");
    setTransferProgress(0);
  };

  // FIXED: Properly handle blockchain transfer without masking errors
  const transferOwnershipOnBlockchain = async (watchId, newOwnerAddress) => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error(
          "MetaMask not available. Please install MetaMask to complete NFT transfer."
        );
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      const normalizedAddress = ethers.utils.getAddress(newOwnerAddress);

      setTransferProgress(25);

      // FIXED: Use explicit function signature to avoid overload confusion
      const transferTxn = await contract["transferOwnership(string,address)"](
        watchId,
        normalizedAddress,
        { gasLimit: 300000 }
      );

      setTransferProgress(50);
      const receipt = await transferTxn.wait();
      setTransferProgress(75);

      return { success: true, transactionHash: transferTxn.hash };
    } catch (error) {
      console.error("Blockchain transfer error:", error);
      throw new Error(`Blockchain transfer failed: ${error.message}`);
    }
  };

  // Database transfer function
  const saveTransferToDatabase = async (watchId, newOwnerAddress) => {
    try {
      console.log("💾 Updating database...");

      const transferData = {
        watchId: watchId,
        newOwnerAddress: normalizeAddress(newOwnerAddress),
        currentOwnerAddress: normalizeAddress(walletAddress),
      };

      const response = await api.post("/transfer-ownership", transferData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      if (response.data.success !== false) {
        console.log("✅ Database updated successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Database transfer failed");
      }
    } catch (error) {
      console.error("❌ Database transfer error:", error);
      throw error;
    }
  };

  // FIXED: Main transfer function with proper order (blockchain first, then database)
  const handleConfirmTransfer = async () => {
    const normalizedToAddress = normalizeAddress(transferToAddress);
    const normalizedCurrentAddress = normalizeAddress(walletAddress);

    // Validation
    if (!normalizedToAddress) {
      setTransferError("Please enter a wallet address");
      return;
    }

    if (!validateEthereumAddress(normalizedToAddress)) {
      setTransferError("Please enter a valid Ethereum address");
      return;
    }

    if (normalizedToAddress === normalizedCurrentAddress) {
      setTransferError("Cannot transfer to the same address");
      return;
    }

    setTransferLoading(true);
    setTransferError("");
    setTransferSuccess("");
    setTransferProgress(0);

    try {
      // CRITICAL FIX: Do blockchain transfer FIRST
      console.log("🚀 Starting transfer process...");

      const blockchainResult = await transferOwnershipOnBlockchain(
        selectedWatch.watch_id,
        normalizedToAddress
      );

      if (!blockchainResult.success) {
        throw new Error("Blockchain transfer failed");
      }

      console.log("✅ NFT transfer successful, now updating database...");
      setTransferProgress(85);

      // Only update database after blockchain succeeds
      await saveTransferToDatabase(selectedWatch.watch_id, normalizedToAddress);
      setTransferProgress(100);

      // Success message
      setTransferSuccess(
        `✅ Watch and NFT successfully transferred to ${formatAddress(
          normalizedToAddress
        )}`
      );

      // Remove from current user's collection
      setWatches((prev) =>
        prev.filter((w) => w.watch_id !== selectedWatch.watch_id)
      );

      // Update collection stats
      if (collectionStats) {
        setCollectionStats((prev) => ({
          ...prev,
          totalWatches: Math.max(0, prev.totalWatches - 1),
        }));
      }

      // Auto-close dialog after success
      setTimeout(() => {
        setTransferDialogOpen(false);
        setSelectedWatch(null);
        setTransferToAddress("");
        setTransferProgress(0);
      }, 4000);
    } catch (error) {
      console.error("❌ Transfer process failed:", error);
      setTransferProgress(0);

      // Provide specific error messages
      if (error.message.includes("rejected by user")) {
        setTransferError("❌ Transaction was rejected by user");
      } else if (error.message.includes("insufficient funds")) {
        setTransferError(
          "❌ Insufficient funds for gas fees. Please add ETH to your wallet."
        );
      } else if (error.message.includes("Smart contract error")) {
        setTransferError(`❌ ${error.message}`);
      } else if (error.message.includes("MetaMask not available")) {
        setTransferError(
          "❌ MetaMask not available. Please install MetaMask to transfer NFTs."
        );
      } else {
        setTransferError(`❌ Transfer failed: ${error.message}`);
      }
    } finally {
      setTransferLoading(false);
    }
  };

  // Utility functions
  const formatTimestamp = (timestamp) => {
    return consumerUtils.formatDateShort(timestamp);
  };

  const getShippingStatusText = (status) => {
    return consumerUtils.getShippingStatusText(status);
  };

  const getShippingStatusColor = (status) => {
    return consumerUtils.getShippingStatusColor(status);
  };

  const getWatchValue = (watch) => {
    return parseFloat(watch.retail_price || 0);
  };

  const getTotalCollectionValue = () => {
    return watches.reduce((total, watch) => total + getWatchValue(watch), 0);
  };

  const getAiAnalyzedCount = () => {
    return watches.filter((watch) => watch.ai_analyzed === true).length;
  };

  const getAverageAiMarketPrice = () => {
    const analyzedWatches = watches.filter(
      (watch) => watch.ai_analyzed === true && watch.ai_market_price > 0
    );
    if (analyzedWatches.length === 0) return 0;
    return (
      analyzedWatches.reduce(
        (total, watch) => total + parseFloat(watch.ai_market_price || 0),
        0
      ) / analyzedWatches.length
    );
  };

  const getNftCount = () => {
    return watches.filter((watch) => watch.nft_generated === true).length;
  };

  const getCurrentMonthRange = () => {
    const monthLabels = consumerUtils.generateMonthRange();
    return {
      start: monthLabels[0],
      end: monthLabels[11],
    };
  };

  const monthRange = getCurrentMonthRange();

  // PERFORMANCE OPTIMIZED: Simplified loading state
  if (walletLoading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: "100vh",
            background: consumerColors.gradients.background,
          }}
        >
          <MainContainer maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
              }}
            >
              <SimpleCard sx={{ p: 6, textAlign: "center" }}>
                <CircularProgress
                  size={50}
                  sx={{ color: consumerColors.primary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    fontFamily: consumerTypography.accent,
                  }}
                >
                  Connecting to Wallet...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Detecting your MetaMask wallet connection
                </Typography>
              </SimpleCard>
            </Box>
          </MainContainer>
        </Box>
      </DashboardLayout>
    );
  }

  // PERFORMANCE OPTIMIZED: Simplified loading state for data fetching
  if (loading && walletConnected) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: "100vh",
            background: consumerColors.gradients.background,
          }}
        >
          <MainContainer maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
              }}
            >
              <SimpleCard sx={{ p: 6, textAlign: "center" }}>
                <CircularProgress
                  size={50}
                  sx={{ color: consumerColors.primary, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    fontFamily: consumerTypography.accent,
                  }}
                >
                  Loading Collection...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Fetching your luxury timepiece portfolio
                </Typography>
              </SimpleCard>
            </Box>
          </MainContainer>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box
        sx={{
          minHeight: "100vh",
          background: consumerColors.gradients.background,
        }}
      >
        {/* Static overlay without animation */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: consumerColors.gradients.overlay,
          }}
        />

        <MainContainer maxWidth="xl">
          {/* PERFORMANCE OPTIMIZED: Simplified Hero Header */}
          <SimpleHeroCard>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              spacing={3}
              sx={{ mb: 4 }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: consumerColors.gradients.gold,
                  fontSize: "1.5rem",
                }}
              >
                <DiamondIcon sx={{ fontSize: 30 }} />
              </Avatar>

              <Box
                sx={{ textAlign: { xs: "center", md: "left" }, flexGrow: 1 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "800",
                    background: `linear-gradient(45deg, #ffffff 30%, ${consumerColors.primary} 70%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    fontFamily: consumerTypography.luxury,
                  }}
                >
                  My Luxury Collection
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: "400",
                    fontFamily: consumerTypography.secondary,
                  }}
                >
                  Premium Authenticated Timepieces with NFT Digital Certificates
                </Typography>
              </Box>

              {/* Wallet status display */}
              <Stack spacing={1} alignItems="flex-end">
                {walletConnected ? (
                  <SimpleStatusChip
                    icon={<WalletIcon />}
                    label={`Connected: ${formatAddress(walletAddress)}`}
                    status="verified"
                  />
                ) : (
                  <SimpleStatusChip
                    icon={<WarningIcon />}
                    label="Wallet Not Connected"
                    status="sold"
                  />
                )}

                <Stack direction="row" spacing={1}>
                  <SimpleButton
                    size="small"
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={refreshData}
                    disabled={!walletConnected}
                  >
                    Refresh
                  </SimpleButton>

                  {!walletConnected && (
                    <SimpleButton
                      size="small"
                      variant="contained"
                      luxury="true"
                      startIcon={<WalletIcon />}
                      onClick={connectWallet}
                      disabled={walletLoading}
                    >
                      {walletLoading ? "Connecting..." : "Connect Wallet"}
                    </SimpleButton>
                  )}
                </Stack>
              </Stack>
            </Stack>

            {/* PERFORMANCE OPTIMIZED: Enhanced Collection Stats with NFT count */}
            {walletConnected && (
              <Grid container spacing={2}>
                {[
                  {
                    icon: <InventoryIcon />,
                    value: watches.length,
                    label: "Owned Watches",
                    color: consumerColors.gradients.primary,
                  },
                  {
                    icon: <Token />,
                    value: getNftCount(),
                    label: "NFT Certificates",
                    color: "linear-gradient(45deg, #9c27b0, #673ab7)",
                  },
                  {
                    icon: <AiIcon />,
                    value: getAiAnalyzedCount(),
                    label: "AI Analyzed",
                    color: "linear-gradient(45deg, #ff6f00, #ffab00)",
                  },
                  {
                    icon: <AttachMoneyIcon />,
                    value: consumerUtils.formatPrice(getTotalCollectionValue()),
                    label: "Collection Value",
                    color: consumerColors.gradients.gold,
                  },
                ].map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <SimpleStatsCard>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mx: "auto",
                          mb: 1,
                          background: stat.color,
                        }}
                      >
                        {React.cloneElement(stat.icon, { fontSize: "small" })}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "800",
                          color: "white",
                          mb: 0.5,
                          fontFamily: consumerTypography.mono,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontWeight: "500",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontFamily: consumerTypography.accent,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </SimpleStatsCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </SimpleHeroCard>

          {/* Error State */}
          {error && (
            <Alert
              severity={
                error.includes("MetaMask") || error.includes("connect")
                  ? "warning"
                  : "error"
              }
              sx={{
                mb: 3,
                borderRadius: 2,
                background:
                  error.includes("MetaMask") || error.includes("connect")
                    ? consumerColors.alpha.primary15
                    : "rgba(244, 67, 54, 0.1)",
                border: `1px solid ${
                  error.includes("MetaMask") || error.includes("connect")
                    ? consumerColors.alpha.primary30
                    : "rgba(244, 67, 54, 0.3)"
                }`,
                color: "#ffffff",
                "& .MuiAlert-message": { fontWeight: "500" },
              }}
              action={
                !walletConnected ? (
                  <SimpleButton
                    size="small"
                    variant="outlined"
                    onClick={connectWallet}
                    disabled={walletLoading}
                  >
                    {walletLoading ? "Connecting..." : "Connect Wallet"}
                  </SimpleButton>
                ) : null
              }
            >
              {error}
            </Alert>
          )}

          {/* Empty State */}
          {watches.length === 0 && !error && walletConnected && !loading && (
            <SimpleEmptyCard>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  background: consumerColors.gradients.primary,
                }}
              >
                <WatchIcon sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "700",
                  mb: 2,
                  background: consumerColors.gradients.primary,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: consumerTypography.luxury,
                }}
              >
                Start Your Collection Journey
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  maxWidth: 500,
                  mx: "auto",
                  lineHeight: 1.5,
                  color: "rgba(0, 0, 0, 0.7)",
                }}
              >
                No watches found for wallet:{" "}
                <strong style={{ color: consumerColors.primary }}>
                  {formatAddress(walletAddress)}
                </strong>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  maxWidth: 500,
                  mx: "auto",
                  lineHeight: 1.5,
                  color: "rgba(0, 0, 0, 0.7)",
                }}
              >
                Discover and acquire authenticated luxury timepieces with
                blockchain-verified provenance, AI-powered price analysis, and
                NFT digital certificates.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                <SimpleButton
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/purchase-watch")}
                  luxury="true"
                >
                  Browse Available Watches
                </SimpleButton>

                <SimpleButton
                  variant="outlined"
                  size="large"
                  startIcon={<QrIcon />}
                  onClick={() => navigate("/scanner")}
                >
                  Scan QR Code
                </SimpleButton>
              </Stack>
            </SimpleEmptyCard>
          )}

          {/* Enhanced Watch Grid with NFT Support */}
          {watches.length > 0 && (
            <Grid container spacing={3}>
              {watches.map((watch, index) => {
                const imageSources = getWatchImageSource(watch);
                const primaryImageSource =
                  imageSources.length > 0 ? imageSources[0] : null;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={watch.watch_id}>
                    <SimpleWatchCard>
                      <Box
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          overflow: "hidden",
                          borderRadius: "12px 12px 0 0",
                        }}
                        onClick={() => handleViewWatch(watch)}
                      >
                        {primaryImageSource ? (
                          <CardMedia
                            component="img"
                            sx={{
                              height: 200,
                              objectFit: "cover",
                            }}
                            image={primaryImageSource.url}
                            alt={`Watch ${watch.watch_id}`}
                            onError={(e) => {
                              // Try next image source if available
                              if (imageSources.length > 1) {
                                e.target.src = imageSources[1].url;
                              }
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 200,
                              background: consumerColors.gradients.card,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <WatchIcon
                              sx={{
                                fontSize: 60,
                                color: consumerColors.primary,
                              }}
                            />
                          </Box>
                        )}

                        {watch.retail_price > 0 && (
                          <SimpleStatusChip
                            icon={<TagIcon />}
                            label={consumerUtils.formatPrice(
                              watch.retail_price
                            )}
                            size="small"
                            status="owner"
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              fontSize: "0.75rem",
                            }}
                          />
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "700",
                            mb: 1,
                            fontSize: "1rem",
                            lineHeight: 1.3,
                            color: "#1e293b",
                            fontFamily: consumerTypography.accent,
                          }}
                        >
                          {watch.watch_id}
                        </Typography>
                        <Stack spacing={1} sx={{ mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <BusinessIcon
                              sx={{
                                fontSize: 16,
                                mr: 1,
                                color: consumerColors.primary,
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: "500" }}
                            >
                              {formatAddress(watch.assembler_address)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TimeIcon
                              sx={{
                                fontSize: 16,
                                mr: 1,
                                color: consumerColors.primary,
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: "500" }}
                            >
                              {formatTimestamp(
                                watch.updated_at || watch.created_at
                              )}
                            </Typography>
                          </Box>
                          {watch.ai_analyzed && watch.ai_market_price > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PriceIcon
                                sx={{
                                  fontSize: 16,
                                  mr: 1,
                                  color: consumerColors.success,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: "500" }}
                              >
                                AI:{" "}
                                {consumerUtils.formatPrice(
                                  watch.ai_market_price
                                )}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationIcon
                              sx={{
                                fontSize: 16,
                                mr: 1,
                                color: consumerColors.primary,
                              }}
                            />
                            <Chip
                              label={getShippingStatusText(
                                watch.shipping_status
                              )}
                              color={getShippingStatusColor(
                                watch.shipping_status
                              )}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                height: 20,
                                fontWeight: "600",
                              }}
                            />
                          </Box>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ flexWrap: "wrap", gap: 0.5 }}
                        >
                          <Chip
                            label={`${watch.component_ids?.length || 0} Parts`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              borderColor: consumerColors.primary,
                              color: consumerColors.primary,
                              fontWeight: "600",
                            }}
                          />
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <SimpleButton
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewWatch(watch)}
                          variant="contained"
                          sx={{ mr: 1 }}
                        >
                          View
                        </SimpleButton>
                        <AnalyzeModel
                          watch={watch}
                          onAnalysisComplete={handleAnalysisComplete}
                          buttonType="icon"
                        />
                        {watch.ai_analyzed && watch.monthlyPrices && (
                          <Tooltip title="Price Chart">
                            <IconButton
                              size="small"
                              onClick={() => handleViewPriceChart(watch)}
                              sx={{
                                background: consumerColors.gradients.accent,
                                color: "#000000",
                                width: 32,
                                height: 32,
                              }}
                            >
                              <ChartIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {watch.nft_generated && (
                          <Tooltip title="View NFT">
                            <IconButton
                              size="small"
                              onClick={() => handleViewNft(watch)}
                              sx={{
                                background:
                                  "linear-gradient(45deg, #9c27b0, #673ab7)",
                                color: "#ffffff",
                                width: 32,
                                height: 32,
                              }}
                            >
                              <Token sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        <SimpleButton
                          size="small"
                          startIcon={<TransferIcon />}
                          onClick={() => handleTransferOwnership(watch)}
                          variant="outlined"
                        >
                          Transfer
                        </SimpleButton>
                      </CardActions>
                    </SimpleWatchCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </MainContainer>

        {/* Enhanced Price Chart Dialog with New Component */}
        <Dialog
          open={priceChartDialogOpen}
          onClose={() => setPriceChartDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)",
              border: `2px solid ${consumerColors.alpha.primary30}`,
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #3b82f6, #6366f1)",
              color: "#ffffff",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  mr: 2,
                  background: "linear-gradient(45deg, #f59e0b, #d97706)",
                  width: 40,
                  height: 40,
                }}
              >
                <ChartIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    color: "#ffffff",
                    fontFamily: consumerTypography.luxury,
                  }}
                >
                  Advanced Price Analysis
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  {selectedWatchForChart?.watch_id} - Comprehensive Market
                  Intelligence
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent
            sx={{
              pt: 3,
              background:
                "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)",
              color: "#ffffff",
            }}
          >
            {selectedWatchForChart && (
              <PriceChart
                data={priceChartData}
                watch={selectedWatchForChart}
                open={priceChartDialogOpen}
                onClose={() => setPriceChartDialogOpen(false)}
              />
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              background:
                "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)",
              borderTop: `1px solid ${consumerColors.alpha.primary20}`,
            }}
          >
            <SimpleButton
              onClick={() => setPriceChartDialogOpen(false)}
              variant="outlined"
              startIcon={<ChartIcon />}
            >
              Close Analysis
            </SimpleButton>
          </DialogActions>
        </Dialog>

        {/* ========================================
            ENHANCED TRANSFER DIALOG
            ======================================== */}
        <Dialog
          open={transferDialogOpen}
          onClose={() => !transferLoading && setTransferDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              background: consumerColors.alpha.white95,
              border: `1px solid ${consumerColors.alpha.white20}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: consumerColors.gradients.primary,
              color: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  mr: 2,
                  background: consumerColors.gradients.gold,
                  width: 40,
                  height: 40,
                }}
              >
                <TransferIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    color: "#ffffff",
                    fontFamily: consumerTypography.luxury,
                  }}
                >
                  Transfer Ownership & NFT
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Blockchain-powered secure transfer
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent
            sx={{
              background: consumerColors.gradients.card,
              color: "#ffffff",
            }}
          >
            {selectedWatch && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "rgba(255, 255, 255, 0.9)" }}
                >
                  Transfer ownership of{" "}
                  <strong style={{ color: consumerColors.primary }}>
                    {selectedWatch.watch_id}
                  </strong>{" "}
                  to another wallet address.
                  {selectedWatch.nft_generated && (
                    <span style={{ color: "#9c27b0" }}>
                      {" "}
                      The NFT certificate will be transferred automatically.
                    </span>
                  )}
                </Typography>

                <Paper
                  elevation={2}
                  sx={{
                    mb: 2,
                    p: 2,
                    background: consumerColors.alpha.primary10,
                    borderRadius: 2,
                    border: `1px solid ${consumerColors.alpha.primary20}`,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "600", color: "#ffffff" }}
                      >
                        Watch ID:{" "}
                        <span style={{ color: consumerColors.primary }}>
                          {selectedWatch.watch_id}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "600", color: "#ffffff" }}
                      >
                        Components:{" "}
                        <span style={{ color: consumerColors.success }}>
                          {selectedWatch.component_ids?.length || 0}
                        </span>
                      </Typography>
                    </Grid>
                    {selectedWatch.retail_price > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "600", color: "#ffffff" }}
                        >
                          Value:{" "}
                          <span style={{ color: consumerColors.accent }}>
                            {consumerUtils.formatPrice(
                              selectedWatch.retail_price
                            )}
                          </span>
                        </Typography>
                      </Grid>
                    )}
                    {selectedWatch.nft_generated && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "600", color: "#9c27b0" }}
                        >
                          NFT Status: Transferable
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>

                <SimpleTextField
                  fullWidth
                  margin="normal"
                  label="Recipient Wallet Address"
                  variant="outlined"
                  value={transferToAddress}
                  onChange={(e) => {
                    const normalizedValue = normalizeAddress(e.target.value);
                    setTransferToAddress(normalizedValue);
                  }}
                  placeholder="0x1234567890abcdef..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: consumerColors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!transferError}
                  disabled={transferLoading}
                />

                {transferLoading && (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, fontWeight: "600", color: "#ffffff" }}
                    >
                      Transfer Progress:
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={transferProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: consumerColors.alpha.primary20,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background: consumerColors.gradients.primary,
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: "block",
                        textAlign: "center",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: "500",
                      }}
                    >
                      {transferProgress < 25 &&
                        "Preparing blockchain transaction..."}
                      {transferProgress >= 25 &&
                        transferProgress < 50 &&
                        "Processing NFT transfer on blockchain..."}
                      {transferProgress >= 50 &&
                        transferProgress < 75 &&
                        "Confirming blockchain transaction..."}
                      {transferProgress >= 75 &&
                        transferProgress < 85 &&
                        "Waiting for network confirmation..."}
                      {transferProgress >= 85 &&
                        transferProgress < 100 &&
                        "Updating database records..."}
                      {transferProgress === 100 &&
                        "Transfer completed successfully!"}
                    </Typography>
                  </Box>
                )}

                {transferError && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: 1,
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                      color: "#ffffff",
                      "& .MuiAlert-icon": {
                        color: "#ef4444",
                      },
                    }}
                  >
                    {transferError}
                  </Alert>
                )}

                {transferSuccess && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 2,
                      borderRadius: 1,
                      backgroundColor: consumerColors.alpha.accent10,
                      border: `1px solid ${consumerColors.accent}`,
                      color: "#ffffff",
                      "& .MuiAlert-icon": {
                        color: consumerColors.accent,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleIcon sx={{ mr: 1, fontSize: 16 }} />
                      {transferSuccess}
                    </Box>
                  </Alert>
                )}

                {!transferLoading && !transferSuccess && (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                      borderRadius: 1,
                      backgroundColor: consumerColors.alpha.primary10,
                      border: `1px solid ${consumerColors.alpha.primary30}`,
                      color: "#ffffff",
                      "& .MuiAlert-icon": {
                        color: consumerColors.primary,
                      },
                    }}
                  >
                    <Typography variant="caption">
                      This will update both blockchain NFT ownership and
                      database records permanently.
                      {selectedWatch?.nft_generated && (
                        <>
                          {" "}
                          The NFT will be transferred to the new owner's wallet.
                        </>
                      )}
                      <br />
                      <strong>
                        Gas fees will apply for blockchain transaction.
                      </strong>
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{ p: 2, background: consumerColors.gradients.card }}
          >
            <SimpleButton
              onClick={() => setTransferDialogOpen(false)}
              disabled={transferLoading}
              variant="outlined"
            >
              Cancel
            </SimpleButton>
            <SimpleButton
              onClick={handleConfirmTransfer}
              variant="contained"
              luxury="true"
              disabled={
                transferLoading || !transferToAddress.trim() || transferSuccess
              }
              startIcon={
                transferLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <TransferIcon />
                )
              }
            >
              {transferLoading ? "Processing..." : "Transfer NFT"}
            </SimpleButton>
          </DialogActions>
        </Dialog>

        {/* SIMPLIFIED NFT COMPONENT INTEGRATION */}
        <ViewNFT
          open={nftDialogOpen}
          onClose={handleCloseNft}
          watch={selectedWatchForNft}
          onError={handleNftError}
        />
      </Box>
    </DashboardLayout>
  );
};

export default WatchCollection;
