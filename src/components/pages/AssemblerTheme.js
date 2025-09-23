import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Assembler Brand Colors
export const assemblerColors = {
  primary: "#673ab7",
  secondary: "#9c27b0",
  accent: "#e91e63",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #673ab7 30%, #9c27b0 70%)",
    secondary: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
    accent: "linear-gradient(90deg, #e91e63 0%, #673ab7 100%)",
    premium:
      "linear-gradient(135deg, rgba(103, 58, 183, 0.08) 0%, rgba(103, 58, 183, 0.03) 100%)",
    card: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.98) 50%, rgba(20, 20, 20, 0.95) 100%)",
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(103, 58, 183, 0.05)",
    primary10: "rgba(103, 58, 183, 0.1)",
    primary15: "rgba(103, 58, 183, 0.15)",
    primary20: "rgba(103, 58, 183, 0.2)",
    primary30: "rgba(103, 58, 183, 0.3)",
    primary50: "rgba(103, 58, 183, 0.5)",
    accent10: "rgba(233, 30, 99, 0.1)",
    accent20: "rgba(233, 30, 99, 0.2)",
  },
};

export const assemblerAnimations = {
  shimmer: keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  `,

  craftGlow: keyframes`
    0%, 100% { 
      box-shadow: 0 0 10px rgba(103, 58, 183, 0.2);
    }
    50% { 
      box-shadow: 0 0 15px rgba(103, 58, 183, 0.4);
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

  assemblyPulse: keyframes`
    0%, 100% {
      border-color: rgba(103, 58, 183, 0.3);
      box-shadow: 0 0 10px rgba(103, 58, 183, 0.2);
    }
    50% {
      border-color: rgba(103, 58, 183, 0.6);
      box-shadow: 0 0 20px rgba(103, 58, 183, 0.4);
    }
  `,
};

export const assemblerTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
};

export const assemblerStyles = {
  premiumCard: {
    background: assemblerColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${assemblerColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${assemblerColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${assemblerAnimations.fadeInUp} 0.4s ease-out`,
    willChange: "transform",
  },

  premiumCardWithShimmer: {
    background: assemblerColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${assemblerColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${assemblerColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${assemblerAnimations.fadeInUp} 0.4s ease-out`,
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
        ${assemblerColors.primary}, 
        ${assemblerColors.accent}, 
        transparent
      )`,
      transform: "translateX(-100%)",
      animation: `${assemblerAnimations.shimmer} 4s ease-in-out`,
      animationFillMode: "forwards",
    },
  },

  styledTextField: {
    "& .MuiOutlinedInput-root": {
      background: assemblerColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: assemblerColors.alpha.primary50,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: assemblerColors.primary,
        boxShadow: `0 0 5px ${assemblerColors.alpha.primary30}`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: assemblerColors.alpha.primary30,
      transition: "border-color 0.2s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.2s ease",
      "&.Mui-focused": {
        color: assemblerColors.primary,
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
      background: assemblerColors.gradients.primary,
      color: "#ffffff",
      border: `1px solid ${assemblerColors.alpha.primary30}`,
      willChange: "transform, box-shadow",
      "&:hover": {
        background: assemblerColors.gradients.secondary,
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${assemblerColors.alpha.primary30}`,
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
      border: `1px solid ${assemblerColors.alpha.primary50}`,
      color: assemblerColors.primary,
      background: assemblerColors.alpha.primary05,
      transition: "all 0.2s ease",
      willChange: "transform, background-color",
      "&:hover": {
        background: assemblerColors.alpha.primary10,
        borderColor: assemblerColors.primary,
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
      background: assemblerColors.primary,
    },
  },

  imageUploadArea: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? assemblerColors.primary : assemblerColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? assemblerColors.alpha.primary05
      : assemblerColors.alpha.primary05,
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    willChange: "transform, border-color, background-color",
    "&:hover": {
      borderColor: assemblerColors.primary,
      background: assemblerColors.alpha.primary10,
      transform: "translateY(-1px)",
    },

    ...(hasImage && {
      boxShadow: `0 0 8px ${assemblerColors.alpha.primary30}`,
    }),
  }),

  componentCard: {
    background: assemblerColors.gradients.card,
    border: `1px solid ${assemblerColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2)`,
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 8px 25px rgba(103, 58, 183, 0.3)`,
      borderColor: assemblerColors.primary,
    },
  },

  progressSection: {
    background: assemblerColors.alpha.primary10,
    border: `1px solid ${assemblerColors.alpha.primary20}`,
    borderRadius: "16px",
    padding: "1.5rem",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: assemblerColors.gradients.primary,
      borderRadius: "16px 16px 0 0",
    },
  },

  assemblySection: {
    background: assemblerColors.gradients.premium,
    border: `1px solid ${assemblerColors.alpha.primary30}`,
    borderRadius: "16px",
    marginTop: "1.5rem",
    position: "relative",
    overflow: "hidden",
    animation: `${assemblerAnimations.assemblyPulse} 3s ease-in-out infinite`,
  },

  infoCard: {
    background: assemblerColors.alpha.primary10,
    border: `1px solid ${assemblerColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    color: "#ffffff",
    marginBottom: "1rem",
    transition: "background-color 0.2s ease",
    "&:hover": {
      background: assemblerColors.alpha.primary15,
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

export const assemblerMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: assemblerColors.primary,
      light: "#9c27b0",
      dark: "#4a148c",
    },
    secondary: {
      main: assemblerColors.secondary,
      light: "#ba68c8",
      dark: "#7b1fa2",
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
    fontFamily: assemblerTypography.secondary,
    h1: {
      fontFamily: assemblerTypography.primary,
      fontWeight: 700,
    },
    h2: {
      fontFamily: assemblerTypography.primary,
      fontWeight: 700,
    },
    h3: {
      fontFamily: assemblerTypography.primary,
      fontWeight: 700,
    },
    h4: {
      fontFamily: assemblerTypography.accent,
      fontWeight: 600,
    },
    h5: {
      fontFamily: assemblerTypography.accent,
      fontWeight: 600,
    },
    h6: {
      fontFamily: assemblerTypography.accent,
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
  },
});

export const assemblerUtils = {
  formatAddress: (address, short = true) => {
    if (!address) return "Not connected";
    if (short) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return address;
  },

  generateWatchId: (prefix = "WATCH") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  },

  getComponentIcon: (componentType) => {
    const iconMap = {
      "Swiss Movement": "⚙️",
      "Titanium Case": "🔘",
      "Sapphire Crystal": "💎",
      "Gold Crown": "👑",
      "Leather Strap": "🟤",
      "Steel Bracelet": "⚪",
      Default: "🔧",
    };
    return iconMap[componentType] || iconMap.Default;
  },

  getStatusColor: (status) => {
    switch (status) {
      case "0":
      case 0:
        return "#ff9800"; // Orange - Manufactured
      case "1":
      case 1:
        return "#4caf50"; // Green - Certified
      case "2":
      case 2:
        return "#f44336"; // Red - Used
      default:
        return "#9e9e9e"; // Gray - Unknown
    }
  },

  getStatusText: (status) => {
    switch (status) {
      case "0":
      case 0:
        return "Manufactured";
      case "1":
      case 1:
        return "Certified";
      case "2":
      case 2:
        return "Used";
      default:
        return "Unknown";
    }
  },

  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  getPerformanceStyles: (baseStyles, animatedStyles) => {
    if (
      performanceConfig.respectsReducedMotion &&
      assemblerUtils.prefersReducedMotion()
    ) {
      return baseStyles;
    }
    return performanceConfig.enableAnimations ? animatedStyles : baseStyles;
  },
};

export const assemblerConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",
  MINIMUM_COMPONENTS_REQUIRED: 3,

  COMPONENT_TYPES: [
    "Swiss Movement",
    "Titanium Case",
    "Gold Case",
    "Sapphire Crystal",
    "Diamond Dial",
    "Gold Crown",
    "Leather Strap",
    "Steel Bracelet",
    "Ceramic Bezel",
    "Mother of Pearl",
  ],

  ASSEMBLY_STEPS: [
    "Component Verification",
    "Assembly Process",
    "Quality Control",
    "Blockchain Registration",
    "Completion",
  ],

  WATCH_CATEGORIES: [
    "Luxury Chronograph",
    "Dress Watch",
    "Sport Watch",
    "Diver Watch",
    "Heritage Edition",
    "Limited Edition",
  ],
};

export default {
  colors: assemblerColors,
  animations: assemblerAnimations,
  typography: assemblerTypography,
  styles: assemblerStyles,
  theme: assemblerMuiTheme,
  utils: assemblerUtils,
  constants: assemblerConstants,
  performance: performanceConfig,
};
