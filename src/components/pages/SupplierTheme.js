import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Supplier Brand Colors (unchanged)
export const supplierColors = {
  primary: "#4caf50",
  secondary: "#8bc34a",
  accent: "#00e676",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #4caf50 30%, #66bb6a 70%)",
    secondary: "linear-gradient(135deg, #8bc34a 0%, #4caf50 100%)",
    accent: "linear-gradient(90deg, #00e676 0%, #4caf50 100%)",
    premium:
      "linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.03) 100%)",
    card: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.98) 50%, rgba(20, 20, 20, 0.95) 100%)",
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(76, 175, 80, 0.05)",
    primary10: "rgba(76, 175, 80, 0.1)",
    primary20: "rgba(76, 175, 80, 0.2)",
    primary30: "rgba(76, 175, 80, 0.3)",
    primary50: "rgba(76, 175, 80, 0.5)",
    accent10: "rgba(0, 230, 118, 0.1)",
    accent20: "rgba(0, 230, 118, 0.2)",
  },
};

export const supplierAnimations = {
  shimmer: keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  `,

  softGlow: keyframes`
    0%, 100% { 
      box-shadow: 0 0 10px rgba(76, 175, 80, 0.2);
    }
    50% { 
      box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
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

  subtlePulse: keyframes`
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
};

export const supplierTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
};

export const supplierStyles = {
  premiumCard: {
    background: supplierColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${supplierColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${supplierColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${supplierAnimations.fadeInUp} 0.4s ease-out`,
    willChange: "transform",
  },

  premiumCardWithShimmer: {
    background: supplierColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${supplierColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${supplierColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${supplierAnimations.fadeInUp} 0.4s ease-out`,
    willChange: "transform",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "2px",
      background: `linear-gradient(90deg, 
        transparent, 
        ${supplierColors.primary}, 
        ${supplierColors.accent}, 
        transparent
      )`,
      transform: "translateX(-100%)",
      animation: `${supplierAnimations.shimmer} 4s ease-in-out`, // Single run, slower
      animationFillMode: "forwards",
    },
  },

  // Optimized input styles
  styledTextField: {
    "& .MuiOutlinedInput-root": {
      background: supplierColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease", // Faster transitions
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: supplierColors.alpha.primary50,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: supplierColors.primary,
        boxShadow: `0 0 5px ${supplierColors.alpha.primary30}`, // Reduced glow
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: supplierColors.alpha.primary30,
      transition: "border-color 0.2s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.2s ease",
      "&.Mui-focused": {
        color: supplierColors.primary,
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
      background: supplierColors.gradients.primary,
      color: "#ffffff",
      border: `1px solid ${supplierColors.alpha.primary30}`,
      willChange: "transform, box-shadow",
      "&:hover": {
        background: supplierColors.gradients.secondary,
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${supplierColors.alpha.primary30}`,
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
      border: `1px solid ${supplierColors.alpha.primary50}`,
      color: supplierColors.primary,
      background: supplierColors.alpha.primary05,
      transition: "all 0.2s ease",
      willChange: "transform, background-color",
      "&:hover": {
        background: supplierColors.alpha.primary10,
        borderColor: supplierColors.primary,
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
      background: supplierColors.primary,
    },
  },

  imageUploadArea: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? supplierColors.primary : supplierColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? supplierColors.alpha.primary05
      : supplierColors.alpha.primary05,
    cursor: "pointer",
    transition: "all 0.2s ease", // Faster transition
    position: "relative",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    willChange: "transform, border-color, background-color",
    "&:hover": {
      borderColor: supplierColors.primary,
      background: supplierColors.alpha.primary10,
      transform: "translateY(-1px)",
    },

    ...(hasImage && {
      boxShadow: `0 0 8px ${supplierColors.alpha.primary30}`,
    }),
  }),

  imageUploadAreaWithAnimation: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? supplierColors.primary : supplierColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? supplierColors.alpha.primary05
      : supplierColors.alpha.primary05,
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    willChange: "transform, border-color",
    "&:hover": {
      borderColor: supplierColors.primary,
      background: supplierColors.alpha.primary10,
      transform: "translateY(-1px)",
    },
    ...(hasImage && {
      animation: `${supplierAnimations.softGlow} 3s ease-in-out 1`, // Single run
    }),
  }),

  infoCard: {
    background: supplierColors.alpha.primary10,
    border: `1px solid ${supplierColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    color: "#ffffff",
    marginBottom: "1rem",
    transition: "background-color 0.2s ease",
    "&:hover": {
      background: supplierColors.alpha.primary15,
    },
  },

  qrSection: {
    background: supplierColors.gradients.premium,
    border: `1px solid ${supplierColors.alpha.primary30}`,
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
      background: supplierColors.primary,
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

export const supplierMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: supplierColors.primary,
      light: "#66bb6a",
      dark: "#2e7d32",
    },
    secondary: {
      main: supplierColors.secondary,
      light: "#aed581",
      dark: "#689f38",
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
    fontFamily: supplierTypography.secondary,
    h1: {
      fontFamily: supplierTypography.primary,
      fontWeight: 700,
    },
    h2: {
      fontFamily: supplierTypography.primary,
      fontWeight: 700,
    },
    h3: {
      fontFamily: supplierTypography.primary,
      fontWeight: 700,
    },
    h4: {
      fontFamily: supplierTypography.accent,
      fontWeight: 600,
    },
    h5: {
      fontFamily: supplierTypography.accent,
      fontWeight: 600,
    },
    h6: {
      fontFamily: supplierTypography.accent,
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
          transition: "all 0.2s ease", // Faster transitions globally
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
  },
});

export const supplierUtils = {
  formatAddress: (address, short = true) => {
    if (!address) return "Not connected";
    if (short) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return address;
  },

  generateMaterialId: (prefix = "RM") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  },

  getMaterialIcon: (materialType) => {
    const iconMap = {
      "Gold 18K": "💛",
      "Gold 24K": "🟨",
      Platinum: "⚪",
      Titanium: "🔘",
      Diamond: "💎",
      Ruby: "🔴",
      "Sapphire Crystal": "🔵",
      Silver: "⚫",
      Leather: "🟤",
      "Carbon Fiber": "⚫",
      Default: "💠",
    };
    return iconMap[materialType] || iconMap.Default;
  },

  getCountryFlag: (country) => {
    const flagMap = {
      Switzerland: "🇨🇭",
      Germany: "🇩🇪",
      Japan: "🇯🇵",
      Italy: "🇮🇹",
      France: "🇫🇷",
      "United Kingdom": "🇬🇧",
      "United States": "🇺🇸",
      Austria: "🇦🇹",
      Belgium: "🇧🇪",
      Denmark: "🇩🇰",
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
      supplierUtils.prefersReducedMotion()
    ) {
      return baseStyles;
    }
    return performanceConfig.enableAnimations ? animatedStyles : baseStyles;
  },
};

// Constants (unchanged)
export const supplierConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",
  GEOCODE_API_KEY: "AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0",

  MATERIAL_TYPES: [
    "Gold 18K",
    "Gold 24K",
    "Platinum",
    "Titanium",
    "Stainless Steel",
    "Leather Premium",
    "Sapphire Crystal",
    "Diamond",
    "Ruby",
    "Silver 925",
    "Carbon Fiber",
    "Ceramic",
    "Mother of Pearl",
    "Custom",
  ],

  ORIGIN_COUNTRIES: [
    "Switzerland",
    "Germany",
    "Japan",
    "Italy",
    "France",
    "United Kingdom",
    "United States",
    "Austria",
    "Belgium",
    "Denmark",
    "Custom",
  ],

  REGISTRATION_STEPS: [
    "Material Details",
    "Location & Image",
    "Blockchain Registration",
    "Completion",
  ],
};

export default {
  colors: supplierColors,
  animations: supplierAnimations,
  typography: supplierTypography,
  styles: supplierStyles,
  theme: supplierMuiTheme,
  utils: supplierUtils,
  constants: supplierConstants,
  performance: performanceConfig,
};
