import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import dayjs from "dayjs";

// Map configuration
const containerStyle = {
  width: "100%",
  height: "400px",
};

const getStatusColor = (status, themeColors = null) => {
  if (themeColors) {
    const statusValue = parseInt(status);
    switch (statusValue) {
      case 0:
        return "#64748b"; // Slate gray
      case 1:
        return themeColors.secondary || "#f59e0b"; // Theme secondary or orange
      case 2:
        return themeColors.accent || "#3b82f6"; // Theme accent or blue
      case 3:
        return "#10b981"; // Emerald green
      default:
        return "#64748b";
    }
  }

  // Default elegant colors
  const statusText = status?.toUpperCase?.() || String(status).toUpperCase();
  switch (statusText) {
    case "NOT SHIPPED":
    case "0":
      return "#64748b"; // Slate
    case "SHIPPED":
    case "1":
      return "#f59e0b"; // Amber
    case "IN TRANSIT":
    case "2":
      return "#3b82f6"; // Blue
    case "DELIVERED":
    case "3":
      return "#10b981"; // Emerald
    default:
      return "#64748b";
  }
};

const ArtisticShippingMapVisualization = ({
  shippingTrail = [],
  currentCoordinates = null,
  showToggleButton = true,
  initialShowMap = false,
  height = "400px",
  title = "🌍 Global Route Tracking",
  themeColors = null,
}) => {
  const [showMap, setShowMap] = useState(initialShowMap);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapTrailData, setMapTrailData] = useState([]);
  const [geocodingComplete, setGeocodingComplete] = useState(false);
  const [watchPosition, setWatchPosition] = useState({ lat: 0, lng: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPaused, setAnimationPaused] = useState(false);

  // Google Maps loader with minimal libraries for performance
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0",
    libraries: ["geometry"],
    id: "google-map-script",
  });

  // Initialize Geocode
  useEffect(() => {
    Geocode.setApiKey("AIzaSyBYnX1EhN5r4c465VtBwqz6Z16-8HbldN0");
  }, []);

  // Optimized timestamp formatting
  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === "0" || timestamp === "N/A") {
      return "N/A";
    }

    try {
      const timestampNum = parseInt(timestamp);
      if (isNaN(timestampNum)) return timestamp;

      const timestampMs =
        timestampNum.toString().length === 10
          ? timestampNum * 1000
          : timestampNum;

      const date = dayjs(timestampMs);
      return date.isValid() ? date.format("DD/MM/YYYY h:mmA") : timestamp;
    } catch (error) {
      return timestamp;
    }
  };

  // Process shipping trail data with optimized geocoding
  useEffect(() => {
    if (shippingTrail && shippingTrail.length > 0) {
      processShippingTrailForMap();
    }
  }, [shippingTrail]);

  const processShippingTrailForMap = async () => {
    if (!shippingTrail || shippingTrail.length === 0) {
      setGeocodingComplete(true);
      return;
    }

    setGeocodingComplete(false);
    const processedTrail = [];

    for (let i = 0; i < shippingTrail.length; i++) {
      const entry = shippingTrail[i];
      const match = entry.match(/^(.*?)\s+at\s+(.*?)\s+on\s+(.*)$/);

      if (match) {
        const [, status, address, timestamp] = match;

        try {
          // Reduced delay for better performance
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const response = await Geocode.fromAddress(address.trim());
          const { lat, lng } = response.results[0].geometry.location;

          processedTrail.push({
            status: status.trim(),
            address: address.trim(),
            timestamp: formatTimestamp(timestamp.trim()),
            lat,
            lng,
            stepNumber: i + 1,
          });
        } catch (geocodeError) {
          console.warn(`Geocoding failed for: ${address}`);

          processedTrail.push({
            status: status.trim(),
            address: address.trim(),
            timestamp: formatTimestamp(timestamp.trim()),
            lat: null,
            lng: null,
            stepNumber: i + 1,
          });
        }
      }
    }

    setMapTrailData(processedTrail);
    setGeocodingComplete(true);
  };

  // Optimized map configuration
  const mapConfig = useMemo(() => {
    const validPoints = mapTrailData.filter((point) => point.lat && point.lng);

    if (validPoints.length === 0) {
      return {
        center: { lat: 3.139, lng: 101.6869 },
        zoom: 10,
      };
    }

    if (validPoints.length === 1) {
      return {
        center: { lat: validPoints[0].lat, lng: validPoints[0].lng },
        zoom: 12,
      };
    }

    const bounds = validPoints.reduce(
      (acc, point) => ({
        minLat: Math.min(acc.minLat, point.lat),
        maxLat: Math.max(acc.maxLat, point.lat),
        minLng: Math.min(acc.minLng, point.lng),
        maxLng: Math.max(acc.maxLng, point.lng),
      }),
      {
        minLat: validPoints[0].lat,
        maxLat: validPoints[0].lat,
        minLng: validPoints[0].lng,
        maxLng: validPoints[0].lng,
      }
    );

    const center = {
      lat: (bounds.minLat + bounds.maxLat) / 2,
      lng: (bounds.minLng + bounds.maxLng) / 2,
    };

    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 10;
    if (maxDiff < 0.01) zoom = 14;
    else if (maxDiff < 0.1) zoom = 12;
    else if (maxDiff < 1) zoom = 10;
    else if (maxDiff < 10) zoom = 8;
    else zoom = 6;

    return { center, zoom };
  }, [mapTrailData]);

  // Enhanced route path with proper ordering
  const routePath = useMemo(() => {
    const validPoints = mapTrailData.filter((point) => point.lat && point.lng);
    const sortedPoints = validPoints.sort(
      (a, b) => a.stepNumber - b.stepNumber
    );
    return sortedPoints.map((point) => ({ lat: point.lat, lng: point.lng }));
  }, [mapTrailData]);

  // Calculate moving watch position along route
  const calculateWatchPosition = (progress) => {
    if (routePath.length < 2) return null;

    // Normalize progress to 0-1
    const normalizedProgress = Math.max(0, Math.min(1, progress));

    // Calculate which segment we're on
    const totalSegments = routePath.length - 1;
    const currentSegment = Math.floor(normalizedProgress * totalSegments);
    const segmentProgress = normalizedProgress * totalSegments - currentSegment;

    // Handle edge case for last point
    if (currentSegment >= totalSegments) {
      return routePath[routePath.length - 1];
    }

    // Get current and next points
    const startPoint = routePath[currentSegment];
    const endPoint = routePath[currentSegment + 1];

    // Interpolate between points
    const lat =
      startPoint.lat + (endPoint.lat - startPoint.lat) * segmentProgress;
    const lng =
      startPoint.lng + (endPoint.lng - startPoint.lng) * segmentProgress;

    return { lat, lng };
  };

  // Initialize animation when map becomes visible and route is available
  useEffect(() => {
    if (showMap && routePath.length >= 2 && !isAnimating) {
      setAnimationPaused(false);
      setAnimationProgress(0);
      setWatchPosition(routePath[0]);
    }
  }, [showMap, routePath.length]);

  // Watch animation effect
  useEffect(() => {
    if (!showMap || routePath.length < 2 || animationPaused) {
      return;
    }

    // Initialize watch at origin when map loads
    if (routePath.length >= 2 && animationProgress === 0) {
      setWatchPosition(routePath[0]);
    }

    setIsAnimating(true);
    const animationDuration = 20000; // 20 seconds for full route
    const frameRate = 60; // 60 FPS
    const increment = 1 / (animationDuration / (1000 / frameRate));

    const animationInterval = setInterval(() => {
      setAnimationProgress((prevProgress) => {
        const newProgress = prevProgress + increment;

        // Reset animation when complete with a slight pause
        if (newProgress >= 1) {
          return 0;
        }

        return newProgress;
      });
    }, 1000 / frameRate);

    return () => {
      clearInterval(animationInterval);
    };
  }, [showMap, routePath.length, animationPaused]);

  // Control animation
  const toggleAnimation = () => {
    setAnimationPaused(!animationPaused);
    if (animationPaused) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  };

  // Update watch position based on animation progress
  useEffect(() => {
    if (isAnimating) {
      const newPosition = calculateWatchPosition(animationProgress);
      if (newPosition) {
        setWatchPosition(newPosition);
      }
    }
  }, [animationProgress, isAnimating, routePath]);

  const handlePointClick = (index) => {
    setSelectedPoint(selectedPoint === index ? null : index);
  };

  const containerStyleWithHeight = {
    ...containerStyle,
    height: height,
  };

  // Theme colors with elegant defaults
  const routeColor = themeColors?.routeColor || "#00bcd4";
  const routeGlow = themeColors?.routeGlow || "rgba(0, 188, 212, 0.4)";

  // Don't render if no shipping trail data
  if (!shippingTrail || shippingTrail.length === 0) {
    return null;
  }

  return (
    <Box>
      {/* Minimal Header */}
      {showToggleButton && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: themeColors?.primary || "#00bcd4",
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {!geocodingComplete && (
              <CircularProgress
                size={16}
                sx={{
                  mr: 1,
                  color: themeColors?.primary || "#00bcd4",
                }}
              />
            )}
            {/* Animation Control Button */}
            {showMap && routePath.length > 1 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={animationPaused ? <PlayArrow /> : <Pause />}
                onClick={toggleAnimation}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: "100px",
                  ...(themeColors && {
                    borderColor: themeColors.accent || themeColors.primary,
                    color: themeColors.accent || themeColors.primary,
                    "&:hover": {
                      backgroundColor: `${
                        themeColors.accent || themeColors.primary
                      }15`,
                    },
                  }),
                }}
              >
                {animationPaused ? "Play" : "Pause"}
              </Button>
            )}
            <Button
              variant={showMap ? "contained" : "outlined"}
              size="small"
              startIcon={<MapIcon />}
              onClick={() => setShowMap(!showMap)}
              disabled={mapTrailData.filter((p) => p.lat && p.lng).length === 0}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                ...(themeColors && {
                  backgroundColor: showMap
                    ? themeColors.primary
                    : "transparent",
                  borderColor: themeColors.primary,
                  color: showMap ? "#ffffff" : themeColors.primary,
                  "&:hover": {
                    backgroundColor: showMap
                      ? themeColors.secondary
                      : `${themeColors.primary}15`,
                  },
                }),
              }}
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </Box>
        </Box>
      )}

      {/* Pure Artistic Map Visualization */}
      {showMap && (
        <Box sx={{ mb: 3 }}>
          {loadError ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Map loading failed. Please check your connection.
              </Typography>
            </Alert>
          ) : !isLoaded ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: height,
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderRadius: 3,
                border: `2px solid ${themeColors?.primary || "#00bcd4"}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <CircularProgress
                sx={{
                  color: themeColors?.primary || "#00bcd4",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  ml: 2,
                  color: "#ffffff",
                  fontWeight: 500,
                }}
              >
                Loading Map...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `3px solid ${themeColors?.primary || "#00bcd4"}`,
                boxShadow: `
                  0 20px 40px rgba(0, 0, 0, 0.3),
                  0 0 30px ${themeColors?.routeGlow || "rgba(0, 188, 212, 0.4)"}
                `,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 20% 20%, ${
                      themeColors?.primary || "#00bcd4"
                    }10 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, ${
                      themeColors?.accent || "#26c6da"
                    }10 0%, transparent 50%)
                  `,
                  zIndex: 1,
                  pointerEvents: "none",
                },
              }}
            >
              <GoogleMap
                mapContainerStyle={containerStyleWithHeight}
                center={mapConfig.center}
                zoom={mapConfig.zoom}
                options={{
                  styles: [
                    // Dark elegant theme
                    {
                      featureType: "all",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "water",
                      elementType: "geometry",
                      stylers: [{ color: "#0f172a" }],
                    },
                    {
                      featureType: "landscape",
                      elementType: "geometry",
                      stylers: [{ color: "#1e293b" }],
                    },
                    {
                      featureType: "road",
                      elementType: "geometry",
                      stylers: [
                        { visibility: "simplified" },
                        { color: "#334155" },
                      ],
                    },
                    {
                      featureType: "poi",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "administrative",
                      elementType: "geometry",
                      stylers: [{ color: "#475569" }],
                    },
                    {
                      featureType: "administrative.country",
                      elementType: "geometry.stroke",
                      stylers: [{ color: "#64748b" }, { weight: 1 }],
                    },
                  ],
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeControl: false,
                  scaleControl: false,
                  streetViewControl: false,
                  rotateControl: false,
                  fullscreenControl: true,
                  mapTypeId: "roadmap",
                  gestureHandling: "cooperative",
                }}
              >
                {/* Multi-layered Route Lines for Artistic Effect */}
                {routePath.length > 1 && (
                  <>
                    {/* Outer glow effect */}
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: routeColor,
                        strokeOpacity: 0.2,
                        strokeWeight: 12,
                        geodesic: true,
                        zIndex: 1,
                      }}
                    />
                    {/* Middle glow */}
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: routeColor,
                        strokeOpacity: 0.4,
                        strokeWeight: 8,
                        geodesic: true,
                        zIndex: 2,
                      }}
                    />
                    {/* Main route line */}
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: routeColor,
                        strokeOpacity: 0.9,
                        strokeWeight: 4,
                        geodesic: true,
                        zIndex: 3,
                      }}
                    />
                    {/* Animated dash overlay */}
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: "#ffffff",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        geodesic: true,
                        zIndex: 4,
                        icons: [
                          {
                            icon: {
                              path: "M 0,-1 0,1",
                              strokeOpacity: 1,
                              scale: 2,
                              strokeColor: "#ffffff",
                              strokeWeight: 2,
                            },
                            offset: "0",
                            repeat: "20px",
                          },
                        ],
                      }}
                    />
                  </>
                )}

                {/* Artistic Custom Markers */}
                {mapTrailData.map((point, index) => {
                  if (!point.lat || !point.lng) return null;

                  const isSelected = selectedPoint === index;
                  const isFirst = index === 0;
                  const isLast = index === mapTrailData.length - 1;
                  const statusColor = getStatusColor(point.status, themeColors);

                  return (
                    <Marker
                      key={index}
                      position={{ lat: point.lat, lng: point.lng }}
                      onClick={() => handlePointClick(index)}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Artistic glow rings -->
                            <circle cx="28" cy="28" r="26" fill="${statusColor}" opacity="0.15"/>
                            <circle cx="28" cy="28" r="22" fill="${statusColor}" opacity="0.25"/>
                            <circle cx="28" cy="28" r="18" fill="${statusColor}" opacity="0.4"/>
                            
                            <!-- Main marker circle -->
                            <circle cx="28" cy="28" r="${
                              isSelected ? "16" : "14"
                            }" 
                                    fill="${statusColor}" 
                                    stroke="#ffffff" 
                                    stroke-width="3"
                                    filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"/>
                            
                            <!-- Content based on position -->
                            ${
                              isFirst
                                ? `<!-- Origin marker -->
                                   <circle cx="28" cy="28" r="8" fill="white" opacity="0.9"/>
                                   <circle cx="28" cy="28" r="4" fill="${statusColor}"/>
                                   <path d="M28 20 L32 24 L28 28 L24 24 Z" fill="white" opacity="0.8"/>
                                   <text x="28" y="48" text-anchor="middle" fill="${statusColor}" font-size="9" font-weight="bold" font-family="Arial">ORIGIN</text>`
                                : isLast
                                ? `<!-- Destination marker -->
                                   <path d="M20 28 L24 32 L36 20" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                   <circle cx="28" cy="28" r="2" fill="white"/>
                                   <text x="28" y="48" text-anchor="middle" fill="${statusColor}" font-size="9" font-weight="bold" font-family="Arial">DESTINATION</text>`
                                : `<!-- Checkpoint marker -->
                                   <circle cx="28" cy="28" r="6" fill="white" opacity="0.9"/>
                                   <text x="28" y="32" text-anchor="middle" fill="${statusColor}" font-size="12" font-weight="bold" font-family="Arial">${point.stepNumber}</text>
                                   <text x="28" y="48" text-anchor="middle" fill="${statusColor}" font-size="8" font-weight="bold" font-family="Arial">CHECKPOINT</text>`
                            }
                            
                            <!-- Pulse animation for selected -->
                            ${
                              isSelected
                                ? `<circle cx="28" cy="28" r="28" fill="none" stroke="${statusColor}" stroke-width="2" opacity="0.6">
                                     <animate attributeName="r" values="14;32;14" dur="2s" repeatCount="indefinite"/>
                                     <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                                   </circle>`
                                : ""
                            }
                          </svg>
                        `)}`,
                        scaledSize: window.google?.maps
                          ? new window.google.maps.Size(56, 56)
                          : undefined,
                        anchor: window.google?.maps
                          ? new window.google.maps.Point(28, 28)
                          : undefined,
                      }}
                      title={`${point.status} - ${point.address}`}
                      zIndex={isSelected ? 1000 : 100 + index}
                    />
                  );
                })}

                {/* Current location marker with artistic design */}
                {currentCoordinates && (
                  <Marker
                    position={currentCoordinates}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <!-- Pulsing rings -->
                          <circle cx="20" cy="20" r="18" fill="#ef4444" opacity="0.2">
                            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="20" cy="20" r="14" fill="#ef4444" opacity="0.3">
                            <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite"/>
                          </circle>
                          
                          <!-- Main marker -->
                          <circle cx="20" cy="20" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
                          <circle cx="20" cy="20" r="6" fill="white"/>
                          <circle cx="20" cy="20" r="3" fill="#ef4444"/>
                          
                          <text x="20" y="36" text-anchor="middle" fill="#ef4444" font-size="7" font-weight="bold" font-family="Arial">LIVE</text>
                        </svg>
                      `)}`,
                      scaledSize: window.google?.maps
                        ? new window.google.maps.Size(40, 40)
                        : undefined,
                      anchor: window.google?.maps
                        ? new window.google.maps.Point(20, 20)
                        : undefined,
                    }}
                    title="Your Current Location"
                    zIndex={999}
                  />
                )}

                {/* Animated Moving Watch Icon */}
                {isAnimating &&
                  watchPosition.lat !== 0 &&
                  watchPosition.lng !== 0 && (
                    <Marker
                      position={watchPosition}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <!-- Glowing trail effect -->
                          <circle cx="24" cy="24" r="22" fill="${routeColor}" opacity="0.1">
                            <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="24" cy="24" r="18" fill="${routeColor}" opacity="0.2">
                            <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite"/>
                          </circle>
                          
                          <!-- Watch case -->
                          <circle cx="24" cy="24" r="14" fill="#1a1a1a" stroke="${routeColor}" stroke-width="2"/>
                          <circle cx="24" cy="24" r="12" fill="#2a2a2a" stroke="#ffffff" stroke-width="1"/>
                          
                          <!-- Watch face -->
                          <circle cx="24" cy="24" r="10" fill="#f8f9fa"/>
                          
                          <!-- Hour markers -->
                          <circle cx="24" cy="16" r="1" fill="#1a1a1a"/>
                          <circle cx="32" cy="24" r="1" fill="#1a1a1a"/>
                          <circle cx="24" cy="32" r="1" fill="#1a1a1a"/>
                          <circle cx="16" cy="24" r="1" fill="#1a1a1a"/>
                          
                          <!-- Watch hands (animated) -->
                          <line x1="24" y1="24" x2="24" y2="18" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round">
                            <animateTransform attributeName="transform" type="rotate" 
                                            values="0 24 24;360 24 24" dur="3s" repeatCount="indefinite"/>
                          </line>
                          <line x1="24" y1="24" x2="28" y2="24" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round">
                            <animateTransform attributeName="transform" type="rotate" 
                                            values="0 24 24;360 24 24" dur="5s" repeatCount="indefinite"/>
                          </line>
                          
                          <!-- Center dot -->
                          <circle cx="24" cy="24" r="1.5" fill="${routeColor}"/>
                          
                          <!-- Watch crown -->
                          <rect x="35" y="22" width="3" height="4" rx="1" fill="#666"/>
                          
                          <!-- Motion blur effect -->
                          <defs>
                            <filter id="motionBlur">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
                            </filter>
                          </defs>
                          
                          <!-- Speed lines -->
                          <line x1="8" y1="20" x2="12" y2="20" stroke="${routeColor}" stroke-width="2" opacity="0.6">
                            <animate attributeName="opacity" values="0;0.8;0" dur="0.5s" repeatCount="indefinite"/>
                          </line>
                          <line x1="8" y1="24" x2="14" y2="24" stroke="${routeColor}" stroke-width="2" opacity="0.4">
                            <animate attributeName="opacity" values="0;0.6;0" dur="0.7s" repeatCount="indefinite"/>
                          </line>
                          <line x1="8" y1="28" x2="12" y2="28" stroke="${routeColor}" stroke-width="2" opacity="0.6">
                            <animate attributeName="opacity" values="0;0.8;0" dur="0.6s" repeatCount="indefinite"/>
                          </line>
                          
                          <!-- Shipping label -->
                          <text x="24" y="42" text-anchor="middle" fill="${routeColor}" font-size="6" font-weight="bold" font-family="Arial">SHIPPING</text>
                        </svg>
                      `)}`,
                        scaledSize: window.google?.maps
                          ? new window.google.maps.Size(48, 48)
                          : undefined,
                        anchor: window.google?.maps
                          ? new window.google.maps.Point(24, 24)
                          : undefined,
                      }}
                      title="Luxury Watch in Transit"
                      zIndex={1001}
                    />
                  )}
              </GoogleMap>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ArtisticShippingMapVisualization;
