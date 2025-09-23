import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Consumer Brand Colors (Premium Orange Theme)
export const consumerColors = {
  primary: "#ff6f00",
  secondary: "#ff8f00",
  accent: "#ffab00",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Simplified gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #ff6f00 30%, #ff8f00 70%)",
    secondary: "linear-gradient(135deg, #ff8f00 0%, #ff6f00 100%)",
    accent: "linear-gradient(90deg, #ffab00 0%, #ff6f00 100%)",
    card: "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
    gold: "linear-gradient(45deg, #ffa000 0%, #ff6f00 50%, #ffa000 100%)",
    // PERFORMANCE OPTIMIZED: Simplified gradients
    hero: "linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)",
    cardHover: "rgba(255, 111, 0, 0.1)",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b0f 100%)",
    overlay: "rgba(255, 111, 0, 0.1)", // Simplified single overlay
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(255, 111, 0, 0.05)",
    primary10: "rgba(255, 111, 0, 0.1)",
    primary15: "rgba(255, 111, 0, 0.15)",
    primary20: "rgba(255, 111, 0, 0.2)",
    primary30: "rgba(255, 111, 0, 0.3)",
    primary50: "rgba(255, 111, 0, 0.5)",
    accent10: "rgba(255, 171, 0, 0.1)",
    accent20: "rgba(255, 171, 0, 0.2)",
    gold10: "rgba(255, 160, 0, 0.1)",
    gold20: "rgba(255, 160, 0, 0.2)",
    white10: "rgba(255, 255, 255, 0.1)",
    white15: "rgba(255, 255, 255, 0.15)",
    white20: "rgba(255, 255, 255, 0.2)",
    white90: "rgba(255, 255, 255, 0.9)",
    white95: "rgba(255, 255, 255, 0.95)",
  },
};

// PERFORMANCE OPTIMIZED: Minimal animations for better performance
export const consumerAnimations = {
  fadeInUp: keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,

  // Removed: simpleGlow, float, pulseGlow - these cause performance issues
};

export const consumerTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
  luxury: '"Cormorant Garamond", serif',
};

// OPTIMIZED: Simplified styles with better performance
export const consumerStyles = {
  // PERFORMANCE OPTIMIZED: Simplified card styles
  optimizedCard: {
    background: consumerColors.gradients.card,
    border: `1px solid ${consumerColors.alpha.primary20}`,
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // Simplified shadow
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.2s ease", // Single property
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },

  // PERFORMANCE OPTIMIZED: Simplified hero card
  heroCard: {
    background: consumerColors.alpha.white15,
    borderRadius: "12px",
    border: `1px solid ${consumerColors.alpha.white20}`,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Simplified shadow
    position: "relative",
    overflow: "hidden",
  },

  // PERFORMANCE OPTIMIZED: Simplified watch card
  watchCard: {
    background: consumerColors.alpha.white95,
    borderRadius: "12px",
    border: `1px solid ${consumerColors.alpha.white20}`,
    transition: "transform 0.2s ease", // Single property only
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "translateY(-4px)", // Reduced movement
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)", // Lighter shadow
    },
  },

  // PERFORMANCE OPTIMIZED: Simplified empty state
  emptyStateCard: {
    background: consumerColors.alpha.white95,
    borderRadius: "12px",
    border: `1px solid ${consumerColors.alpha.white20}`,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    position: "relative",
    overflow: "hidden",
  },

  // Simplified input styles
  efficientTextField: {
    "& .MuiOutlinedInput-root": {
      background: consumerColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.2s ease", // Single property
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
  },

  // Optimized button styles
  optimizedButton: {
    contained: {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      transition: "all 0.2s ease", // Faster transition
      background: consumerColors.gradients.primary,
      color: "#ffffff",
      "&:hover": {
        background: consumerColors.gradients.secondary,
        transform: "translateY(-1px)", // Reduced movement
      },
    },

    outlined: {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      border: `1px solid ${consumerColors.alpha.primary50}`,
      color: consumerColors.primary,
      background: consumerColors.alpha.primary05,
      transition: "all 0.2s ease",
      "&:hover": {
        background: consumerColors.alpha.primary15,
        borderColor: consumerColors.primary,
        transform: "translateY(-1px)",
      },
    },

    luxury: {
      borderRadius: "12px",
      padding: "16px 28px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1.1rem",
      background: consumerColors.gradients.gold,
      color: "#ffffff",
      border: `2px solid ${consumerColors.accent}`,
      // Removed animation for better performance
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)", // Reduced movement
      },
    },

    // PERFORMANCE OPTIMIZED: Collection button
    collection: {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      background: consumerColors.gradients.primary,
      color: "#ffffff",
      boxShadow: "0 4px 8px rgba(255, 111, 0, 0.2)", // Simplified shadow
      transition: "transform 0.2s ease", // Single property
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 6px 12px rgba(255, 111, 0, 0.3)", // Lighter shadow
      },
    },
  },

  // Simplified header styles
  pageHeader: {
    textAlign: "center",
    marginBottom: "2rem",
    animation: `${consumerAnimations.fadeInUp} 0.8s ease-out`,
  },

  // Simplified price display
  priceDisplay: {
    background: consumerColors.gradients.gold,
    border: `2px solid ${consumerColors.accent}`,
    borderRadius: "16px",
    padding: "1.5rem",
    textAlign: "center",
    // Removed heavy animations and effects
  },

  // PERFORMANCE OPTIMIZED: Simplified status chips
  statusChip: {
    available: {
      background: consumerColors.gradients.primary,
      color: "#ffffff",
      fontWeight: 600,
      // Removed heavy shadow
    },
    sold: {
      background: "linear-gradient(45deg, #757575 30%, #424242 70%)",
      color: "#ffffff",
      fontWeight: 600,
      // Removed heavy shadow
    },
    owner: {
      background: consumerColors.gradients.gold,
      color: "#000000",
      fontWeight: 700,
      // Removed heavy shadow
    },
    verified: {
      background: "linear-gradient(45deg, #10b981, #059669)",
      color: "#ffffff",
      fontWeight: 600,
      // Removed heavy shadow
    },
    security: {
      background: consumerColors.gradients.primary,
      color: "#ffffff",
      fontWeight: 600,
      // Removed heavy shadow
    },
    aiAnalyzed: {
      background: "linear-gradient(45deg, #ff6f00, #ffab00)",
      color: "#ffffff",
      fontWeight: 600,
      // Removed heavy shadow
    },
  },

  // Simplified image styles
  watchImage: {
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", // Simplified shadow
    border: `2px solid ${consumerColors.alpha.primary30}`,
    transition: "transform 0.3s ease", // Single property
    "&:hover": {
      transform: "scale(1.02)",
    },
  },

  // Simplified info card
  infoCard: {
    background: consumerColors.alpha.primary10,
    border: `1px solid ${consumerColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1.5rem",
    color: "#ffffff",
    marginBottom: "1.5rem",
    transition: "transform 0.2s ease", // Simplified
    "&:hover": {
      transform: "translateY(-1px)",
    },
  },

  // PERFORMANCE OPTIMIZED: Collection page styles
  collectionBackground: {
    minHeight: "100vh",
    background: consumerColors.gradients.background,
    position: "relative",
  },

  collectionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: consumerColors.gradients.overlay,
    // Removed animation for better performance
  },

  // PERFORMANCE OPTIMIZED: Statistics cards
  statsCard: {
    background: consumerColors.alpha.white10,
    borderRadius: "12px",
    border: `1px solid ${consumerColors.alpha.white20}`,
    transition: "transform 0.2s ease", // Single property
    "&:hover": {
      transform: "translateY(-2px)", // Reduced movement
    },
  },

  // Simplified success card
  successCard: {
    background: `linear-gradient(135deg, 
      ${consumerColors.alpha.primary10} 0%, 
      rgba(76, 175, 80, 0.1) 100%
    )`,
    border: `2px solid ${consumerColors.primary}`,
    borderRadius: "16px",
  },

  // Simplified stepper
  stepperSection: {
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
  },

  // Dialog styles
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: "16px",
      background: consumerColors.alpha.white95,
      backdropFilter: "blur(20px)",
      border: `1px solid ${consumerColors.alpha.white20}`,
    },
  },
};

// PERFORMANCE OPTIMIZED: Aggressive performance configuration
export const performanceConfig = {
  enableAnimations: false, // Disabled for better performance
  enableHeavyEffects: false,
  respectsReducedMotion: true,
  fastAnimations: true,
  useGPUAcceleration: false,
  maxAnimationDuration: 200, // Much faster
  disableBackdropFilters: true, // New flag to disable heavy blur effects
  simplifiedShadows: true, // Use simpler shadows
  reducedTransitions: true, // Minimize transition effects
};

export const consumerMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: consumerColors.primary,
      light: "#ffa040",
      dark: "#e65100",
    },
    secondary: {
      main: consumerColors.secondary,
      light: "#ffb74d",
      dark: "#f57c00",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    success: {
      main: consumerColors.success,
    },
    warning: {
      main: consumerColors.warning,
    },
    error: {
      main: consumerColors.error,
    },
    info: {
      main: consumerColors.info,
    },
  },
  typography: {
    fontFamily: consumerTypography.secondary,
    h1: { fontFamily: consumerTypography.luxury, fontWeight: 700 },
    h2: { fontFamily: consumerTypography.luxury, fontWeight: 700 },
    h3: { fontFamily: consumerTypography.primary, fontWeight: 700 },
    h4: { fontFamily: consumerTypography.accent, fontWeight: 600 },
    h5: { fontFamily: consumerTypography.accent, fontWeight: 600 },
    h6: { fontFamily: consumerTypography.accent, fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease", // Faster transitions
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          transition: "transform 0.2s ease", // Simplified
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "border-color 0.2s ease", // Single property
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 600,
        },
      },
    },
  },
});

export const consumerUtils = {
  formatAddress: (address, short = true) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      return "Not connected";
    }
    if (short) {
      return `${address.substring(0, 42)}`;
    }
    return address;
  },

  formatPrice: (price) => {
    if (!price || price <= 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  },

  formatTimestamp: (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    try {
      const timestampMs =
        timestamp.toString().length === 10
          ? parseInt(timestamp) * 1000
          : parseInt(timestamp);

      const date = new Date(timestampMs);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
    } catch {
      return "Invalid Date";
    }
  },

  // Enhanced formatting for collection view
  formatDateShort: (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  },

  normalizeAddress: (address) => {
    if (!address) return "";
    return address.toLowerCase().trim();
  },

  getWatchIcon: (status) => {
    const iconMap = {
      available: "🛒",
      sold: "✅",
      owned: "🏆",
      certified: "💎",
      luxury: "⌚",
      premium: "🏆",
      default: "⚡",
    };
    return iconMap[status] || iconMap.default;
  },

  getStatusColor: (status) => {
    const colorMap = {
      available: consumerColors.primary,
      sold: "#757575",
      owned: consumerColors.accent,
      certified: "#4caf50",
      pending: "#ff9800",
      error: "#f44336",
    };
    return colorMap[status] || consumerColors.primary;
  },

  getShippingStatusText: (status) => {
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
  },

  getShippingStatusColor: (status) => {
    switch (parseInt(status)) {
      case 0:
        return "default";
      case 1:
        return "info";
      case 2:
        return "warning";
      case 3:
        return "success";
      default:
        return "default";
    }
  },

  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  // OPTIMIZED: Simplified performance utility
  getPerformanceStyles: (baseStyles) => {
    // Always return simplified styles for better performance
    return baseStyles;
  },

  generateTransactionId: () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN-${timestamp}-${random}`;
  },

  // Month range generator for price charts
  generateMonthRange: () => {
    const currentDate = new Date();
    const months = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      months.push(`${monthName} ${year}`);
    }

    return months;
  },
};

// Constants
export const consumerConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",

  PURCHASE_STEPS: [
    "Connect Wallet",
    "Verify Watch",
    "Confirm Purchase",
    "Transfer Ownership",
    "Collection Updated",
  ],

  STATUS_MESSAGES: {
    connecting: "Connecting to MetaMask...",
    verifying: "Verifying watch authenticity...",
    processing: "Processing ownership transfer...",
    updating: "Updating blockchain records...",
    complete: "Ownership transfer complete!",
  },

  WATCH_CONDITIONS: {
    available: "Available for Purchase",
    sold: "Already Sold",
    owned: "You Own This Watch",
    unavailable: "Not Available",
    noPrice: "Price Not Set",
  },

  // Collection view constants
  COLLECTION_STATS_LABELS: {
    totalWatches: "Owned Watches",
    collectionValue: "Collection Value",
    aiAnalyzed: "AI Analyzed",
    avgAiPrice: "Avg AI Price",
  },
};

export default {
  colors: consumerColors,
  animations: consumerAnimations,
  typography: consumerTypography,
  styles: consumerStyles,
  theme: consumerMuiTheme,
  utils: consumerUtils,
  constants: consumerConstants,
  performance: performanceConfig,
};
