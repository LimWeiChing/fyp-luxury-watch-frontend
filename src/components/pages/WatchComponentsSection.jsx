import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Build as BuildIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import QRCode from "qrcode.react";
import api from "../../api/axios";
// Watch theme colors (matching ViewWatch.jsx theme)
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

const WatchComponentsSection = ({
  watchComponents = [],
  rawMaterials = [],
  onNavigateToComponent,
  onNavigateToRawMaterial,
  formatTimestamp,
  formatAddress,
  viewType = "interactive", // "interactive" or "table"
}) => {
  const [selectedComponentIndex, setSelectedComponentIndex] = useState(0);
  const [showRawMaterials, setShowRawMaterials] = useState(false);

  // Simplified component labeling - just the component type
  const getComponentLabel = (component, index) => {
    const type = component.componentType || "Component";

    // Return clean, simple labels without serial numbers
    switch (type.toLowerCase()) {
      case "movement":
        return "Movement";
      case "case":
        return "Case";
      case "dial":
        return "Dial";
      case "hands":
        return "Hands";
      case "crystal":
        return "Crystal";
      case "crown":
        return "Crown";
      case "strap":
      case "bracelet":
        return "Strap";
      default:
        return type; // Return the original type if not in our predefined list
    }
  };

  // Enhanced color scheme for different component types
  const getComponentColor = (componentType, index) => {
    const type = componentType?.toLowerCase() || "";
    const colors = [
      "#1976d2", // Blue
      "#388e3c", // Green
      "#d32f2f", // Red
      "#f57c00", // Orange
      "#7b1fa2", // Purple
      "#0288d1", // Light Blue
      "#689f38", // Light Green
      "#e64a19", // Deep Orange
    ];

    // Assign colors based on component type
    switch (type) {
      case "movement":
        return "#1976d2"; // Blue for movement
      case "case":
        return "#388e3c"; // Green for case
      case "dial":
        return "#d32f2f"; // Red for dial
      case "hands":
        return "#f57c00"; // Orange for hands
      case "crystal":
        return "#7b1fa2"; // Purple for crystal
      case "crown":
        return "#0288d1"; // Light blue for crown
      case "strap":
      case "bracelet":
        return "#689f38"; // Light green for strap
      default:
        return colors[index % colors.length]; // Fallback rotation
    }
  };

  const _formatTimestamp = (timestamp) => {
    return formatTimestamp ? formatTimestamp(timestamp) : "N/A";
  };

  const _formatAddress = (address) => {
    return formatAddress ? formatAddress(address) : "N/A";
  };

  // Generate QR code data
  const generateQRCodeData = (type, id) => {
    const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";
    return `${CONTRACT_ADDRESS},${id}`;
  };

  // Handle QR code navigation
  const handleQRCodeClick = (type, id) => {
    if (type === "component" && onNavigateToComponent) {
      onNavigateToComponent(id);
    } else if (type === "raw-material" && onNavigateToRawMaterial) {
      onNavigateToRawMaterial(id);
    }
  };

  if (viewType === "table") {
    // Table view for ViewFullTraceability
    return (
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            🔧 Watch Components ({watchComponents.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Component ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Serial Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created By</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Certification</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Raw Materials</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {watchComponents.map((component, index) => (
                  <TableRow key={index}>
                    <TableCell>{component.componentId}</TableCell>
                    <TableCell>{component.componentType}</TableCell>
                    <TableCell>{component.serialNumber}</TableCell>
                    <TableCell>{_formatAddress(component.createdBy)}</TableCell>
                    <TableCell>
                      {_formatTimestamp(component.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={component.certified ? <VerifiedIcon /> : null}
                        label={
                          component.certified ? "Certified" : "Not Certified"
                        }
                        color={component.certified ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {component.rawMaterialIds?.length ||
                      component.rawMaterialId
                        ? 1
                        : 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );
  }

  // Enhanced Interactive view for ViewWatch
  return (
    <Accordion sx={{ mb: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          🔧 Watch Components ({watchComponents.length})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {watchComponents.length > 0 ? (
          <Grid container spacing={3}>
            {/* LEFT SIDE: Component and Raw Material Images - UPDATED THEME */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  mb: 2,
                  // Updated to match luxury watch theme
                  background: `linear-gradient(135deg, 
                    rgba(26, 26, 26, 0.95) 0%, 
                    rgba(45, 45, 45, 0.98) 50%, 
                    rgba(26, 26, 26, 0.95) 100%
                  )`,
                  border: `2px solid ${watchColors.alpha.primary30}`,
                  borderRadius: "16px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${watchColors.alpha.primary30}`,
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
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: watchColors.primary,
                      fontFamily: watchTypography.accent,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <BuildIcon />
                    Component & Raw Material
                  </Typography>

                  {/* Image Container with Overlay Design */}
                  <Box sx={{ position: "relative", mb: 2 }}>
                    {/* Main Component Image (Background) */}
                    <Box
                      sx={{
                        position: "relative",
                        width: 250,
                        height: 200,
                        margin: "auto",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: showRawMaterials
                          ? `2px solid ${watchColors.alpha.primary20}`
                          : "3px solid",
                        borderColor: showRawMaterials
                          ? watchColors.alpha.primary20
                          : watchColors.primary,
                        boxShadow: showRawMaterials
                          ? `0 4px 12px ${watchColors.alpha.primary20}`
                          : `0 6px 20px ${watchColors.alpha.primary30}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: `0 8px 25px ${watchColors.alpha.primary40}`,
                          transform: "scale(1.02)",
                        },
                      }}
                      onClick={() => setShowRawMaterials(false)}
                    >
                      {watchComponents[selectedComponentIndex]?.image ? (
                        <img
                          src={`${api.defaults.baseURL}/file/component/${watchComponents[selectedComponentIndex].image}`}
                          alt="Component"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <Box
                        sx={{
                          display: watchComponents[selectedComponentIndex]
                            ?.image
                            ? "none"
                            : "flex",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: watchColors.alpha.primary10,
                          color: watchColors.primary,
                          fontSize: "3rem",
                        }}
                      >
                        🔧
                      </Box>
                    </Box>

                    {/* Raw Material Overlay (Top Right) */}
                    {rawMaterials[selectedComponentIndex] && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: showRawMaterials
                            ? `3px solid ${watchColors.warning}`
                            : `2px solid ${watchColors.primary}`,
                          boxShadow: showRawMaterials
                            ? `0 4px 12px ${watchColors.warning}40`
                            : `0 4px 12px ${watchColors.alpha.primary30}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: `0 6px 20px ${watchColors.alpha.primary40}`,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRawMaterials(true);
                        }}
                      >
                        {rawMaterials[selectedComponentIndex]?.image ? (
                          <img
                            src={`${api.defaults.baseURL}/file/raw-material/${rawMaterials[selectedComponentIndex].image}`}
                            alt="Raw Material"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <Box
                          sx={{
                            display: rawMaterials[selectedComponentIndex]?.image
                              ? "none"
                              : "flex",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: watchColors.alpha.primary20,
                            color: watchColors.warning,
                            fontSize: "1.5rem",
                          }}
                        >
                          💎
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Simplified Component Selection Tabs - Just component type names */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {watchComponents.map((component, index) => (
                      <Chip
                        key={index}
                        label={getComponentLabel(component, index)}
                        variant={
                          selectedComponentIndex === index
                            ? "filled"
                            : "outlined"
                        }
                        size="small"
                        onClick={() => {
                          setSelectedComponentIndex(index);
                          setShowRawMaterials(false);
                        }}
                        sx={{
                          m: 0.5,
                          cursor: "pointer",
                          backgroundColor:
                            selectedComponentIndex === index
                              ? getComponentColor(
                                  component.componentType,
                                  index
                                )
                              : "rgba(26, 26, 26, 0.8)",
                          borderColor: getComponentColor(
                            component.componentType,
                            index
                          ),
                          color:
                            selectedComponentIndex === index
                              ? "#ffffff"
                              : watchColors.primary,
                          fontWeight: 600,
                          border: `2px solid ${getComponentColor(
                            component.componentType,
                            index
                          )}`,
                          "&:hover": {
                            backgroundColor: getComponentColor(
                              component.componentType,
                              index
                            ),
                            color: "#ffffff",
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 12px ${getComponentColor(
                              component.componentType,
                              index
                            )}40`,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* RIGHT SIDE: Enhanced Information Table and QR Code */}
            <Grid item xs={12} md={8}>
              {/* Information Table */}
              <Card
                sx={{
                  mb: 2,
                  background: `linear-gradient(135deg, 
                  rgba(26, 26, 26, 0.95) 0%, 
                  rgba(45, 45, 45, 0.98) 50%, 
                  rgba(26, 26, 26, 0.95) 100%
                )`,
                  border: `2px solid ${watchColors.alpha.primary30}`,
                  borderRadius: "16px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: showRawMaterials
                        ? watchColors.warning
                        : watchColors.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 600,
                      fontFamily: watchTypography.accent,
                    }}
                  >
                    {showRawMaterials
                      ? "💎 Raw Material Information"
                      : "🔧 Component Information"}
                  </Typography>

                  <TableContainer
                    component={Paper}
                    elevation={1}
                    sx={{
                      backgroundColor: "rgba(45, 45, 45, 0.95)",
                      border: `1px solid ${watchColors.alpha.primary20}`,
                      borderRadius: "12px",
                    }}
                  >
                    <Table>
                      <TableBody>
                        {showRawMaterials &&
                        rawMaterials[selectedComponentIndex] ? (
                          <>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Material ID
                              </TableCell>
                              <TableCell>
                                {
                                  rawMaterials[selectedComponentIndex]
                                    .materialId
                                }
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Material Type
                              </TableCell>
                              <TableCell>
                                {
                                  rawMaterials[selectedComponentIndex]
                                    .materialType
                                }
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Origin
                              </TableCell>
                              <TableCell>
                                {rawMaterials[selectedComponentIndex].origin}
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Supplied By
                              </TableCell>
                              <TableCell>
                                {_formatAddress(
                                  rawMaterials[selectedComponentIndex]
                                    .suppliedBy
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Supply Date
                              </TableCell>
                              <TableCell>
                                {_formatTimestamp(
                                  rawMaterials[selectedComponentIndex].timestamp
                                )}
                              </TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Component ID
                              </TableCell>
                              <TableCell>
                                {watchComponents[selectedComponentIndex]
                                  ?.componentId || "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Component Type
                              </TableCell>
                              <TableCell>
                                {watchComponents[selectedComponentIndex]
                                  ?.componentType || "Unknown"}
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Serial Number
                              </TableCell>
                              <TableCell>
                                {watchComponents[selectedComponentIndex]
                                  ?.serialNumber || "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Manufactured By
                              </TableCell>
                              <TableCell>
                                {
                                  watchComponents[selectedComponentIndex]
                                    ?.createdBy
                                }
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: watchColors.primary,
                                  fontWeight: 600,
                                }}
                              >
                                Manufacturing Date
                              </TableCell>
                              <TableCell>
                                {_formatTimestamp(
                                  watchComponents[selectedComponentIndex]
                                    ?.timestamp
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                "& td": {
                                  color: "#ffffff",
                                  borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                },
                              }}
                            ></TableRow>
                            {watchComponents[selectedComponentIndex]
                              ?.certified && (
                              <>
                                <TableRow
                                  sx={{
                                    "& td": {
                                      color: "#ffffff",
                                      borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                    },
                                  }}
                                >
                                  <TableCell
                                    sx={{
                                      color: watchColors.primary,
                                      fontWeight: 600,
                                    }}
                                  >
                                    Certified By
                                  </TableCell>
                                  <TableCell>
                                    {_formatAddress(
                                      watchComponents[selectedComponentIndex]
                                        ?.certifiedBy
                                    )}
                                  </TableCell>
                                </TableRow>
                                <TableRow
                                  sx={{
                                    "& td": {
                                      color: "#ffffff",
                                      borderBottom: `1px solid ${watchColors.alpha.primary20}`,
                                    },
                                  }}
                                >
                                  <TableCell
                                    sx={{
                                      color: watchColors.primary,
                                      fontWeight: 600,
                                    }}
                                  >
                                    Certification Date
                                  </TableCell>
                                  <TableCell>
                                    {_formatTimestamp(
                                      watchComponents[selectedComponentIndex]
                                        ?.certificationTimestamp
                                    )}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Enhanced QR Code Section - UPDATED THEME */}
              <Card
                sx={{
                  // Updated to match luxury watch theme
                  background: `linear-gradient(135deg, 
                  rgba(26, 26, 26, 0.95) 0%, 
                  rgba(45, 45, 45, 0.98) 50%, 
                  rgba(26, 26, 26, 0.95) 100%
                )`,
                  border: `2px solid ${watchColors.alpha.primary30}`,
                  borderRadius: "16px",
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
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: showRawMaterials
                        ? watchColors.warning
                        : watchColors.primary,
                      fontFamily: watchTypography.accent,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    📱 {showRawMaterials ? "Raw Material" : "Component"} QR Code
                  </Typography>

                  {/* QR Code Display */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        p: 2,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: `0 4px 20px ${watchColors.alpha.primary30}`,
                        border: `2px solid ${watchColors.alpha.primary20}`,
                      }}
                    >
                      <QRCode
                        value={generateQRCodeData(
                          showRawMaterials ? "raw-material" : "component",
                          showRawMaterials
                            ? rawMaterials[selectedComponentIndex]?.materialId
                            : watchComponents[selectedComponentIndex]
                                ?.componentId
                        )}
                        size={150}
                        style={{
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Tooltip
                      title={`View detailed ${
                        showRawMaterials ? "raw material" : "component"
                      } information`}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<QrCodeScannerIcon />}
                        onClick={() =>
                          handleQRCodeClick(
                            showRawMaterials ? "raw-material" : "component",
                            showRawMaterials
                              ? rawMaterials[selectedComponentIndex]?.materialId
                              : watchComponents[selectedComponentIndex]
                                  ?.componentId
                          )
                        }
                        sx={{
                          background: showRawMaterials
                            ? watchColors.gradients.accent
                            : watchColors.gradients.luxury,
                          color: showRawMaterials
                            ? "#ffffff"
                            : watchColors.accent,
                          fontWeight: 600,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontFamily: watchTypography.secondary,
                          border: `2px solid ${
                            showRawMaterials
                              ? watchColors.warning
                              : watchColors.primary
                          }`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 25px ${
                              showRawMaterials
                                ? `${watchColors.warning}40`
                                : watchColors.alpha.primary30
                            }`,
                          },
                        }}
                      >
                        View {showRawMaterials ? "Material" : "Component"}
                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            No components data available
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default WatchComponentsSection;
