import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Distributor Brand Colors (Cyan/Teal Theme)
export const distributorColors = {
  primary: "#00bcd4",
  secondary: "#26c6da",
  accent: "#00acc1",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #00bcd4 30%, #26c6da 70%)",
    secondary: "linear-gradient(135deg, #26c6da 0%, #00bcd4 100%)",
    accent: "linear-gradient(90deg, #00acc1 0%, #00bcd4 100%)",
    premium:
      "linear-gradient(135deg, rgba(0, 188, 212, 0.08) 0%, rgba(0, 188, 212, 0.03) 100%)",
    card: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.98) 50%, rgba(20, 20, 20, 0.95) 100%)",
    shipping: "linear-gradient(45deg, #00bcd4 0%, #00acc1 50%, #26c6da 100%)",
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(0, 188, 212, 0.05)",
    primary10: "rgba(0, 188, 212, 0.1)",
    primary20: "rgba(0, 188, 212, 0.2)",
    primary30: "rgba(0, 188, 212, 0.3)",
    primary50: "rgba(0, 188, 212, 0.5)",
    accent10: "rgba(0, 172, 193, 0.1)",
    accent20: "rgba(0, 172, 193, 0.2)",
  },
};

export const distributorAnimations = {
  shimmer: keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  `,

  shippingGlow: keyframes`
    0%, 100% { 
      box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
    }
    50% { 
      box-shadow: 0 0 25px rgba(0, 188, 212, 0.6);
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

  truckMove: keyframes`
    0% {
      transform: translateX(-10px);
    }
    50% {
      transform: translateX(10px);
    }
    100% {
      transform: translateX(-10px);
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

  statusPulse: keyframes`
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  `,
};

export const distributorTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
};

export const distributorStyles = {
  premiumCard: {
    background: distributorColors.gradients.card,
    backdropFilter: "blur(20px)",
    border: `1px solid ${distributorColors.alpha.primary20}`,
    borderRadius: "20px",
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px ${distributorColors.alpha.primary10},
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${distributorAnimations.fadeInUp} 0.8s ease-out`,
    willChange: "transform",
  },

  premiumCardWithShimmer: {
    background: distributorColors.gradients.card,
    backdropFilter: "blur(20px)",
    border: `1px solid ${distributorColors.alpha.primary20}`,
    borderRadius: "20px",
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px ${distributorColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${distributorAnimations.fadeInUp} 0.8s ease-out`,
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
        ${distributorColors.primary}, 
        ${distributorColors.accent}, 
        transparent
      )`,
      transform: "translateX(-100%)",
      animation: `${distributorAnimations.shimmer} 3s ease-in-out`,
      animationFillMode: "forwards",
    },
  },

  // Enhanced input styles for shipping forms
  styledTextField: {
    "& .MuiOutlinedInput-root": {
      background: distributorColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
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
      transition: "border-color 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.3s ease",
      "&.Mui-focused": {
        color: distributorColors.primary,
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

  // Enhanced button styles for shipping actions
  premiumButton: {
    contained: {
      borderRadius: "12px",
      padding: "12px 32px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      background: distributorColors.gradients.primary,
      color: "#ffffff",
      border: `1px solid ${distributorColors.alpha.primary30}`,
      willChange: "transform, box-shadow",
      "&:hover": {
        background: distributorColors.gradients.shipping,
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px ${distributorColors.alpha.primary30}`,
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },

    outlined: {
      borderRadius: "12px",
      padding: "12px 32px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      border: `1px solid ${distributorColors.alpha.primary50}`,
      color: distributorColors.primary,
      background: distributorColors.alpha.primary05,
      transition: "all 0.3s ease",
      willChange: "transform, background-color",
      "&:hover": {
        background: distributorColors.alpha.primary10,
        borderColor: distributorColors.primary,
        transform: "translateY(-2px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },

    shipping: {
      borderRadius: "12px",
      padding: "14px 36px",
      fontWeight: 700,
      textTransform: "none",
      fontSize: "1.1rem",
      background: distributorColors.gradients.shipping,
      color: "#ffffff",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-3px) scale(1.02)",
        boxShadow: `0 12px 30px ${distributorColors.alpha.primary40}`,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        transition: "left 0.5s ease",
      },
      "&:hover::before": {
        left: "100%",
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
      height: "3px",
      background: distributorColors.gradients.primary,
      borderRadius: "2px",
    },
  },

  shippingStatusCard: (status) => ({
    background: distributorColors.alpha.primary10,
    border: `1px solid ${distributorColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1.5rem",
    color: "#ffffff",
    marginBottom: "1rem",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      background: distributorColors.alpha.primary15,
      transform: "translateY(-2px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "4px",
      height: "100%",
      background: distributorColors.primary,
    },
  }),

  timelineItem: {
    background: distributorColors.alpha.primary05,
    border: `1px solid ${distributorColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    margin: "0.5rem 0",
    position: "relative",
    transition: "all 0.3s ease",
    "&:hover": {
      background: distributorColors.alpha.primary10,
      transform: "translateX(5px)",
    },
  },

  shippingProgress: {
    background: distributorColors.alpha.primary10,
    border: `1px solid ${distributorColors.alpha.primary30}`,
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
      background: distributorColors.gradients.shipping,
    },
  },

  mapSection: {
    background: distributorColors.gradients.premium,
    border: `1px solid ${distributorColors.alpha.primary30}`,
    borderRadius: "16px",
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
      background: distributorColors.gradients.primary,
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

export const distributorMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: distributorColors.primary,
      light: "#4dd0e1",
      dark: "#0097a7",
    },
    secondary: {
      main: distributorColors.secondary,
      light: "#4dd0e1",
      dark: "#00acc1",
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
    fontFamily: distributorTypography.secondary,
    h1: {
      fontFamily: distributorTypography.primary,
      fontWeight: 700,
    },
    h2: {
      fontFamily: distributorTypography.primary,
      fontWeight: 700,
    },
    h3: {
      fontFamily: distributorTypography.primary,
      fontWeight: 700,
    },
    h4: {
      fontFamily: distributorTypography.accent,
      fontWeight: 600,
    },
    h5: {
      fontFamily: distributorTypography.accent,
      fontWeight: 600,
    },
    h6: {
      fontFamily: distributorTypography.accent,
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
          transition: "all 0.3s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          },
        },
      },
    },
    MuiTimeline: {
      styleOverrides: {
        root: {
          "& .MuiTimelineDot-root": {
            boxShadow: `0 0 10px ${distributorColors.alpha.primary30}`,
          },
        },
      },
    },
  },
});

export const distributorUtils = {
  formatAddress: (address, short = true) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      return "Not connected";
    }
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

  generateShippingId: (prefix = "SH") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  },

  getCountryFlag: (country) => {
    const flagMap = {
      Malaysia: "🇲🇾",
      Singapore: "🇸🇬",
      Thailand: "🇹🇭",
      Indonesia: "🇮🇩",
      Philippines: "🇵🇭",
      Vietnam: "🇻🇳",
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Japan: "🇯🇵",
      China: "🇨🇳",
      Australia: "🇦🇺",
      Canada: "🇨🇦",
      Default: "🌍",
    };
    return flagMap[country] || flagMap.Default;
  },

  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  getPerformanceStyles: (baseStyles, animatedStyles) => {
    if (
      performanceConfig.respectsReducedMotion &&
      distributorUtils.prefersReducedMotion()
    ) {
      return baseStyles;
    }
    return performanceConfig.enableAnimations ? animatedStyles : baseStyles;
  },
};

// Constants
export const distributorConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",
  GEOCODE_API_KEY: "AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0",

  SHIPPING_STATUSES: [
    {
      label: "NOT SHIPPED",
      value: 0,
      description: "Package awaiting shipment",
      color: "#6b7280",
      icon: "📦",
    },
    {
      label: "SHIPPED",
      value: 1,
      description: "Package has been shipped from origin",
      color: "#f59e0b",
      icon: "🚚",
    },
    {
      label: "IN TRANSIT",
      value: 2,
      description: "Package is in transit to destination",
      color: "#3b82f6",
      icon: "🚛",
    },
    {
      label: "DELIVERED",
      value: 3,
      description: "Package has been delivered",
      color: "#10b981",
      icon: "✅",
    },
  ],

  SHIPPING_REGIONS: [
    "Asia Pacific",
    "North America",
    "Europe",
    "Middle East",
    "Africa",
    "South America",
    "Oceania",
    "Global",
  ],

  UPDATE_STEPS: [
    "Scan Watch QR",
    "Verify Details",
    "Update Status",
    "Confirm Location",
    "Blockchain Record",
  ],
};

export default {
  colors: distributorColors,
  animations: distributorAnimations,
  typography: distributorTypography,
  styles: distributorStyles,
  theme: distributorMuiTheme,
  utils: distributorUtils,
  constants: distributorConstants,
  performance: performanceConfig,
};
