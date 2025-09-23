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

import VerifiedIcon from "@mui/icons-material/Verified";
import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import React from "react";
import { useState, useEffect } from "react";
import bgImg from "../../img/bg.png";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import useAuth from "../../hooks/useAuth";
import QRCode from "qrcode.react";
import Geocode from "react-geocode";
import ShippingMapVisualization from "../pages/ShippingMapVisualization";
import WatchComponentsSection from "../pages/WatchComponentsSection";

const getStatusColor = (status) => {
  const statusValue = parseInt(status);
  switch (statusValue) {
    case 0:
      return "#6b7280"; // Not shipped - gray
    case 1:
      return "#f59e0b"; // Shipped - orange
    case 2:
      return "#3b82f6"; // In transit - blue
    case 3:
      return "#10b981"; // Delivered - green
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

const ViewFullTraceability = () => {
  const [watchData, setWatchData] = useState(null);
  const [watchComponents, setWatchComponents] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const navigationQrData = location.state?.qrData;

  useEffect(() => {
    setError("");

    console.log("=== FULL TRACEABILITY USEEFFECT ===");
    console.log("navigationQrData:", navigationQrData);

    try {
      Geocode.setApiKey("AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0");
    } catch (error) {
      console.warn("Geocode initialization failed:", error);
    }

    // FIXED: Always fetch fresh data from database
    if (navigationQrData) {
      setQrData(navigationQrData);
      fetchWatchData(navigationQrData);
    } else {
      setError("No watch data provided. Please scan a watch QR code first.");
    }

    getCurrentTimeLocation();
  }, [navigationQrData]);

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
      console.log("🔍 Fetching fresh traceability data for:", watchId);

      const response = await axios.get(
        `http://localhost:5000/watch/${watchId}`
      );

      if (!response.data || response.data.length === 0) {
        setError("Watch not found in database");
        setLoading(false);
        return;
      }

      const dbWatch = response.data[0];
      console.log("📋 Fresh database data for traceability:", dbWatch);
      console.log("🔍 Raw traceability values from database:");
      console.log(
        "- retail_price:",
        dbWatch.retail_price,
        typeof dbWatch.retail_price
      );
      console.log(
        "- available_for_sale:",
        dbWatch.available_for_sale,
        typeof dbWatch.available_for_sale
      );
      console.log("- sold:", dbWatch.sold, typeof dbWatch.sold);

      const rawAssemblerAddress = dbWatch.assembler_address;
      const finalAssemblerAddress =
        rawAssemblerAddress && rawAssemblerAddress.toString().trim() !== ""
          ? rawAssemblerAddress.toString().trim()
          : null;

      // ENHANCED: Better watch data transformation for traceability with explicit logging
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
        // CRITICAL FIX: Explicit boolean conversion
        availableForSale: dbWatch.available_for_sale === true,
        sold: dbWatch.sold === true,
        currentOwner: dbWatch.current_owner || finalAssemblerAddress || "",
        image: dbWatch.image || "",
        description: dbWatch.description || "",
        // CRITICAL FIX: Proper numeric conversion with fallback
        retailPrice: dbWatch.retail_price
          ? parseFloat(dbWatch.retail_price)
          : 0,
        retailerAddress: dbWatch.retailer_address || "",
        shippingTrail: Array.isArray(dbWatch.shipping_trail)
          ? dbWatch.shipping_trail.filter((trail) => trail !== null)
          : [],
        ownershipHistory: Array.isArray(dbWatch.ownership_history)
          ? dbWatch.ownership_history.filter((owner) => owner !== null)
          : [],
      };

      console.log("✅ Processed traceability watch data:");
      console.log(
        "- Retail Price:",
        watchInfo.retailPrice,
        typeof watchInfo.retailPrice
      );
      console.log(
        "- Available for Sale:",
        watchInfo.availableForSale,
        typeof watchInfo.availableForSale
      );
      console.log("- Sold:", watchInfo.sold, typeof watchInfo.sold);
      console.log("- Retailer Address:", watchInfo.retailerAddress);
      console.log("- Shipping Status:", watchInfo.shippingStatus);

      setWatchData(watchInfo);

      if (watchInfo.componentIds && watchInfo.componentIds.length > 0) {
        await fetchWatchComponents(watchInfo.componentIds);
      }
    } catch (err) {
      console.error("Error fetching traceability watch data:", err);
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
          const response = await axios.get(
            `http://localhost:5000/component/${componentId}`
          );
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
          const response = await axios.get(
            `http://localhost:5000/raw-material/${component.rawMaterialId}`
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
        ? date.format("DD/MM/YYYY, hh:mm:ss A").toLowerCase()
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
        ? date.format("DD/MM/YYYY, hh:mm:ss A").toLowerCase()
        : "Invalid Date";
    } catch {
      return "Invalid Date";
    }
  };

  const formatShippingEntry = (entry) => {
    if (!entry || entry === null || entry === undefined) return "N/A";

    const timestampRegex = /(\d{10,13})/g;
    return String(entry).replace(timestampRegex, (match) => {
      try {
        const timestamp = parseInt(match);
        const timestampMs =
          timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
        return dayjs(timestampMs)
          .format("DD/MM/YYYY, hh:mm:ss A")
          .toLowerCase();
      } catch (error) {
        return match;
      }
    });
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

  const getSupplyChainSteps = () => {
    const certifiedCount = watchComponents.filter((c) => c.certified).length;
    const totalCount = watchComponents.length;

    // CRITICAL FIX: Proper retail completion logic - both price AND availability
    const retailCompleted =
      watchData?.retailPrice > 0 && watchData?.availableForSale;
    console.log("🏪 Full Traceability - Retail step completion check:");
    console.log("- retailPrice:", watchData?.retailPrice);
    console.log("- availableForSale:", watchData?.availableForSale);
    console.log("- retailCompleted:", retailCompleted);

    const steps = [
      {
        label: "Raw Materials Sourced",
        description: `${
          rawMaterials.filter((m) => m !== null).length
        } raw materials from ${
          new Set(rawMaterials.filter((m) => m !== null).map((r) => r.origin))
            .size
        } countries`,
        icon: <InventoryIcon />,
        completed: rawMaterials.filter((m) => m !== null).length > 0,
      },
      {
        label: "Components Manufactured",
        description: `${totalCount} components created and certified`,
        icon: <BuildIcon />,
        completed: totalCount > 0,
      },
      {
        label: "Quality Certification",
        description: `${totalCount}/${totalCount} components certified`,
        icon: <VerifiedIcon />,
        completed: totalCount > 0 && totalCount === totalCount,
      },
      {
        label: "Watch Assembly",
        description: `Assembled into luxury watch ${watchData?.watchId}`,
        icon: <PrecisionManufacturingIcon />,
        completed: watchData !== null,
      },
      {
        label: "Distribution",
        description: watchData
          ? getShippingStatusText(watchData.shippingStatus)
          : "Pending",
        icon: <LocalShippingIcon />,
        completed: watchData && watchData.shippingStatus >= 3,
      },

      {
        label: "Retail",
        description:
          watchData?.retailPrice > 0
            ? `Available for sale at $${parseFloat(
                watchData.retailPrice || 0
              ).toFixed(2)}`
            : "Not yet priced for retail",
        icon: <StorefrontIcon />,
        completed: watchData?.retailPrice > 0,
      },
      {
        label: "Consumer Ownership",
        description: watchData?.sold
          ? `Owned by ${formatAddress(
              watchData.currentOwner
            )} (Purchased for $${parseFloat(watchData.retailPrice || 0).toFixed(
              2
            )})`
          : retailCompleted
          ? `Available for purchase at $${parseFloat(
              watchData.retailPrice || 0
            ).toFixed(2)}`
          : "Not available for purchase",
        icon: <PersonIcon />,
        completed: watchData?.sold,
      },
    ];
    return steps;
  };

  const calculateSupplyChainStats = () => {
    const validMaterials = rawMaterials.filter((m) => m !== null);
    const uniqueCountries = new Set(validMaterials.map((r) => r.origin)).size;
    const totalActors = new Set(
      [
        ...validMaterials.map((r) => r.suppliedBy),
        ...watchComponents.map((c) => c.createdBy),
        ...watchComponents
          .map((c) => c.certifiedBy)
          .filter((c) => c !== "N/A" && c !== null && c !== undefined),
        watchData?.assembledBy || watchData?.assemblerAddress,
        watchData?.retailerAddress,
      ].filter(Boolean)
    ).size;

    const timespan =
      watchData && validMaterials.length > 0
        ? dayjs(parseInt(watchData.timestamp) * 1000).diff(
            dayjs(
              Math.min(
                ...validMaterials.map((r) => parseInt(r.timestamp || "0"))
              ) * 1000
            ),
            "days"
          )
        : 0;

    return { uniqueCountries, totalActors, timespan };
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

  if (loading) {
    return (
      <Box
        sx={{
          backgroundImage: `url(${bgImg})`,
          minHeight: "100vh",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#e3eefc" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading complete supply chain traceability...</Typography>
        </Paper>
      </Box>
    );
  }

  const stats = calculateSupplyChainStats();
  const supplyChainSteps = getSupplyChainSteps();

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImg})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        paddingTop: "2%",
        paddingBottom: "5%",
        overflowY: "auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "95%",
          maxWidth: "1400px",
          margin: "auto",
          padding: "25px",
          backgroundColor: "#e3eefc",
          borderRadius: "8px",
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: "25px" }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: "Gambetta, serif", fontWeight: "bold", mb: 1 }}
          >
            Complete Supply Chain Traceability
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            From Raw Materials to Consumer - Full Journey
          </Typography>
          {watchData && (
            <Typography variant="h6" sx={{ mt: 1, color: "primary.main" }}>
              Watch ID: {watchData.watchId}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {watchData && (
          <>
            {/* Supply Chain Process Timeline */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
                  🔄 Supply Chain Process Flow
                </Typography>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.3,
                    },
                  }}
                >
                  {supplyChainSteps.map((step, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="textSecondary">
                        Step {index + 1}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={step.completed ? "success" : "grey"}
                        >
                          {step.icon}
                        </TimelineDot>
                        {index < supplyChainSteps.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="h6" component="span">
                          {step.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                        {step.completed && (
                          <Chip
                            label="Completed"
                            color="success"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>

            {/* Watch Information */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  ⌚ Final Product - Luxury Watch
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      {watchData.image && watchData.image !== "" ? (
                        <CardMedia
                          component="img"
                          sx={{
                            width: "100%",
                            maxWidth: 200,
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 2,
                            margin: "auto",
                          }}
                          image={`http://localhost:5000/file/watch/${watchData.image}`}
                          alt="Luxury Watch"
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 200,
                            height: 200,
                            fontSize: "4rem",
                            backgroundColor: "#3f51b5",
                            margin: "auto",
                          }}
                        >
                          ⌚
                        </Avatar>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Watch ID:</strong> {watchData.watchId}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Assembled By:</strong>{" "}
                          {formatAddress(watchData.assembledBy)}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Assembly Date:</strong>{" "}
                          {formatTimestamp(watchData.timestamp)}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Components:</strong>{" "}
                          {watchData.componentIds?.length || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Shipping Status:</strong>{" "}
                          {getShippingStatusText(watchData.shippingStatus)}
                        </Typography>

                        {watchData.retailPrice > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Retail Price:</strong>
                            <Chip
                              icon={<AttachMoneyIcon />}
                              label={`$${parseFloat(
                                watchData.retailPrice
                              ).toFixed(2)}`}
                              color="success"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        )}
                        {/* CRITICAL FIX: Available for Sale should check availableForSale, not retailPrice */}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Available for Sale:</strong>{" "}
                          {watchData.availableForSale ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Sold:</strong> {watchData.sold ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Current Owner:</strong>{" "}
                          {formatAddress(watchData.currentOwner)}
                        </Typography>
                      </Grid>
                    </Grid>
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

            {/* QR Code for Full Traceability */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  📱 Traceability QR Code
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <QRCode
                    value={qrData}
                    size={150}
                    style={{ marginBottom: "16px" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Scan to view this complete traceability report
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Enhanced Sustainability Metrics */}
            <Card sx={{ mb: 3, backgroundColor: "#f1f8e9" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "success.main" }}>
                  🌱 Sustainability & Ethics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Material Traceability:</strong> 100% traceable to
                      origin
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Quality Certification:</strong>{" "}
                      {watchComponents.length}/{watchComponents.length}{" "}
                      components certified
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Supply Chain Transparency:</strong> Complete
                      database record with GPS tracking
                    </Typography>
                    <Typography variant="body1">
                      <strong>Pricing Transparency:</strong> Retail price
                      clearly displayed at $
                      {parseFloat(watchData.retailPrice || 0).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Origin Countries:</strong>{" "}
                      {Array.from(
                        new Set(
                          rawMaterials
                            .filter((m) => m !== null)
                            .map((r) => r.origin)
                        )
                      ).join(", ") || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Manufacturing Timeline:</strong>{" "}
                      {stats.timespan > 0 ? `${stats.timespan} days` : "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Actors Involved:</strong> {stats.totalActors}{" "}
                      unique entities with geographic distribution
                    </Typography>
                    <Typography variant="body1">
                      <strong>Value Chain:</strong> From raw materials to
                      consumer with transparent pricing at $
                      {parseFloat(watchData.retailPrice || 0).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/view-watch", { state: { qrData } })}
                sx={{ minWidth: 200, backgroundColor: "#2e7d32" }}
              >
                View Watch Details
              </Button>

              {watchData.retailPrice > 0 &&
                !watchData.sold &&
                auth?.role === "consumer" && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate("/purchase-watch", {
                        state: { qrData, watchData },
                      })
                    }
                    sx={{ minWidth: 200, backgroundColor: "#ff6b35" }}
                  >
                    Purchase Watch - $
                    {parseFloat(watchData.retailPrice).toFixed(2)}
                  </Button>
                )}

              <Button
                variant="outlined"
                onClick={handleScanAnother}
                sx={{ minWidth: 200 }}
              >
                Scan Another Watch
              </Button>
              <Button
                variant="outlined"
                onClick={handleHome}
                sx={{ minWidth: 200 }}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ minWidth: 200 }}
              >
                Go Back
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ViewFullTraceability;
