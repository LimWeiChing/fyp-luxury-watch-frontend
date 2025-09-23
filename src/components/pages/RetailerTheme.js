import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Retailer Brand Colors
export const retailerColors = {
  primary: "#e91e63",
  secondary: "#ad1457",
  accent: "#c2185b",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #e91e63 30%, #f06292 70%)",
    secondary: "linear-gradient(135deg, #ad1457 0%, #e91e63 100%)",
    accent: "linear-gradient(90deg, #c2185b 0%, #e91e63 100%)",
    premium:
      "linear-gradient(135deg, rgba(233, 30, 99, 0.08) 0%, rgba(233, 30, 99, 0.03) 100%)",
    card: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.98) 50%, rgba(20, 20, 20, 0.95) 100%)",
    boutique:
      "linear-gradient(45deg, rgba(233, 30, 99, 0.1) 0%, rgba(194, 24, 91, 0.1) 100%)",
    shipping: "linear-gradient(45deg, #e91e63 0%, #c2185b 50%, #f06292 100%)",
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(233, 30, 99, 0.05)",
    primary10: "rgba(233, 30, 99, 0.1)",
    primary15: "rgba(233, 30, 99, 0.15)",
    primary20: "rgba(233, 30, 99, 0.2)",
    primary30: "rgba(233, 30, 99, 0.3)",
    primary50: "rgba(233, 30, 99, 0.5)",
    accent10: "rgba(194, 24, 91, 0.1)",
    accent20: "rgba(194, 24, 91, 0.2)",
  },
};

export const retailerAnimations = {
  shimmer: keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  `,

  boutiqueGlow: keyframes`
    0%, 100% { 
      box-shadow: 0 0 10px rgba(233, 30, 99, 0.2);
    }
    50% { 
      box-shadow: 0 0 15px rgba(233, 30, 99, 0.4);
    }
  `,

  deliveryPulse: keyframes`
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
  `,

  fadeInUp: keyframes`
    from {
      opacity: 0;
      transform: translate3d(0, 20px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  `,

  luxuryPulse: keyframes`
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  `,

  slideInRight: keyframes`
    from {
      opacity: 0;
      transform: translate3d(20px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  `,

  diamondSparkle: keyframes`
    0%, 100% { 
      box-shadow: 
        0 0 20px rgba(233, 30, 99, 0.3),
        0 0 40px rgba(233, 30, 99, 0.2),
        inset 0 0 20px rgba(233, 30, 99, 0.1);
    }
    50% { 
      box-shadow: 
        0 0 30px rgba(233, 30, 99, 0.6),
        0 0 60px rgba(233, 30, 99, 0.4),
        inset 0 0 30px rgba(233, 30, 99, 0.2);
    }
  `,
};

export const retailerTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
  luxury: '"Cinzel", serif',
};

export const retailerStyles = {
  premiumCard: {
    background: retailerColors.gradients.card,
    backdropFilter: "blur(12px)",
    border: `1px solid ${retailerColors.alpha.primary20}`,
    borderRadius: "20px",
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px ${retailerColors.alpha.primary10},
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${retailerAnimations.fadeInUp} 0.6s ease-out`,
    willChange: "transform",
  },

  premiumCardWithShimmer: {
    background: retailerColors.gradients.card,
    backdropFilter: "blur(12px)",
    border: `1px solid ${retailerColors.alpha.primary20}`,
    borderRadius: "20px",
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px ${retailerColors.alpha.primary10},
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${retailerAnimations.fadeInUp} 0.6s ease-out`,
    willChange: "transform",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "3px",
      background: `linear-gradient(90deg, 
        transparent, 
        ${retailerColors.primary}, 
        ${retailerColors.accent}, 
        transparent
      )`,
      transform: "translateX(-100%)",
      animation: `${retailerAnimations.shimmer} 3s ease-in-out`,
      animationFillMode: "forwards",
    },
  },

  // Enhanced input styles for retailer
  styledTextField: {
    "& .MuiOutlinedInput-root": {
      background: retailerColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: retailerColors.alpha.primary50,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: retailerColors.primary,
        boxShadow: `0 0 8px ${retailerColors.alpha.primary30}`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: retailerColors.alpha.primary30,
      transition: "border-color 0.2s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.2s ease",
      "&.Mui-focused": {
        color: retailerColors.primary,
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

  // Enhanced button styles for retailer
  premiumButton: {
    contained: {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s ease",
      background: retailerColors.gradients.primary,
      color: "#ffffff",
      border: `1px solid ${retailerColors.alpha.primary30}`,
      willChange: "transform, box-shadow",
      "&:hover": {
        background: retailerColors.gradients.secondary,
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px ${retailerColors.alpha.primary30}`,
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },

    outlined: {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      border: `1px solid ${retailerColors.alpha.primary50}`,
      color: retailerColors.primary,
      background: retailerColors.alpha.primary05,
      transition: "all 0.2s ease",
      willChange: "transform, background-color",
      "&:hover": {
        background: retailerColors.alpha.primary10,
        borderColor: retailerColors.primary,
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
  },

  pageHeader: {
    textAlign: "center",
    marginBottom: "2rem",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -10,
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "2px",
      background: retailerColors.primary,
    },
  },

  priceInput: {
    "& .MuiOutlinedInput-root": {
      background: retailerColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      fontSize: "1.1rem",
      fontWeight: 600,
      transition: "all 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: retailerColors.alpha.primary50,
        boxShadow: `0 0 5px ${retailerColors.alpha.primary20}`,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: retailerColors.primary,
        boxShadow: `0 0 10px ${retailerColors.alpha.primary30}`,
      },
    },
    "& .MuiInputAdornment-root": {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: retailerColors.alpha.primary30,
      borderWidth: "2px",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: 600,
      "&.Mui-focused": {
        color: retailerColors.primary,
      },
    },
    "& .MuiFormHelperText-root": {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "0.85rem",
      marginTop: "8px",
      "&.Mui-error": {
        color: "#f44336",
      },
    },
  },

  availabilityCard: {
    background: `
      linear-gradient(135deg, 
        ${retailerColors.alpha.primary10} 0%, 
        ${retailerColors.alpha.primary05} 100%
      )
    `,
    border: `1px solid ${retailerColors.alpha.primary30}`,
    borderRadius: "16px",
    position: "relative",
    overflow: "hidden",
    animation: `${retailerAnimations.boutiqueGlow} 3s ease-in-out infinite`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: `linear-gradient(90deg, 
        ${retailerColors.primary}, 
        ${retailerColors.accent}, 
        ${retailerColors.primary}
      )`,
    },
  },

  watchInfoCard: {
    background: retailerColors.gradients.boutique,
    border: `1px solid ${retailerColors.alpha.primary20}`,
    borderRadius: "16px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 12px 30px ${retailerColors.alpha.primary20}`,
    },
  },

  statusChip: {
    delivered: {
      background: `linear-gradient(45deg, #4caf50, #66bb6a)`,
      color: "#ffffff",
      fontWeight: 600,
      border: "1px solid rgba(76, 175, 80, 0.3)",
    },
    available: {
      background: `linear-gradient(45deg, ${retailerColors.primary}, ${retailerColors.accent})`,
      color: "#ffffff",
      fontWeight: 600,
      border: `1px solid ${retailerColors.alpha.primary30}`,
    },
    sold: {
      background: `linear-gradient(45deg, #f44336, #ef5350)`,
      color: "#ffffff",
      fontWeight: 600,
      border: "1px solid rgba(244, 67, 54, 0.3)",
    },
  },

  progressIndicator: {
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "12px",
    padding: "1rem",
    border: `1px solid ${retailerColors.alpha.primary20}`,
    "& .MuiLinearProgress-root": {
      borderRadius: "8px",
      height: "8px",
      background: "rgba(255, 255, 255, 0.1)",
      "& .MuiLinearProgress-bar": {
        background: retailerColors.gradients.primary,
        borderRadius: "8px",
      },
    },
  },

  // Enhanced timeline styles adapted from distributor theme
  timelineItem: {
    background: retailerColors.alpha.primary05,
    border: `1px solid ${retailerColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    margin: "0.5rem 0",
    position: "relative",
    transition: "all 0.3s ease",
    "&:hover": {
      background: retailerColors.alpha.primary10,
      transform: "translateX(5px)",
    },
  },

  shippingProgress: {
    background: retailerColors.alpha.primary10,
    border: `1px solid ${retailerColors.alpha.primary30}`,
    borderRadius: "16px",
    padding: "2rem",
    marginTop: "1.5rem",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: retailerColors.gradients.shipping,
    },
  },
};

export const performanceConfig = {
  enableAnimations: true,
  enableHeavyEffects: false,
  respectsReducedMotion: true,
  fastAnimations: true,
  useGPUAcceleration: true,
};

export const retailerMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: retailerColors.primary,
      light: "#f06292",
      dark: "#ad1457",
    },
    secondary: {
      main: retailerColors.secondary,
      light: "#c2185b",
      dark: "#880e4f",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: retailerTypography.secondary,
    h1: {
      fontFamily: retailerTypography.primary,
      fontWeight: 700,
    },
    h2: {
      fontFamily: retailerTypography.primary,
      fontWeight: 700,
    },
    h3: {
      fontFamily: retailerTypography.primary,
      fontWeight: 700,
    },
    h4: {
      fontFamily: retailerTypography.accent,
      fontWeight: 600,
    },
    h5: {
      fontFamily: retailerTypography.accent,
      fontWeight: 600,
    },
    h6: {
      fontFamily: retailerTypography.accent,
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          },
        },
      },
    },
    MuiTimeline: {
      styleOverrides: {
        root: {
          "& .MuiTimelineDot-root": {
            boxShadow: `0 0 10px ${retailerColors.alpha.primary30}`,
          },
        },
      },
    },
  },
});

export const retailerUtils = {
  formatAddress: (address, short = true) => {
    if (!address) return "Not connected";
    if (short) {
      return `${address.substring(0, 42)}`;
    }
    return address;
  },

  formatTimestamp: (timestamp) => {
    if (!timestamp || timestamp === "0" || timestamp === "N/A") {
      return "N/A";
    }

    try {
      let timestampMs;
      if (typeof timestamp === "string" && timestamp.includes(",")) {
        return timestamp;
      }

      const timestampNum = parseInt(timestamp);
      if (isNaN(timestampNum)) {
        return timestamp;
      }

      if (timestampNum.toString().length === 10) {
        timestampMs = timestampNum * 1000;
      } else if (timestampNum.toString().length === 13) {
        timestampMs = timestampNum;
      } else {
        return timestamp;
      }

      const dayjs = require("dayjs");
      const date = dayjs(timestampMs);
      return date.isValid() ? date.format("MMMM D, YYYY h:mm:ss A") : timestamp;
    } catch (error) {
      console.warn("Error formatting timestamp:", timestamp, error);
      return timestamp;
    }
  },

  formatPrice: (price, currency = "USD") => {
    if (!price || isNaN(price)) return "$0.00";
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice);
  },

  validatePrice: (price) => {
    if (!price) return { valid: false, message: "" };

    const priceValue = parseFloat(price);
    if (isNaN(priceValue)) {
      return { valid: false, message: "Please enter a valid number" };
    }
    if (priceValue <= 0) {
      return { valid: false, message: "Price must be greater than 0" };
    }
    if (priceValue > 1000000) {
      return { valid: false, message: "Price seems unreasonably high" };
    }

    return {
      valid: true,
      message: `Will be listed at ${retailerUtils.formatPrice(priceValue)}`,
    };
  },

  getShippingStatusColor: (status) => {
    const statusValue = parseInt(status);
    switch (statusValue) {
      case 0:
        return "#6b7280"; // Not shipped - gray
      case 1:
        return "#f59e0b"; // Shipped - amber
      case 2:
        return "#3b82f6"; // In transit - blue
      case 3:
        return "#10b981"; // Delivered - green
      default:
        return "#6b7280";
    }
  },

  getShippingStatusIcon: (status) => {
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
  },

  getShippingStatusText: (status) => {
    const statusValue = parseInt(status);
    switch (statusValue) {
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

  getAvailabilityIcon: (status) => {
    if (status === true) return "🏪";
    return "📦";
  },

  getSaleIcon: (sold) => {
    if (sold === true) return "💸";
    return "🏷️";
  },

  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  getPerformanceStyles: (baseStyles, animatedStyles) => {
    if (
      performanceConfig.respectsReducedMotion &&
      retailerUtils.prefersReducedMotion()
    ) {
      return baseStyles;
    }
    return performanceConfig.enableAnimations ? animatedStyles : baseStyles;
  },
};

// Constants
export const retailerConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",
  GEOCODE_API_KEY: "AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0",

  SHIPPING_STATUSES: [
    { value: 0, label: "Not Shipped", color: "#6b7280" },
    { value: 1, label: "Shipped", color: "#f59e0b" },
    { value: 2, label: "In Transit", color: "#3b82f6" },
    { value: 3, label: "Delivered", color: "#10b981" },
  ],

  PRICE_RANGES: [
    { min: 0, max: 5000, label: "Entry Luxury" },
    { min: 5000, max: 25000, label: "Premium" },
    { min: 25000, max: 100000, label: "High-End" },
    { min: 100000, max: Infinity, label: "Ultra Luxury" },
  ],

  AVAILABILITY_STEPS: [
    "Watch Verification",
    "Price Setting",
    "Blockchain Recording",
    "Boutique Listing",
  ],
};

export default {
  colors: retailerColors,
  animations: retailerAnimations,
  typography: retailerTypography,
  styles: retailerStyles,
  theme: retailerMuiTheme,
  utils: retailerUtils,
  constants: retailerConstants,
  performance: performanceConfig,
};
