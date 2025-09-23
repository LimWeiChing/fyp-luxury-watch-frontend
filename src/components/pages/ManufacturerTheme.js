import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Manufacturer Brand Colors (Orange/Amber Theme)
export const manufacturerColors = {
  primary: "#ff9800",
  secondary: "#ff5722",
  accent: "#ffab00",
  success: "#4caf50",
  warning: "#ffc107",
  error: "#f44336",
  info: "#2196f3",

  // Gradient combinations
  gradients: {
    primary: "linear-gradient(45deg, #ff9800 30%, #ffb74d 70%)",
    secondary: "linear-gradient(135deg, #ff5722 0%, #ff9800 100%)",
    accent: "linear-gradient(90deg, #ffab00 0%, #ff9800 100%)",
    premium:
      "linear-gradient(135deg, rgba(255, 152, 0, 0.08) 0%, rgba(255, 152, 0, 0.03) 100%)",
    card: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.98) 50%, rgba(20, 20, 20, 0.95) 100%)",
    forge:
      "linear-gradient(145deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 87, 34, 0.05) 100%)",
  },

  // Alpha variations
  alpha: {
    primary05: "rgba(255, 152, 0, 0.05)",
    primary10: "rgba(255, 152, 0, 0.1)",
    primary15: "rgba(255, 152, 0, 0.15)",
    primary20: "rgba(255, 152, 0, 0.2)",
    primary30: "rgba(255, 152, 0, 0.3)",
    primary50: "rgba(255, 152, 0, 0.5)",
    accent10: "rgba(255, 171, 0, 0.1)",
    accent20: "rgba(255, 171, 0, 0.2)",
    secondary10: "rgba(255, 87, 34, 0.1)",
    secondary20: "rgba(255, 87, 34, 0.2)",
  },
};

export const manufacturerAnimations = {
  forgeShimmer: keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  `,

  manufacturerGlow: keyframes`
    0%, 100% { 
      box-shadow: 0 0 10px rgba(255, 152, 0, 0.2);
    }
    50% { 
      box-shadow: 0 0 15px rgba(255, 152, 0, 0.4);
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

  precisionPulse: keyframes`
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

  moltenFlow: keyframes`
    0%, 100% { 
      background-position: 0% 50%;
    }
    50% { 
      background-position: 100% 50%;
    }
  `,

  forgeSparkle: keyframes`
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  `,
};

export const manufacturerTypography = {
  primary: '"Playfair Display", serif',
  secondary: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
  accent: '"Exo 2", sans-serif',
  technical: '"Orbitron", monospace',
};

export const manufacturerStyles = {
  precisionCard: {
    background: manufacturerColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${manufacturerColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${manufacturerColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${manufacturerAnimations.fadeInUp} 0.4s ease-out`,
    willChange: "transform",
  },

  precisionCardWithForge: {
    background: manufacturerColors.gradients.card,
    backdropFilter: "blur(8px)",
    border: `1px solid ${manufacturerColors.alpha.primary20}`,
    borderRadius: "16px",
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px ${manufacturerColors.alpha.primary10}
    `,
    position: "relative",
    overflow: "hidden",
    animation: `${manufacturerAnimations.fadeInUp} 0.4s ease-out`,
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
        ${manufacturerColors.primary}, 
        ${manufacturerColors.accent}, 
        transparent
      )`,
      transform: "translateX(-100%)",
      animation: `${manufacturerAnimations.forgeShimmer} 4s ease-in-out`,
      animationFillMode: "forwards",
    },
  },

  // Enhanced input styles for manufacturer
  styledTextField: {
    "& .MuiOutlinedInput-root": {
      background: manufacturerColors.alpha.primary05,
      borderRadius: "12px",
      color: "#ffffff",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: manufacturerColors.alpha.primary50,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: manufacturerColors.primary,
        boxShadow: `0 0 5px ${manufacturerColors.alpha.primary30}`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: manufacturerColors.alpha.primary30,
      transition: "border-color 0.2s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.2s ease",
      "&.Mui-focused": {
        color: manufacturerColors.primary,
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

  // Enhanced button styles for manufacturer
  precisionButton: {
    contained: {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s ease",
      background: manufacturerColors.gradients.primary,
      color: "#ffffff",
      border: `1px solid ${manufacturerColors.alpha.primary30}`,
      willChange: "transform, box-shadow",
      "&:hover": {
        background: manufacturerColors.gradients.secondary,
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${manufacturerColors.alpha.primary30}`,
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
      border: `1px solid ${manufacturerColors.alpha.primary50}`,
      color: manufacturerColors.primary,
      background: manufacturerColors.alpha.primary05,
      transition: "all 0.2s ease",
      willChange: "transform, background-color",
      "&:hover": {
        background: manufacturerColors.alpha.primary10,
        borderColor: manufacturerColors.primary,
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
      background: manufacturerColors.primary,
    },
  },

  componentUploadArea: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? manufacturerColors.primary : manufacturerColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? manufacturerColors.alpha.primary05
      : manufacturerColors.alpha.primary05,
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
      borderColor: manufacturerColors.primary,
      background: manufacturerColors.alpha.primary10,
      transform: "translateY(-1px)",
    },

    ...(hasImage && {
      boxShadow: `0 0 8px ${manufacturerColors.alpha.primary30}`,
    }),
  }),

  componentUploadAreaWithAnimation: (hasImage) => ({
    border: `2px dashed ${
      hasImage ? manufacturerColors.primary : manufacturerColors.alpha.primary30
    }`,
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    background: hasImage
      ? manufacturerColors.alpha.primary05
      : manufacturerColors.alpha.primary05,
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
      borderColor: manufacturerColors.primary,
      background: manufacturerColors.alpha.primary10,
      transform: "translateY(-1px)",
    },
    ...(hasImage && {
      animation: `${manufacturerAnimations.manufacturerGlow} 3s ease-in-out 1`,
    }),
  }),

  materialCard: {
    background: manufacturerColors.alpha.primary10,
    border: `1px solid ${manufacturerColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    color: "#ffffff",
    marginBottom: "1rem",
    transition: "background-color 0.2s ease",
    "&:hover": {
      background: manufacturerColors.alpha.primary15,
    },
  },

  qrSection: {
    background: manufacturerColors.gradients.premium,
    border: `1px solid ${manufacturerColors.alpha.primary30}`,
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
      background: manufacturerColors.primary,
    },
  },

  rawMaterialCard: {
    background: manufacturerColors.gradients.forge,
    border: `1px solid ${manufacturerColors.alpha.primary20}`,
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: `linear-gradient(90deg, 
        ${manufacturerColors.primary}, 
        ${manufacturerColors.accent}, 
        ${manufacturerColors.primary}
      )`,
    },
  },

  progressSection: {
    background: manufacturerColors.alpha.primary05,
    border: `1px solid ${manufacturerColors.alpha.primary20}`,
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "2rem",
    "& .MuiStepLabel-label": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-active": {
        color: manufacturerColors.primary,
        fontWeight: 600,
      },
      "&.Mui-completed": {
        color: manufacturerColors.primary,
      },
    },
    "& .MuiStepConnector-line": {
      borderColor: manufacturerColors.alpha.primary30,
    },
    "& .Mui-active .MuiStepConnector-line": {
      borderColor: manufacturerColors.primary,
    },
    "& .Mui-completed .MuiStepConnector-line": {
      borderColor: manufacturerColors.primary,
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

export const manufacturerMuiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: manufacturerColors.primary,
      light: "#ffb74d",
      dark: "#e65100",
    },
    secondary: {
      main: manufacturerColors.secondary,
      light: "#ff8a65",
      dark: "#d84315",
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
    fontFamily: manufacturerTypography.secondary,
    h1: {
      fontFamily: manufacturerTypography.primary,
      fontWeight: 700,
    },
    h2: {
      fontFamily: manufacturerTypography.primary,
      fontWeight: 700,
    },
    h3: {
      fontFamily: manufacturerTypography.primary,
      fontWeight: 700,
    },
    h4: {
      fontFamily: manufacturerTypography.accent,
      fontWeight: 600,
    },
    h5: {
      fontFamily: manufacturerTypography.accent,
      fontWeight: 600,
    },
    h6: {
      fontFamily: manufacturerTypography.accent,
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

export const manufacturerUtils = {
  formatAddress: (address, short = true) => {
    if (!address) return "Not connected";
    if (short) {
      return `${address.substring(0, 42)}
      `;
    }
    return address;
  },

  generateComponentId: (prefix = "COMP") => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  },

  getComponentIcon: (componentType) => {
    const iconMap = {
      Movement: "⚙️",
      Case: "🔲",
      Dial: "⭕",
      Hands: "↗️",
      Crown: "👑",
      Crystal: "💎",
      Bezel: "⭕",
      Strap: "🔗",
      Buckle: "🔒",
      Battery: "🔋",
      Default: "🔧",
    };
    return iconMap[componentType] || iconMap.Default;
  },

  getStatusColor: (status) => {
    const colorMap = {
      pending: manufacturerColors.warning,
      processing: manufacturerColors.primary,
      completed: manufacturerColors.success,
      error: manufacturerColors.error,
      certified: manufacturerColors.success,
      "not certified": manufacturerColors.warning,
    };
    return (
      colorMap[status?.toLowerCase()] || manufacturerColors.alpha.primary30
    );
  },

  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  getPerformanceStyles: (baseStyles, animatedStyles) => {
    if (
      performanceConfig.respectsReducedMotion &&
      manufacturerUtils.prefersReducedMotion()
    ) {
      return baseStyles;
    }
    return performanceConfig.enableAnimations ? animatedStyles : baseStyles;
  },

  formatTimestamp: (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  },
};

// Constants for manufacturer
export const manufacturerConstants = {
  CONTRACT_ADDRESS: "0x0172B73e1C608cf50a8adC16c9182782B89bf74f",
  GEOCODE_API_KEY: "AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0",

  COMPONENT_TYPES: [
    "Movement",
    "Case",
    "Dial",
    "Hands",
    "Crown",
    "Crystal",
    "Bezel",
    "Strap",
    "Buckle",
    "Battery",
    "Custom",
  ],

  MANUFACTURING_STEPS: [
    "Raw Material Verification",
    "Component Fabrication",
    "Quality Assurance",
    "Blockchain Registration",
    "Completion",
  ],

  PRECISION_LEVELS: [
    "Standard",
    "High Precision",
    "Ultra Precision",
    "Master Craft",
  ],
};

export default {
  colors: manufacturerColors,
  animations: manufacturerAnimations,
  typography: manufacturerTypography,
  styles: manufacturerStyles,
  theme: manufacturerMuiTheme,
  utils: manufacturerUtils,
  constants: manufacturerConstants,
  performance: performanceConfig,
};
