import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Certifier Brand Colors (Professional Blue Theme)
export const certifierColors = {
  primary: "#2196f3",
  secondary: "#03a9f4",
  accent: "#00b0ff",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#00bcd4",

  // Gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #2196f3 30%, #42a5f5 70%)",
    secondary: "linear-gradient(135deg, #03a9f4 0%, #2196f3 100%)",
    accent: "linear-gradient(90deg, #00b0ff 0%, #2196f3 100%)",
    premium:
      "linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.03) 100%)",
    card: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.98) 50%, rgba(20, 20, 20, 0.95) 100%)",
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(33, 150, 243, 0.05)",
    primary10: "rgba(33, 150, 243, 0.1)",
    primary20: "rgba(33, 150, 243, 0.2)",
    primary30: "rgba(33, 150, 243, 0.3)",
    primary50: "rgba(33, 150, 243, 0.5)",
    accent10: "rgba(0, 176, 255, 0.1)",
    accent20: "rgba(0, 176, 255, 0.2)",
  },
};

export const certifierAnimations = {
  shimmer: keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  `,

  softGlow: keyframes`
    0%, 100% { 
      box-shadow: 0 0 10px rgba(33, 150, 243, 0.2);
    }
    50% { 
      box-shadow: 0 0 15px rgba(33, 150, 243, 0.4);
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

  certificationPulse: keyframes`
    0%, 100% { 
      box-shadow: 0 0 20px rgba(33, 150, 243, 0.3),
                  0 0 40px rgba(33, 150, 243, 0.2),
                  inset 0 0 20px rgba(33, 150, 243, 0.1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(33, 150, 243, 0.6),
                  0 0 60px rgba(33, 150, 243, 0.4),
                  inset 0 0 30px rgba(33, 150, 243, 0.2);
    }
  `,
};

export const certifierTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
};

export const certifierStyles = {
  premiumCard: {
    background: certifierColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${certifierColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${certifierColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${certifierAnimations.fadeInUp} 0.4s ease-out`,
    willChange: "transform",
  },

  premiumCardWithShimmer: {
    background: certifierColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${certifierColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${certifierColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${certifierAnimations.fadeInUp} 0.4s ease-out`,
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
        ${certifierColors.primary}, 
        ${certifierColors.accent}, 
        transparent
      )`,
      transform: "translateX(-100%)",
      animation: `${certifierAnimations.shimmer} 4s ease-in-out`,
      animationFillMode: "forwards",
    },
  },

  // Optimized input styles
  styledTextField: {
    "& .MuiOutlinedInput-root": {
      background: certifierColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: certifierColors.alpha.primary50,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: certifierColors.primary,
        boxShadow: `0 0 5px ${certifierColors.alpha.primary30}`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: certifierColors.alpha.primary30,
      transition: "border-color 0.2s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.2s ease",
      "&.Mui-focused": {
        color: certifierColors.primary,
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
      background: certifierColors.gradients.primary,
      color: "#ffffff",
      border: `1px solid ${certifierColors.alpha.primary30}`,
      willChange: "transform, box-shadow",
      "&:hover": {
        background: certifierColors.gradients.secondary,
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${certifierColors.alpha.primary30}`,
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
      border: `1px solid ${certifierColors.alpha.primary50}`,
      color: certifierColors.primary,
      background: certifierColors.alpha.primary05,
      transition: "all 0.2s ease",
      willChange: "transform, background-color",
      "&:hover": {
        background: certifierColors.alpha.primary10,
        borderColor: certifierColors.primary,
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
      background: certifierColors.primary,
    },
  },

  imageUploadArea: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? certifierColors.primary : certifierColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? certifierColors.alpha.primary05
      : certifierColors.alpha.primary05,
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
      borderColor: certifierColors.primary,
      background: certifierColors.alpha.primary10,
      transform: "translateY(-1px)",
    },

    ...(hasImage && {
      boxShadow: `0 0 8px ${certifierColors.alpha.primary30}`,
    }),
  }),

  imageUploadAreaWithAnimation: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? certifierColors.primary : certifierColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? certifierColors.alpha.primary05
      : certifierColors.alpha.primary05,
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
      borderColor: certifierColors.primary,
      background: certifierColors.alpha.primary10,
      transform: "translateY(-1px)",
    },
    ...(hasImage && {
      animation: `${certifierAnimations.certificationPulse} 3s ease-in-out 1`,
    }),
  }),

  infoCard: {
    background: certifierColors.alpha.primary10,
    border: `1px solid ${certifierColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    color: "#ffffff",
    marginBottom: "1rem",
    transition: "background-color 0.2s ease",
    "&:hover": {
      background: certifierColors.alpha.primary15,
    },
  },

  certificationBadge: {
    background: `linear-gradient(135deg, ${certifierColors.primary} 0%, ${certifierColors.accent} 100%)`,
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.75rem",
    border: `1px solid ${certifierColors.alpha.primary30}`,
    borderRadius: "20px",
    padding: "4px 12px",
  },

  statusSection: {
    background: certifierColors.gradients.premium,
    border: `1px solid ${certifierColors.alpha.primary30}`,
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
      background: certifierColors.primary,
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

export const certifierMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: certifierColors.primary,
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: certifierColors.secondary,
      light: "#26c6da",
      dark: "#0277bd",
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
    fontFamily: certifierTypography.secondary,
    h1: {
      fontFamily: certifierTypography.primary,
      fontWeight: 700,
    },
    h2: {
      fontFamily: certifierTypography.primary,
      fontWeight: 700,
    },
    h3: {
      fontFamily: certifierTypography.primary,
      fontWeight: 700,
    },
    h4: {
      fontFamily: certifierTypography.accent,
      fontWeight: 600,
    },
    h5: {
      fontFamily: certifierTypography.accent,
      fontWeight: 600,
    },
    h6: {
      fontFamily: certifierTypography.accent,
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

export const certifierUtils = {
  formatAddress: (address, short = true) => {
    if (!address) return "Not connected";
    if (short) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return address;
  },

  generateCertificationId: (prefix = "CERT") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  },

  getCertificationStatusIcon: (status) => {
    const statusMap = {
      0: "🔍", // Under Review
      1: "✅", // Certified
      2: "❌", // Rejected
      3: "⏳", // Pending
      Default: "📋",
    };
    return statusMap[status] || statusMap.Default;
  },

  getCertificationStatusColor: (status) => {
    const colorMap = {
      0: certifierColors.warning, // Under Review
      1: certifierColors.success, // Certified
      2: certifierColors.error, // Rejected
      3: certifierColors.info, // Pending
    };
    return colorMap[status] || certifierColors.alpha.primary30;
  },

  getCertificationStatusLabel: (status) => {
    const labelMap = {
      0: "UNDER REVIEW",
      1: "CERTIFIED",
      2: "REJECTED",
      3: "PENDING",
    };
    return labelMap[status] || "UNKNOWN";
  },

  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  getPerformanceStyles: (baseStyles, animatedStyles) => {
    if (
      performanceConfig.respectsReducedMotion &&
      certifierUtils.prefersReducedMotion()
    ) {
      return baseStyles;
    }
    return performanceConfig.enableAnimations ? animatedStyles : baseStyles;
  },
};

// Constants
export const certifierConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",
  GEOCODE_API_KEY: "AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0",

  CERTIFICATION_STANDARDS: [
    "ISO 9001:2015",
    "ISO 14001:2015",
    "OHSAS 18001",
    "CE Marking",
    "RoHS Compliance",
    "Swiss Made",
    "Hallmark Standards",
    "Custom Standards",
  ],

  QUALITY_GRADES: [
    "Premium",
    "Excellent",
    "Good",
    "Acceptable",
    "Needs Improvement",
    "Rejected",
  ],

  CERTIFICATION_STEPS: [
    "Component Inspection",
    "Quality Assessment",
    "Documentation Review",
    "Blockchain Certification",
    "Completion",
  ],
};

export default {
  colors: certifierColors,
  animations: certifierAnimations,
  typography: certifierTypography,
  styles: certifierStyles,
  theme: certifierMuiTheme,
  utils: certifierUtils,
  constants: certifierConstants,
  performance: performanceConfig,
};
