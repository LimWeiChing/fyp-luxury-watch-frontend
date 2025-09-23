import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Chip,
  Avatar,
  keyframes,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import {
  LocationOn,
  AccessTime,
  Assignment,
  Business,
  Update,
  AccountCircle,
  AttachMoney,
  TrackChanges,
  Warning,
  ArrowBack,
  Home,
  QrCode2,
  Download,
  QrCodeScanner,
  Watch,
  Diamond,
  Star,
  Verified,
  LocalShipping,
  Timeline as TimelineIcon,
  PictureAsPdf,
} from "@mui/icons-material";
import React from "react";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useAuth from "../../hooks/useAuth";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Geocode from "react-geocode";
import ShippingMapVisualization from "../pages/ShippingMapVisualization";
import WatchComponentsSection from "../pages/WatchComponentsSection";
import Ownership from "./Ownership";

// Enable custom format parsing
dayjs.extend(customParseFormat);

// Enhanced Watch Theme
const watchColors = {
  primary: "#d4af37", // Luxury gold
  secondary: "#c9302c", // Deep red
  accent: "#1a1a1a", // Deep black
  success: "#28a745",
  warning: "#ffc107",
  info: "#17a2b8",
  error: "#dc3545",
  gradients: {
    luxury: "linear-gradient(135deg, #d4af37 0%, #f4e99b 50%, #d4af37 100%)",
    premium: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
    accent: "linear-gradient(135deg, #c9302c 0%, #dc3545 50%, #c9302c 100%)",
    shimmer: `linear-gradient(
      90deg,
      transparent 0%,
      rgba(212, 175, 55, 0.1) 25%,
      rgba(212, 175, 55, 0.3) 50%,
      rgba(212, 175, 55, 0.1) 75%,
      transparent 100%
    )`,
  },
  alpha: {
    primary05: "rgba(212, 175, 55, 0.05)",
    primary10: "rgba(212, 175, 55, 0.1)",
    primary20: "rgba(212, 175, 55, 0.2)",
    primary30: "rgba(212, 175, 55, 0.3)",
    primary40: "rgba(212, 175, 55, 0.4)",
    primary50: "rgba(212, 175, 55, 0.5)",
  },
};

const watchTypography = {
  primary: '"Playfair Display", "Times New Roman", serif',
  secondary: '"Inter", "Roboto", sans-serif',
  accent: '"Crimson Text", serif',
  mono: '"JetBrains Mono", "Consolas", monospace',
};

// Enhanced animations
const luxuryGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3),
                0 0 40px rgba(212, 175, 55, 0.2),
                inset 0 0 20px rgba(212, 175, 55, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.6),
                0 0 60px rgba(212, 175, 55, 0.4),
                inset 0 0 30px rgba(212, 175, 55, 0.2);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
`;

// Watch theme styles
const watchStyles = {
  pageHeader: {
    textAlign: "center",
    mb: 4,
    p: 3,
    background: watchColors.gradients.luxury,
    borderRadius: "20px",
    border: `2px solid ${watchColors.alpha.primary30}`,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: watchColors.gradients.shimmer,
      backgroundSize: "200px 100%",
      animation: `${shimmer} 3s infinite`,
      opacity: 0.3,
    },
  },

  luxuryCard: {
    background: `linear-gradient(135deg, 
      rgba(26, 26, 26, 0.95) 0%, 
      rgba(45, 45, 45, 0.98) 50%, 
      rgba(26, 26, 26, 0.95) 100%
    )`,
    border: `2px solid ${watchColors.alpha.primary30}`,
    borderRadius: "20px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: `0 10px 30px ${watchColors.alpha.primary30}`,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: watchColors.gradients.luxury,
    },
  },

  luxuryCardWithGlow: {
    background: `linear-gradient(135deg, 
      rgba(26, 26, 26, 0.95) 0%, 
      rgba(45, 45, 45, 0.98) 50%, 
      rgba(26, 26, 26, 0.95) 100%
    )`,
    border: `2px solid ${watchColors.alpha.primary30}`,
    borderRadius: "20px",
    position: "relative",
    overflow: "hidden",
    animation: `${luxuryGlow} 4s ease-in-out infinite`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: watchColors.gradients.luxury,
    },
  },

  infoCard: {
    mb: 2,
    p: 2,
    background: watchColors.alpha.primary05,
    border: `1px solid ${watchColors.alpha.primary20}`,
    borderRadius: "12px",
    transition: "all 0.2s ease",
    "&:hover": {
      background: watchColors.alpha.primary10,
      border: `1px solid ${watchColors.alpha.primary30}`,
    },
  },

  luxuryButton: {
    contained: {
      background: watchColors.gradients.luxury,
      color: watchColors.accent,
      fontWeight: 600,
      fontSize: "1rem",
      borderRadius: "12px",
      textTransform: "none",
      fontFamily: watchTypography.secondary,
      border: `2px solid transparent`,
      transition: "all 0.3s ease",
      "&:hover": {
        background: watchColors.gradients.luxury,
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px ${watchColors.alpha.primary30}`,
        border: `2px solid ${watchColors.primary}`,
      },
    },
    outlined: {
      color: watchColors.primary,
      borderColor: watchColors.primary,
      fontWeight: 600,
      fontSize: "1rem",
      borderRadius: "12px",
      textTransform: "none",
      fontFamily: watchTypography.secondary,
      border: `2px solid ${watchColors.primary}`,
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: watchColors.primary,
        backgroundColor: watchColors.alpha.primary10,
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px ${watchColors.alpha.primary30}`,
      },
    },
  },

  qrSection: {
    background: `linear-gradient(135deg, 
      rgba(26, 26, 26, 0.95) 0%, 
      rgba(45, 45, 45, 0.98) 50%, 
      rgba(26, 26, 26, 0.95) 100%
    )`,
    border: `2px solid ${watchColors.alpha.primary30}`,
    borderRadius: "20px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: watchColors.gradients.luxury,
    },
  },
};

// Custom MUI theme
const watchMuiTheme = createTheme({
  palette: {
    primary: {
      main: watchColors.primary,
    },
    secondary: {
      main: watchColors.secondary,
    },
    background: {
      default: "#1a1a1a",
      paper: "rgba(26, 26, 26, 0.95)",
    },
    text: {
      primary: "#ffffff",
      secondary: watchColors.primary,
    },
  },
  typography: {
    fontFamily: watchTypography.secondary,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(26, 26, 26, 0.95)",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Utility functions
const getStatusColor = (status) => {
  const statusValue = parseInt(status);
  switch (statusValue) {
    case 0:
      return "#6b7280"; // Not shipped - gray
    case 1:
      return "#ff9800"; // Shipped - orange
    case 2:
      return "#2196f3"; // In transit - blue
    case 3:
      return "#4caf50"; // Delivered - green
    default:
      return "#6b7280";
  }
};

const getStatusIcon = (status) => {
  const statusValue = parseInt(status);
  switch (statusValue) {
    case 0:
      return "📦";
    case 1:
      return "🚚";
    case 2:
      return "🚛";
    case 3:
      return "✅";
    default:
      return "📍";
  }
};

const getShippingStatusText = (status) => {
  switch (parseInt(status)) {
    case 0:
      return "Not Shipped";
    case 1:
      return "Shipped";
    case 2:
      return "In Transit";
    case 3:
      return "Delivered";
    default:
      return "Unknown";
  }
};

const ViewWatch = () => {
  const [watchData, setWatchData] = useState(null);
  const [watchComponents, setWatchComponents] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Get data from navigation state
  const navigationQrData = location.state?.qrData;

  useEffect(() => {
    setError("");

    // Initialize Geocode
    try {
      Geocode.setApiKey("AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0");
    } catch (error) {
      console.warn("Geocode initialization failed:", error);
    }

    // Always fetch fresh data from database
    if (navigationQrData) {
      setQrData(navigationQrData);
      fetchWatchData(navigationQrData);
    } else {
      setError("No watch data provided. Please scan a watch QR code first.");
    }

    // Get current location for map visualization
    getCurrentTimeLocation();
  }, [navigationQrData]);

  // Enhanced PDF generation with luxury watch theme
  // Enhanced PDF generation with complete ownership history and map visualization
  const generatePDF = async () => {
    if (!watchData) return;

    console.log("🔍 Starting enhanced PDF generation...");
    console.log("html2canvas available:", typeof html2canvas);
    console.log("jsPDF available:", typeof jsPDF);

    if (typeof html2canvas === "undefined" || typeof jsPDF === "undefined") {
      alert(
        "PDF dependencies not loaded. Please install: npm install html2canvas jspdf"
      );
      return;
    }

    setPdfGenerating(true);
    try {
      // Create a temporary container for PDF content
      const pdfContainer = document.createElement("div");
      pdfContainer.id = "pdf-content";
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "800px";
      pdfContainer.style.background = "white";
      pdfContainer.style.padding = "40px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";
      pdfContainer.style.color = "black";

      // Get QR code as data URL
      let qrDataUrl = null;
      try {
        const qrCanvas = document.getElementById("watchQR");
        if (qrCanvas) {
          qrDataUrl = qrCanvas.toDataURL("image/png");
          console.log("✅ QR Code captured successfully");
        }
      } catch (qrError) {
        console.error("❌ QR Code capture failed:", qrError);
      }

      // Get watch image URL
      let watchImageUrl = null;
      try {
        watchImageUrl = getImageUrl(watchData.image);
        if (watchImageUrl) {
          console.log("✅ Watch image URL obtained:", watchImageUrl);
        }
      } catch (imageError) {
        console.error("❌ Image URL generation failed:", imageError);
      }

      // Enhanced function to extract ownership history with roles
      const getEnhancedOwnershipHistory = () => {
        const ownershipHistory = [];

        // Current owner (from current_owner field)
        if (watchData.currentOwner) {
          ownershipHistory.push({
            address: watchData.currentOwner,
            role: determineRole(watchData.currentOwner),
            timestamp: watchData.lastUpdated || watchData.timestamp,
            isCurrent: true,
          });
        }

        // Historical owners from ownership_history array
        if (
          watchData.ownershipHistory &&
          Array.isArray(watchData.ownershipHistory)
        ) {
          watchData.ownershipHistory.forEach((owner, index) => {
            if (owner && owner !== watchData.currentOwner) {
              ownershipHistory.push({
                address: owner,
                role: determineRole(owner),
                timestamp: getOwnershipTimestamp(owner, index),
                isCurrent: false,
              });
            }
          });
        }

        // Add specific role-based owners
        if (
          watchData.assemblerAddress &&
          !ownershipHistory.find(
            (o) => o.address === watchData.assemblerAddress
          )
        ) {
          ownershipHistory.push({
            address: watchData.assemblerAddress,
            role: "Assembler",
            timestamp: watchData.timestamp,
            isCurrent: false,
          });
        }

        if (
          watchData.distributorAddress &&
          !ownershipHistory.find(
            (o) => o.address === watchData.distributorAddress
          )
        ) {
          ownershipHistory.push({
            address: watchData.distributorAddress,
            role: "Distributor",
            timestamp: getDistributorTimestamp(),
            isCurrent: false,
          });
        }

        if (
          watchData.retailerAddress &&
          !ownershipHistory.find((o) => o.address === watchData.retailerAddress)
        ) {
          ownershipHistory.push({
            address: watchData.retailerAddress,
            role: "Retailer",
            timestamp: watchData.retailerTimestamp,
            isCurrent: false,
          });
        }

        // Remove duplicates and sort by timestamp (newest first)
        const uniqueOwners = ownershipHistory.reduce((acc, current) => {
          const existing = acc.find((item) => item.address === current.address);
          if (!existing) {
            acc.push(current);
          }
          return acc;
        }, []);

        return uniqueOwners.sort((a, b) => {
          const timestampA = new Date(a.timestamp || 0).getTime();
          const timestampB = new Date(b.timestamp || 0).getTime();
          return timestampB - timestampA; // Newest first
        });
      };

      // Helper function to determine role based on address
      const determineRole = (address) => {
        if (address === watchData.assemblerAddress) return "Assembler";
        if (address === watchData.distributorAddress) return "Distributor";
        if (address === watchData.retailerAddress) return "Retailer";
        if (address === watchData.currentOwner) return "Current Owner";
        return "Previous Owner";
      };

      // Helper function to get ownership timestamp
      const getOwnershipTimestamp = (owner, index) => {
        // Try to extract timestamp from shipping trail
        if (watchData.shippingTrail && watchData.shippingTrail.length > index) {
          const entry = watchData.shippingTrail[index];
          if (entry) {
            const timestampMatch = entry.match(/\(ISO:\s*([^)]+)\)/);
            if (timestampMatch) {
              return timestampMatch[1].trim();
            }
          }
        }
        return watchData.timestamp;
      };

      // Helper function to get distributor timestamp
      const getDistributorTimestamp = () => {
        if (!watchData.shippingTrail || watchData.shippingTrail.length === 0) {
          return null;
        }
        const shippedEntry = watchData.shippingTrail.find(
          (entry) => entry && entry.includes("SHIPPED")
        );
        if (shippedEntry) {
          const isoMatch = shippedEntry.match(/\(ISO:\s*([^)]+)\)/);
          if (isoMatch) {
            return isoMatch[1].trim();
          }
        }
        return watchData.timestamp;
      };

      // Capture map visualization as image (if map is visible)
      let mapImageUrl = null;
      try {
        const mapContainer =
          document.querySelector('[data-testid="map-container"]') ||
          document.querySelector(".leaflet-container") ||
          document.querySelector('[id*="map"]');

        if (mapContainer) {
          console.log("📍 Capturing map visualization...");
          const mapCanvas = await html2canvas(mapContainer, {
            backgroundColor: "#ffffff",
            scale: 1,
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: 600,
            height: 400,
          });
          mapImageUrl = mapCanvas.toDataURL("image/png");
          console.log("✅ Map captured successfully");
        }
      } catch (mapError) {
        console.error("❌ Map capture failed:", mapError);
      }

      // Get enhanced ownership data
      const ownershipHistory = getEnhancedOwnershipHistory();

      // Build the comprehensive HTML content with enhanced sections
      pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #d4af37; padding-bottom: 20px;">
        <h1 style="color: #d4af37; margin-bottom: 10px; font-size: 36px; font-weight: bold;">Luxury Timepiece Heritage Certificate</h1>
        <p style="color: #666; font-size: 20px; margin: 0;">Complete Supply Chain Mastery & Authenticity Report</p>
      </div>
      
      <div style="display: flex; gap: 40px; margin-bottom: 40px; align-items: flex-start;">
        <div style="flex: 0 0 320px; text-align: center;">
          <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 22px;">Master Timepiece Specimen</h3>
          ${
            watchImageUrl
              ? `<img src="${watchImageUrl}" alt="Luxury Watch" style="width: 280px; height: 280px; object-fit: cover; border-radius: 20px; border: 3px solid #d4af37; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" crossorigin="anonymous" />`
              : `<div style="width: 280px; height: 280px; border: 3px solid #d4af37; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; background: linear-gradient(135deg, #f4e99b 0%, #d4af37 50%, #f4e99b 100%); color: #1a1a1a; font-size: 20px; font-weight: bold;">Luxury Timepiece</div>`
          }
          <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e99b 50%, #d4af37 100%); color: #1a1a1a; padding: 12px 20px; border-radius: 25px; font-weight: bold; display: inline-block; margin-top: 15px; font-size: 18px;">
            Heritage Watch ID: ${watchData.watchId}
          </div>
        </div>
        
        <div style="flex: 1;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #f4e99b; padding-bottom: 10px; margin-bottom: 25px; font-size: 28px;">Heritage Authentication Certificate</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 25px;">
            <div style="border: 2px solid #d4af37; border-radius: 12px; padding: 18px; background-color: #fefdf9;">
              <div style="color: #d4af37; font-weight: bold; font-size: 14px; margin-bottom: 8px; text-transform: uppercase;">Heritage ID</div>
              <div style="color: #1a1a1a; font-size: 16px; font-weight: bold; font-family: 'Playfair Display', serif;">${
                watchData.watchId
              }</div>
            </div>
            
            <div style="border: 2px solid #d4af37; border-radius: 12px; padding: 18px; background-color: #fefdf9;">
              <div style="color: #d4af37; font-weight: bold; font-size: 14px; margin-bottom: 8px; text-transform: uppercase;">Master Assembler</div>
              <div style="color: #1a1a1a; font-size: 12px; font-weight: 500; font-family: monospace; word-break: break-all;">${
                watchData.assembledBy
                  ? formatFullAddress(watchData.assembledBy)
                  : "N/A"
              }</div>
            </div>
            
            <div style="border: 2px solid #d4af37; border-radius: 12px; padding: 18px; background-color: #fefdf9;">
              <div style="color: #d4af37; font-weight: bold; font-size: 14px; margin-bottom: 8px; text-transform: uppercase;">Crafted Date</div>
              <div style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${getBestTimestamp(
                watchData
              )}</div>
            </div>
            
            <div style="border: 2px solid #d4af37; border-radius: 12px; padding: 18px; background-color: #fefdf9;">
              <div style="color: #d4af37; font-weight: bold; font-size: 14px; margin-bottom: 8px; text-transform: uppercase;">Delivery Status</div>
              <span style="padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; font-size: 12px; text-transform: uppercase; background-color: ${getStatusColor(
                watchData.shippingStatus
              )};">
                ${getShippingStatusText(watchData.shippingStatus)}
              </span>
            </div>
            
            <div style="border: 2px solid #d4af37; border-radius: 12px; padding: 18px; background-color: #fefdf9; grid-column: span 2;">
              <div style="color: #d4af37; font-weight: bold; font-size: 14px; margin-bottom: 8px; text-transform: uppercase;">Market Status</div>
              <span style="padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; font-size: 12px; background-color: ${
                watchData.sold
                  ? "#dc3545"
                  : watchData.availableForSale
                  ? "#28a745"
                  : "#ffc107"
              };">
                ${
                  watchData.sold
                    ? "SOLD"
                    : watchData.availableForSale
                    ? `AVAILABLE - $${parseFloat(watchData.retailPrice).toFixed(
                        2
                      )}`
                    : "NOT FOR SALE"
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Ownership History Section -->
      <div style="background: linear-gradient(135deg, #fefdf9 0%, #f9f7f0 50%, #fefdf9 100%); padding: 30px; border-radius: 15px; border: 2px solid #d4af37; margin-bottom: 30px;">
        <h2 style="color: #d4af37; border-bottom: 3px solid #d4af37; padding-bottom: 10px; margin-bottom: 25px; font-size: 26px;">Complete Heritage Ownership Registry</h2>
        
        ${
          ownershipHistory.length > 0
            ? ownershipHistory
                .map(
                  (owner, index) => `
          <div style="border: 1px solid #d4af37; border-radius: 10px; padding: 20px; background-color: white; margin-bottom: 15px; position: relative; ${
            owner.isCurrent
              ? "border-width: 3px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);"
              : ""
          }">
            ${
              owner.isCurrent
                ? '<div style="position: absolute; top: -10px; left: 20px; background: #d4af37; color: #1a1a1a; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">CURRENT OWNER</div>'
                : ""
            }
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
              <div style="flex: 1;">
                <div style="color: #d4af37; font-weight: bold; font-size: 18px; margin-bottom: 5px;">${
                  owner.role
                }</div>
                <div style="color: #333; font-size: 12px; font-family: monospace; word-break: break-all; background: #f5f5f5; padding: 8px; border-radius: 5px;">
                  ${formatFullAddress(owner.address)}
                </div>
              </div>
              
              <div style="text-align: right; margin-left: 20px;">
                <div style="color: #666; font-size: 12px; margin-bottom: 3px;">Ownership Date</div>
                <div style="color: #1a1a1a; font-size: 14px; font-weight: 600;">
                  ${
                    owner.timestamp
                      ? formatDatabaseTimestamp(owner.timestamp)
                      : "N/A"
                  }
                </div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 10px;">
              <div style="color: #888; font-size: 11px;">
                ${
                  index === 0
                    ? "Current Heritage Custodian"
                    : `Heritage Stage ${ownershipHistory.length - index}`
                }
              </div>
            </div>
          </div>
        `
                )
                .join("")
            : '<div style="text-align: center; padding: 20px; color: #666;">No ownership history available</div>'
        }
      </div>

      <!-- Heritage Components Registry -->
      <div style="background: linear-gradient(135deg, #fefdf9 0%, #f9f7f0 50%, #fefdf9 100%); padding: 30px; border-radius: 15px; border: 2px solid #d4af37; margin-bottom: 30px;">
        <h2 style="color: #d4af37; border-bottom: 3px solid #d4af37; padding-bottom: 10px; margin-bottom: 25px; font-size: 26px;">Heritage Components Registry</h2>
        ${
          watchComponents.length > 0
            ? watchComponents
                .map(
                  (component, index) => `
          <div style="border: 1px solid #d4af37; border-radius: 10px; padding: 15px; background-color: white; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="color: #d4af37; font-weight: bold; font-size: 16px;">${
                component.componentType || "Component"
              } #${index + 1}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
              <div><strong>Component ID:</strong> ${component.componentId}</div>
              <div><strong>Serial:</strong> ${component.serialNumber}</div>
              <div><strong>Material ID:</strong> ${
                component.rawMaterialId || "N/A"
              }</div>
              <div><strong>Certified:</strong> ${
                formatTimestamp(component.certificationTimestamp) || "N/A"
              }</div>
            </div>
          </div>`
                )
                .join("")
            : `<div style="text-align: center; padding: 20px; color: #666;">No components data available</div>`
        }
      </div>

      <!-- Enhanced Global Heritage Journey Section -->
      ${
        watchData.shippingTrail && watchData.shippingTrail.length > 0
          ? `
      <div style="background: linear-gradient(135deg, #fefdf9 0%, #f9f7f0 50%, #fefdf9 100%); padding: 30px; border-radius: 15px; border: 2px solid #d4af37; margin-bottom: 30px;">
        <h2 style="color: #d4af37; border-bottom: 3px solid #d4af37; padding-bottom: 10px; margin-bottom: 25px; font-size: 26px;">Global Heritage Journey Timeline</h2>
        
        <!-- Map Visualization (if captured) -->
        ${
          mapImageUrl
            ? `
        <div style="text-align: center; margin-bottom: 30px;">
          <h3 style="color: #d4af37; margin-bottom: 15px; font-size: 20px;">Journey Route Visualization</h3>
          <div style="border: 2px solid #d4af37; border-radius: 10px; padding: 10px; background: white; display: inline-block;">
            <img src="${mapImageUrl}" alt="Shipping Route Map" style="max-width: 600px; width: 100%; height: auto; border-radius: 5px;" />
          </div>
        </div>`
            : ""
        }
        
        <!-- Detailed Timeline -->
        <h3 style="color: #d4af37; margin-bottom: 20px; font-size: 20px;">Detailed Journey Chronicle</h3>
        ${watchData.shippingTrail
          .filter((entry) => entry !== null && entry !== undefined)
          .map(
            (entry, index) => `
          <div style="border-left: 4px solid #d4af37; padding-left: 20px; margin-bottom: 20px; position: relative;">
            <div style="position: absolute; left: -10px; top: 5px; width: 16px; height: 16px; border-radius: 50%; background-color: ${getStatusColor(
              index + 1
            )}; border: 2px solid white;"></div>
            <div style="color: #d4af37; font-weight: bold; font-size: 16px; margin-bottom: 8px;">
              Step ${index + 1}: ${getShippingStatusText(
              index + 1
            )} ${getStatusIcon(index + 1)}
            </div>
            <div style="color: #333; font-size: 14px; margin-bottom: 5px; font-weight: 600;">
              Location: ${entry.split(" on ")[0]}
            </div>
            <div style="color: #666; font-size: 12px; background: #f9f9f9; padding: 8px; border-radius: 5px; margin-bottom: 8px;">
              ${extractTimestamp(entry).date} at ${extractTimestamp(entry).time}
            </div>
            <div style="color: #888; font-size: 11px; font-style: italic;">
              Heritage verification point ${index + 1} of ${
              watchData.shippingTrail.filter((e) => e !== null).length
            }
            </div>
          </div>`
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- QR Code Section -->
      ${
        qrDataUrl
          ? `
      <div style="text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #fefdf9 0%, #f9f7f0 50%, #fefdf9 100%); border-radius: 15px; border: 2px solid #d4af37;">
        <h2 style="color: #d4af37; margin-bottom: 25px; font-size: 24px;">Digital Heritage Authentication Code</h2>
        <div style="display: inline-block; padding: 20px; background-color: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3); border: 2px solid #d4af37;">
          <img src="${qrDataUrl}" alt="Heritage QR Code" style="width: 180px; height: 180px;" />
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Scan this QR code to verify luxury timepiece heritage authenticity and access complete blockchain records
        </p>
      </div>`
          : ""
      }

      <!-- Enhanced Footer -->
      <div style="text-align: center; margin-top: 50px; padding-top: 25px; border-top: 3px solid #d4af37; font-size: 12px; color: #666;">
        <p style="margin: 8px 0; font-size: 14px; color: #1a1a1a;">Generated on ${dayjs().format(
          "MMMM D, YYYY hh:mm A"
        )}</p>
        <p style="margin: 8px 0;">Luxury Timepiece Heritage Supply Chain Management System</p>
        <p style="color: #d4af37; font-size: 16px; font-weight: bold; margin: 15px 0; font-family: 'Playfair Display', serif;">Blockchain-Verified Heritage Certificate</p>
        <p style="margin: 8px 0; font-size: 11px; color: #888;">
          This certificate contains complete ownership history, component traceability, and verified shipping journey data
        </p>
      </div>
    `;

      document.body.appendChild(pdfContainer);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate canvas with high quality
      const canvas = await html2canvas(pdfContainer, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: pdfContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Complete_Heritage_Certificate_${
        watchData.watchId
      }_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(pdfContainer);

      console.log("✅ Enhanced PDF generated successfully:", fileName);
    } catch (error) {
      console.error("❌ Error generating enhanced PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };
  const getCurrentTimeLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setCurrentCoordinates({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          } catch (error) {
            console.error("Geocoding error:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  const fetchWatchData = async (watchQrData) => {
    if (!watchQrData) {
      setError("No watch QR data provided");
      return;
    }

    setLoading(true);
    try {
      const dataParts = watchQrData.split(",");
      if (dataParts.length < 2) {
        setError("Invalid QR code format");
        setLoading(false);
        return;
      }

      const watchId = dataParts[1];
      console.log("Fetching fresh watch data for:", watchId);

      const response = await api.get(`/watch/${watchId}`);

      if (!response.data || response.data.length === 0) {
        setError("Watch not found in database");
        setLoading(false);
        return;
      }

      const dbWatch = response.data[0];
      console.log("Fresh database watch data:", dbWatch);

      const rawAssemblerAddress = dbWatch.assembler_address;
      const finalAssemblerAddress =
        rawAssemblerAddress && rawAssemblerAddress.toString().trim() !== ""
          ? rawAssemblerAddress.toString().trim()
          : null;

      // Enhanced data transformation with proper timestamp handling
      const watchInfo = {
        watchId: dbWatch.watch_id || "N/A",
        componentIds: Array.isArray(dbWatch.component_ids)
          ? dbWatch.component_ids
          : [],
        assemblerAddress: finalAssemblerAddress,
        assembledBy: finalAssemblerAddress,
        timestamp: dbWatch.timestamp || "",
        shippingStatus: parseInt(dbWatch.shipping_status || 0),
        currentLocation: dbWatch.location || "N/A",
        lastUpdated: dbWatch.updated_at || dbWatch.timestamp || "",
        updatedAt: dbWatch.updated_at || "",
        createdAt: dbWatch.created_at || "",
        availableForSale: dbWatch.available_for_sale === true,
        sold: dbWatch.sold === true,
        currentOwner: dbWatch.current_owner || finalAssemblerAddress || "",
        image: dbWatch.image || "",
        description: dbWatch.description || "",
        retailPrice: dbWatch.retail_price
          ? parseFloat(dbWatch.retail_price)
          : 0,
        retailerAddress: dbWatch.retailer_address || "",
        distributorAddress: dbWatch.distributor_address || "",
        retailerTimestamp: dbWatch.retailer_timestamp || "",
        consumerTimestamp: dbWatch.consumer_timestamp || "",
        retailerLocation: dbWatch.retailer_location || "",
        shippingTrail: Array.isArray(dbWatch.shipping_trail)
          ? dbWatch.shipping_trail.filter((trail) => trail !== null)
          : [],
        ownershipHistory: Array.isArray(dbWatch.ownership_history)
          ? dbWatch.ownership_history.filter((owner) => owner !== null)
          : [],
      };

      setWatchData(watchInfo);

      if (watchInfo.componentIds && watchInfo.componentIds.length > 0) {
        await fetchWatchComponents(watchInfo.componentIds);
      }
    } catch (err) {
      console.error("Error fetching watch data:", err);
      if (err.response?.status === 404) {
        setError("Watch not found. Please check the QR code and try again.");
      } else {
        setError("Failed to fetch watch data. Please try again.");
      }
    }
    setLoading(false);
  };

  const fetchWatchComponents = async (componentIds) => {
    if (!componentIds || componentIds.length === 0) {
      setWatchComponents([]);
      return;
    }

    try {
      const components = [];
      for (const componentId of componentIds) {
        if (!componentId) continue;

        try {
          const response = await api.get(`/component/${componentId}`);
          if (response.data && response.data.length > 0) {
            const dbComponent = response.data[0];

            const componentInfo = {
              componentId: dbComponent.component_id || "N/A",
              componentType: dbComponent.component_type || "Unknown",
              serialNumber: dbComponent.serial_number || "N/A",
              createdBy: dbComponent.manufacturer_address || "",
              timestamp: dbComponent.timestamp || "",
              certified: dbComponent.status === "1" || dbComponent.status === 1,
              certifiedBy: dbComponent.certifier_address || "N/A",
              certificationTimestamp:
                dbComponent.updated_at || dbComponent.timestamp || "",
              rawMaterialId: dbComponent.raw_material_id || null,
              image: dbComponent.image || "",
              description: dbComponent.description || "",
            };

            components.push(componentInfo);
          }
        } catch (err) {
          console.error(`Error fetching component ${componentId}:`, err);
        }
      }

      setWatchComponents(components);
      await fetchRawMaterialsForComponents(components);
    } catch (err) {
      console.error("Error fetching watch components:", err);
      setWatchComponents([]);
    }
  };

  const fetchRawMaterialsForComponents = async (components) => {
    if (!components || components.length === 0) {
      setRawMaterials([]);
      return;
    }

    try {
      const materials = [];
      for (const component of components) {
        if (!component.rawMaterialId) {
          materials.push(null);
          continue;
        }

        try {
          const response = await api.get(
            `/raw-material/${component.rawMaterialId}`
          );

          if (response.data && response.data.length > 0) {
            const dbMaterial = response.data[0];

            const materialInfo = {
              materialId: dbMaterial.component_id || "N/A",
              materialType: dbMaterial.material_type || "Unknown",
              origin: dbMaterial.origin || "Unknown",
              suppliedBy: dbMaterial.supplier_address || "",
              timestamp: dbMaterial.timestamp || "",
              image: dbMaterial.image || "",
              description: dbMaterial.description || "",
            };

            materials.push(materialInfo);
          } else {
            materials.push(null);
          }
        } catch (err) {
          console.error(
            `Error fetching raw material ${component.rawMaterialId}:`,
            err
          );
          materials.push(null);
        }
      }

      setRawMaterials(materials);
    } catch (err) {
      console.error("Error fetching raw materials:", err);
      setRawMaterials([]);
    }
  };

  // ENHANCED: Improved timestamp extraction function for shipping trail
  const extractTimestamp = (entry) => {
    try {
      console.log("Processing shipping trail entry:", entry);

      if (!entry) {
        const now = dayjs();
        return {
          date: now.format("DD/MM/YYYY"),
          time: now.format("h:mm A"),
        };
      }

      const entryStr = String(entry);

      // Enhanced parsing for shipping trail with ISO timestamp extraction
      const isoMatch = entryStr.match(/\(ISO:\s*([^)]+)\)/);
      if (isoMatch) {
        const isoTimestamp = isoMatch[1].trim();
        console.log("Found ISO timestamp in trail:", isoTimestamp);
        const parsedDate = dayjs(isoTimestamp);
        if (parsedDate.isValid()) {
          return {
            date: parsedDate.format("DD/MM/YYYY"),
            time: parsedDate.format("h:mm A"),
          };
        }
      }

      // Fallback to locale string parsing for older entries
      const match = entryStr.match(
        /^(.*?)\s+at\s+(.*?)\s+on\s+(.+?)(?:\s+\(ISO:|$)/
      );
      if (match) {
        const timestampStr = match[3].trim();
        console.log("Extracted locale timestamp string:", timestampStr);

        // Enhanced parsing for locale string format
        const formats = [
          "M/D/YYYY, h:mm:ss A",
          "MM/DD/YYYY, h:mm:ss A",
          "M/D/YYYY, h:mm A",
          "MM/DD/YYYY, h:mm A",
          "D/M/YYYY, h:mm:ss A",
          "DD/MM/YYYY, h:mm:ss A",
          "D/M/YYYY, h:mm A",
          "DD/MM/YYYY, h:mm A",
          "M/D/YYYY h:mm:ss A",
          "MM/DD/YYYY h:mm:ss A",
          "YYYY-MM-DD HH:mm:ss",
          "YYYY-MM-DDTHH:mm:ss.SSSZ",
        ];

        let parsedDate = null;

        // Try parsing with each format
        for (const format of formats) {
          parsedDate = dayjs(timestampStr, format, true);
          if (parsedDate.isValid()) {
            console.log("Successfully parsed with format:", format);
            return {
              date: parsedDate.format("DD/MM/YYYY"),
              time: parsedDate.format("h:mm A"),
            };
          }
        }

        // Try parsing without strict mode
        parsedDate = dayjs(timestampStr);
        if (parsedDate.isValid()) {
          console.log("Parsed with flexible parsing");
          return {
            date: parsedDate.format("DD/MM/YYYY"),
            time: parsedDate.format("h:mm A"),
          };
        }

        // Try to extract Unix timestamp as fallback
        const timestampRegex = /(\d{10,13})/;
        const unixMatch = timestampStr.match(timestampRegex);
        if (unixMatch) {
          const timestamp = parseInt(unixMatch[1]);
          const timestampMs =
            timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
          parsedDate = dayjs(timestampMs);
          if (parsedDate.isValid()) {
            console.log("Parsed as Unix timestamp");
            return {
              date: parsedDate.format("DD/MM/YYYY"),
              time: parsedDate.format("h:mm A"),
            };
          }
        }

        // Fallback: return the raw timestamp string
        console.log("All parsing failed, using raw string");
        return {
          date: timestampStr.substring(0, 20) || "Unknown Date",
          time: timestampStr.substring(21) || "Unknown Time",
        };
      }

      // If no timestamp pattern found, try to parse the whole entry
      console.log("No timestamp pattern found, trying to parse whole entry");
      const directParse = dayjs(entryStr);
      if (directParse.isValid()) {
        return {
          date: directParse.format("DD/MM/YYYY"),
          time: directParse.format("h:mm A"),
        };
      }

      // Final fallback
      console.log("All parsing methods failed for:", entry);
      const now = dayjs();
      return {
        date: "Parse Error",
        time: now.format("h:mm A"),
      };
    } catch (error) {
      console.warn("Error extracting timestamp:", error, "from entry:", entry);
      const now = dayjs();
      return {
        date: "Parse Error",
        time: now.format("h:mm A"),
      };
    }
  };

  // Enhanced image error handling
  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageError(false);
    setImageLoading(false);
  };

  // Enhanced image URL construction with fallback
  const getImageUrl = (imageName) => {
    if (!imageName || imageName === "") return null;
    return `${api.defaults.baseURL}/file/watch/${imageName}`;
  };
  // Enhanced image display component with watch theme
  const ImageDisplay = ({ imageName, alt = "Luxury Watch" }) => {
    const imageUrl = getImageUrl(imageName);

    if (!imageUrl) {
      return (
        <Box
          sx={{
            width: 320,
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: watchColors.gradients.luxury,
            border: `3px solid ${watchColors.alpha.primary30}`,
            borderRadius: "20px",
            margin: "auto",
            animation: `${floatAnimation} 6s ease-in-out infinite`,
            boxShadow: `0 10px 30px ${watchColors.alpha.primary30}`,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "6rem",
                mb: 1,
                color: watchColors.accent,
                filter: `drop-shadow(0 0 12px ${watchColors.alpha.primary50})`,
              }}
            >
              <Watch />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: watchColors.accent,
                fontWeight: 700,
                fontFamily: watchTypography.accent,
                textShadow: `0 2px 4px ${watchColors.alpha.primary30}`,
              }}
            >
              Luxury Timepiece
            </Typography>
          </Box>
        </Box>
      );
    }

    if (imageError) {
      return (
        <Box
          sx={{
            width: 320,
            height: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            background: watchColors.alpha.primary05,
            border: `3px dashed ${watchColors.alpha.primary30}`,
            borderRadius: "20px",
          }}
        >
          <Warning
            sx={{ fontSize: "4rem", mb: 1, color: watchColors.warning }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#ffffff", textAlign: "center" }}
          >
            Timepiece Image Not Found
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ position: "relative", textAlign: "center" }}>
        {imageLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: watchColors.alpha.primary10,
              borderRadius: "20px",
              zIndex: 1,
            }}
          >
            <CircularProgress sx={{ color: watchColors.primary }} />
          </Box>
        )}
        <CardMedia
          component="img"
          sx={{
            width: 320,
            height: 320,
            objectFit: "cover",
            borderRadius: "20px",
            margin: "auto",
            display: "block",
            border: `3px solid ${watchColors.alpha.primary30}`,
            transition: "all 0.3s ease",
            boxShadow: `0 10px 30px ${watchColors.alpha.primary20}`,
            "&:hover": {
              transform: "scale(1.02) rotate(1deg)",
              boxShadow: `0 15px 40px ${watchColors.alpha.primary40}`,
            },
          }}
          image={imageUrl}
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </Box>
    );
  };

  const formatAddress = (address) => {
    if (
      !address ||
      address === null ||
      address === undefined ||
      address === "" ||
      address === "null"
    ) {
      return "N/A";
    }
    const addressStr = String(address).trim();
    if (addressStr === "" || addressStr === "null") {
      return "N/A";
    }
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  const formatFullAddress = (address) => {
    if (
      !address ||
      address === null ||
      address === undefined ||
      address === "" ||
      address === "null"
    ) {
      return "N/A";
    }
    return String(address).trim();
  };

  const formatTimestamp = (timestamp) => {
    if (
      !timestamp ||
      timestamp === "0" ||
      timestamp === null ||
      timestamp === undefined
    ) {
      return "N/A";
    }
    try {
      const timestampMs =
        timestamp.toString().length === 10
          ? parseInt(timestamp) * 1000
          : parseInt(timestamp);
      const date = dayjs(timestampMs);
      return date.isValid()
        ? date.format("DD/MM/YYYY, h:mm A")
        : "Invalid Date";
    } catch {
      return "Invalid Date";
    }
  };

  const formatDatabaseTimestamp = (timestamp) => {
    if (!timestamp || timestamp === null || timestamp === undefined) {
      return "N/A";
    }
    try {
      const date = dayjs(timestamp);
      return date.isValid()
        ? date.format("DD/MM/YYYY, h:mm A")
        : "Invalid Date";
    } catch {
      return "Invalid Date";
    }
  };

  const getBestTimestamp = (watchData) => {
    if (watchData.updatedAt && watchData.updatedAt !== "") {
      return formatDatabaseTimestamp(watchData.updatedAt);
    }
    if (watchData.createdAt && watchData.createdAt !== "") {
      return formatDatabaseTimestamp(watchData.createdAt);
    }
    if (watchData.timestamp && watchData.timestamp !== "") {
      return formatTimestamp(watchData.timestamp);
    }
    return "N/A";
  };

  const handleNavigateToComponent = (componentId) => {
    const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";
    const qrCodeData = `${CONTRACT_ADDRESS},${componentId}`;
    navigate("/view-component", {
      state: { qrData: qrCodeData, scanType: "component" },
    });
  };

  const handleNavigateToRawMaterial = (materialId) => {
    const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";
    const qrCodeData = `${CONTRACT_ADDRESS},${materialId}`;
    navigate("/view-raw-material", {
      state: { qrData: qrCodeData, scanType: "raw-material" },
    });
  };

  const handleBack = () => navigate(-1);

  const handleHome = () => {
    if (auth?.role === "supplier") navigate("/supplier");
    else if (auth?.role === "manufacturer") navigate("/manufacturer");
    else if (auth?.role === "certifier") navigate("/certifier");
    else if (auth?.role === "assembler") navigate("/assembler");
    else if (auth?.role === "distributor") navigate("/distributor");
    else if (auth?.role === "retailer") navigate("/retailer");
    else if (auth?.role === "consumer") navigate("/consumer");
    else if (auth?.role === "admin") navigate("/admin");
    else navigate("/");
  };

  const handleScanAnother = () => navigate("/scanner");

  const downloadQR = () => {
    const canvas = document.getElementById("watchQR");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${watchData?.watchId || "watch"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={watchMuiTheme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: `linear-gradient(135deg, 
              rgba(26, 26, 26, 0.95) 0%, 
              rgba(45, 45, 45, 0.98) 50%, 
              rgba(26, 26, 26, 0.95) 100%
            )`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card sx={watchStyles.luxuryCard}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress
                sx={{
                  mb: 2,
                  color: watchColors.primary,
                  animation: `${luxuryGlow} 2s ease-in-out infinite`,
                }}
              />
              <Typography
                sx={{
                  color: "#ffffff",
                  fontFamily: watchTypography.accent,
                  fontWeight: 600,
                }}
              >
                Loading luxury timepiece data...
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={watchMuiTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, 
            rgba(26, 26, 26, 0.95) 0%, 
            rgba(45, 45, 45, 0.98) 50%, 
            rgba(26, 26, 26, 0.95) 100%
          )`,
          backgroundAttachment: "fixed",
          paddingTop: "2%",
          paddingBottom: "5%",
          overflowY: "auto",
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 30%, ${watchColors.alpha.primary05} 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, ${watchColors.alpha.primary10} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            width: "95%",
            maxWidth: "1200px",
            margin: "auto",
            padding: "32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Enhanced Header Section */}
          <Box sx={watchStyles.pageHeader}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: watchTypography.primary,
                fontWeight: 700,
                color: watchColors.accent,
                mb: 1,
                textShadow: `0 0 20px ${watchColors.alpha.primary30}`,
                position: "relative",
                zIndex: 2,
              }}
            >
              <Diamond
                sx={{
                  mr: 2,
                  fontSize: "2.5rem",
                  animation: `${floatAnimation} 3s ease-in-out infinite`,
                }}
              />
              Luxury Timepiece Authentication
              <Star
                sx={{
                  ml: 2,
                  fontSize: "2.5rem",
                  animation: `${floatAnimation} 3s ease-in-out infinite`,
                }}
              />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: watchTypography.accent,
                color: watchColors.accent,
                fontWeight: 500,
                letterSpacing: "1px",
                position: "relative",
                zIndex: 2,
              }}
            >
              Complete Supply Chain Mastery & Heritage
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: watchColors.alpha.primary05,
                border: `1px solid ${watchColors.error}`,
                color: "#ffffff",
                "& .MuiAlert-icon": {
                  color: watchColors.error,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {watchData && (
            <>
              {/* Main Watch Information Card */}
              <Card sx={{ ...watchStyles.luxuryCardWithGlow, mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Watch Image Section */}
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        color: watchColors.primary,
                        fontFamily: watchTypography.accent,
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      <Verified sx={{ mr: 1 }} />
                      Master Timepiece Specimen
                    </Typography>
                    <ImageDisplay
                      imageName={watchData.image}
                      alt="Luxury Watch"
                    />
                  </Box>

                  {/* Watch ID Display */}
                  <Box
                    sx={{
                      ...watchStyles.infoCard,
                      textAlign: "center",
                      background: watchColors.gradients.luxury,
                      border: `2px solid ${watchColors.primary}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: watchColors.accent,
                        fontWeight: 600,
                        mb: 0.5,
                        fontFamily: watchTypography.secondary,
                      }}
                    >
                      Heritage Identification Number
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: watchTypography.mono,
                        color: watchColors.accent,
                        letterSpacing: "2px",
                        fontWeight: 700,
                        textShadow: `0 2px 4px ${watchColors.alpha.primary30}`,
                      }}
                    >
                      {watchData.watchId || "N/A"}
                    </Typography>
                  </Box>

                  {/* Watch Details Grid */}
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Assembly Information */}
                    <Grid item xs={12} md={6}>
                      <Box sx={watchStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: watchColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Master Assembler
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: watchTypography.mono,
                            color: "#ffffff",
                            wordBreak: "break-all",
                          }}
                        >
                          {watchData.assembledBy}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Assembly Date */}
                    <Grid item xs={12} md={6}>
                      <Box sx={watchStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: watchColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Crafted Date
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#ffffff",
                            fontFamily: watchTypography.secondary,
                          }}
                        >
                          {getBestTimestamp(watchData)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Shipping Status */}
                    <Grid item xs={12} md={6}>
                      <Box sx={watchStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: watchColors.primary,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Delivery Status
                        </Typography>
                        <Chip
                          label={getShippingStatusText(
                            watchData.shippingStatus
                          )}
                          sx={{
                            backgroundColor: getStatusColor(
                              watchData.shippingStatus
                            ),
                            color: "#ffffff",
                            fontWeight: 600,
                            "& .MuiChip-icon": { color: "#ffffff" },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Retail Status */}
                    <Grid item xs={12} md={6}>
                      <Box sx={watchStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: watchColors.primary,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Market Status
                        </Typography>
                        {watchData.sold ? (
                          <Chip
                            label="SOLD"
                            sx={{
                              backgroundColor: watchColors.error,
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                          />
                        ) : watchData.availableForSale ? (
                          <Chip
                            label={`AVAILABLE - $${parseFloat(
                              watchData.retailPrice
                            ).toFixed(2)}`}
                            sx={{
                              backgroundColor: watchColors.success,
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                          />
                        ) : (
                          <Chip
                            label="NOT FOR SALE"
                            sx={{
                              backgroundColor: watchColors.warning,
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Watch Components Section */}
              <WatchComponentsSection
                watchComponents={watchComponents}
                rawMaterials={rawMaterials}
                onNavigateToComponent={handleNavigateToComponent}
                onNavigateToRawMaterial={handleNavigateToRawMaterial}
                formatTimestamp={formatTimestamp}
                formatAddress={formatAddress}
                viewType="interactive"
              />

              {/* Enhanced Shipping Map Visualization */}
              {watchData.shippingTrail &&
                watchData.shippingTrail.length > 0 && (
                  <Card sx={{ ...watchStyles.luxuryCard, mb: 3 }}>
                    <CardContent>
                      <ShippingMapVisualization
                        shippingTrail={watchData.shippingTrail.filter(
                          (trail) => trail !== null
                        )}
                        currentCoordinates={currentCoordinates}
                        showToggleButton={true}
                        initialShowMap={false}
                        height="400px"
                        title={
                          <Typography
                            variant="h6"
                            sx={{
                              color: watchColors.primary,
                              fontFamily: watchTypography.accent,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LocalShipping />
                            Global Heritage Journey Tracker
                          </Typography>
                        }
                        themeColors={{
                          primary: watchColors.primary,
                          secondary: watchColors.secondary,
                          accent: watchColors.primary,
                          routeColor: watchColors.primary,
                          routeGlow: watchColors.alpha.primary30,
                        }}
                      />

                      {/* Enhanced Shipping Timeline History */}
                      <Box sx={{ mt: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 3,
                            color: watchColors.primary,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                            fontFamily: watchTypography.accent,
                          }}
                        >
                          <TimelineIcon sx={{ mr: 2 }} />
                          Heritage Timeline Chronicle
                        </Typography>
                        <Timeline
                          sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                              flex: 0.3,
                            },
                          }}
                        >
                          {watchData.shippingTrail
                            .filter(
                              (entry) => entry !== null && entry !== undefined
                            )
                            .map((entry, index) => {
                              const formattedTimestamp =
                                extractTimestamp(entry);
                              const isLatest =
                                index ===
                                watchData.shippingTrail.filter(
                                  (e) => e !== null
                                ).length -
                                  1;

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
                                        color: watchColors.primary,
                                        fontFamily: watchTypography.mono,
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {formattedTimestamp.date}
                                    </Typography>
                                    {formattedTimestamp.time && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.8)",
                                          fontFamily: watchTypography.mono,
                                          fontWeight: 600,
                                          display: "block",
                                          mt: 0.5,
                                        }}
                                      >
                                        {formattedTimestamp.time}
                                      </Typography>
                                    )}
                                  </TimelineOppositeContent>
                                  <TimelineSeparator>
                                    <TimelineDot
                                      sx={{
                                        backgroundColor: getStatusColor(
                                          index + 1
                                        ),
                                        boxShadow: `0 0 15px ${getStatusColor(
                                          index + 1
                                        )}80`,
                                        width: 48,
                                        height: 48,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.2rem",
                                        border: `2px solid ${getStatusColor(
                                          index + 1
                                        )}`,
                                        animation: isLatest
                                          ? `${luxuryGlow} 2s infinite`
                                          : "none",
                                      }}
                                    >
                                      {getStatusIcon(index + 1)}
                                    </TimelineDot>
                                    {index <
                                      watchData.shippingTrail.filter(
                                        (e) => e !== null
                                      ).length -
                                        1 && (
                                      <TimelineConnector
                                        sx={{
                                          backgroundColor: watchColors.primary,
                                          width: 4,
                                          boxShadow: `0 0 8px ${watchColors.alpha.primary50}`,
                                        }}
                                      />
                                    )}
                                  </TimelineSeparator>
                                  <TimelineContent>
                                    <Card
                                      sx={{
                                        p: 2,
                                        backgroundColor:
                                          watchColors.alpha.primary10,
                                        border: `1px solid ${watchColors.alpha.primary20}`,
                                        borderRadius: 2,
                                        position: "relative",
                                        "&::after": isLatest
                                          ? {
                                              content: '""',
                                              position: "absolute",
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              bottom: 0,
                                              background: `linear-gradient(-45deg, 
                                          transparent 25%, 
                                          ${watchColors.alpha.primary10} 25%, 
                                          ${watchColors.alpha.primary10} 50%, 
                                          transparent 50%, 
                                          transparent 75%, 
                                          ${watchColors.alpha.primary10} 75%)`,
                                              backgroundSize: "20px 20px",
                                              animation: `${shimmer} 2s linear infinite`,
                                              borderRadius: 2,
                                              zIndex: 1,
                                              pointerEvents: "none",
                                            }
                                          : {},
                                      }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          color: "#ffffff",
                                          fontWeight: 600,
                                          mb: 1,
                                          position: "relative",
                                          zIndex: 2,
                                          fontFamily: watchTypography.secondary,
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
                                          position: "relative",
                                          zIndex: 2,
                                        }}
                                      >
                                        <Chip
                                          size="small"
                                          label="Verified Heritage"
                                          sx={{
                                            backgroundColor:
                                              watchColors.alpha.primary20,
                                            color: watchColors.primary,
                                            fontSize: "0.7rem",
                                            height: 20,
                                            fontFamily:
                                              watchTypography.secondary,
                                          }}
                                        />
                                      </Box>
                                    </Card>
                                  </TimelineContent>
                                </TimelineItem>
                              );
                            })}
                        </Timeline>
                      </Box>
                    </CardContent>
                  </Card>
                )}

              {/* Ownership Information */}
              <Ownership
                watchData={watchData}
                formatTimestamp={formatTimestamp}
                formatFullAddress={formatFullAddress}
                formatDatabaseTimestamp={formatDatabaseTimestamp}
              />

              {/* QR Code Section */}
              <Card sx={watchStyles.qrSection}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      textAlign: "center",
                      color: "#ffffff",
                      fontFamily: watchTypography.accent,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <QrCode2 sx={{ color: watchColors.primary }} />
                    Heritage Authentication Code
                  </Typography>

                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        p: 2,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: `0 4px 12px ${watchColors.alpha.primary30}`,
                      }}
                    >
                      <QRCode
                        id="watchQR"
                        value={qrData || "No QR Data"}
                        size={200}
                        level={"H"}
                        includeMargin={true}
                      />
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Download />}
                    onClick={downloadQR}
                    sx={{
                      ...watchStyles.luxuryButton.contained,
                      fontSize: "1rem",
                    }}
                  >
                    Download Heritage Code
                  </Button>
                </CardContent>
              </Card>

              {/* Role-based Action Alerts */}
              {watchData.shippingStatus === 3 &&
                !watchData.availableForSale &&
                auth?.role === "retailer" && (
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      background: watchColors.alpha.primary10,
                      border: `1px solid ${watchColors.info}`,
                      color: "#ffffff",
                      "& .MuiAlert-icon": {
                        color: watchColors.info,
                      },
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Heritage Action Required:</strong> This luxury
                      timepiece has been delivered and is ready to be marked as
                      available for sale with a premium retail price.
                    </Typography>
                  </Alert>
                )}

              {watchData.retailPrice > 0 &&
                !watchData.sold &&
                auth?.role === "consumer" && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      background: watchColors.alpha.primary10,
                      border: `1px solid ${watchColors.success}`,
                      color: "#ffffff",
                      "& .MuiAlert-icon": {
                        color: watchColors.success,
                      },
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Available for Heritage Acquisition:</strong> This
                      luxury timepiece is ready to be acquired for $
                      {parseFloat(watchData.retailPrice).toFixed(2)}.
                    </Typography>
                  </Alert>
                )}

              {watchData.shippingStatus < 3 && auth?.role === "distributor" && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    background: watchColors.alpha.primary10,
                    border: `1px solid ${watchColors.info}`,
                    color: "#ffffff",
                    "& .MuiAlert-icon": {
                      color: watchColors.info,
                    },
                  }}
                >
                  <Typography variant="body2">
                    <strong>Distribution Action Required:</strong> Update the
                    shipping status of this luxury timepiece in the distribution
                    system.
                  </Typography>
                </Alert>
              )}

              <Divider
                sx={{
                  my: 3,
                  borderColor: watchColors.alpha.primary30,
                  "&::before, &::after": {
                    borderColor: watchColors.alpha.primary30,
                  },
                }}
              />

              {/* Enhanced Action Buttons */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* Role-specific action buttons */}
                {watchData.shippingStatus < 3 &&
                  auth?.role === "distributor" && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          navigate("/update-shipping", {
                            state: { qrData, entityData: watchData },
                          })
                        }
                        sx={{
                          ...watchStyles.luxuryButton.contained,
                          height: "56px",
                        }}
                        startIcon={<LocalShipping />}
                      >
                        Update Heritage Journey
                      </Button>
                    </Grid>
                  )}

                {watchData.shippingStatus === 3 &&
                  !watchData.availableForSale &&
                  auth?.role === "retailer" && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          navigate("/mark-available", {
                            state: { qrData, entityData: watchData },
                          })
                        }
                        sx={{
                          ...watchStyles.luxuryButton.contained,
                          height: "56px",
                        }}
                        startIcon={<AttachMoney />}
                      >
                        Mark Available for Heritage
                      </Button>
                    </Grid>
                  )}

                {watchData.retailPrice > 0 &&
                  !watchData.sold &&
                  auth?.role === "consumer" && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          navigate("/purchase-watch", {
                            state: { qrData, watchData },
                          })
                        }
                        sx={{
                          ...watchStyles.luxuryButton.contained,
                          height: "56px",
                          background: watchColors.gradients.accent,
                        }}
                        startIcon={<Diamond />}
                      >
                        Acquire Heritage - $
                        {parseFloat(watchData.retailPrice).toFixed(2)}
                      </Button>
                    </Grid>
                  )}

                {/* Standard navigation buttons */}
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{
                      ...watchStyles.luxuryButton.outlined,
                      height: "56px",
                    }}
                  >
                    Return
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Home />}
                    onClick={handleHome}
                    sx={{
                      ...watchStyles.luxuryButton.outlined,
                      height: "56px",
                    }}
                  >
                    Heritage Dashboard
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<QrCodeScanner />}
                    onClick={handleScanAnother}
                    sx={{
                      ...watchStyles.luxuryButton.contained,
                      height: "56px",
                    }}
                  >
                    Scan Another Timepiece
                  </Button>
                </Grid>
              </Grid>

              {/* PDF Export Button - New Row */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={
                      pdfGenerating ? (
                        <CircularProgress size={20} sx={{ color: "#1a1a1a" }} />
                      ) : (
                        <PictureAsPdf />
                      )
                    }
                    onClick={generatePDF}
                    disabled={pdfGenerating}
                    sx={{
                      ...watchStyles.luxuryButton.contained,
                      height: "56px",
                      fontSize: "1.1rem",
                      background: pdfGenerating
                        ? watchColors.alpha.primary30
                        : watchColors.gradients.luxury,
                      "&:hover": {
                        background: pdfGenerating
                          ? watchColors.alpha.primary30
                          : watchColors.gradients.luxury,
                        transform: pdfGenerating ? "none" : "translateY(-2px)",
                        boxShadow: pdfGenerating
                          ? "none"
                          : `0 8px 25px ${watchColors.alpha.primary30}`,
                      },
                      "&:disabled": {
                        color: "rgba(26, 26, 26, 0.5)",
                      },
                    }}
                  >
                    {pdfGenerating
                      ? "Generating Heritage PDF..."
                      : "Save Heritage Certificate as PDF"}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ViewWatch;
