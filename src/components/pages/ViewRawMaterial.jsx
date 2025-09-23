import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import api from "../../api/axios";
import dayjs from "dayjs";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  ThemeProvider,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  QrCode2,
  Download,
  QrCodeScanner,
  Warning,
  PictureAsPdf,
} from "@mui/icons-material";

// Import supplier theme
import supplierTheme, {
  supplierColors,
  supplierStyles,
  supplierTypography,
  supplierUtils,
  supplierConstants,
  supplierMuiTheme,
} from "./SupplierTheme";

import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";

const ViewRawMaterial = () => {
  const [rawMaterialData, setRawMaterialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState("");
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const CONTRACT_ADDRESS = supplierConstants.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Get data from navigation state
  const navigationQrData = location.state?.qrData;
  const navigationEntityData = location.state?.entityData;

  useEffect(() => {
    if (navigationQrData) {
      setQrData(navigationQrData);
      if (navigationEntityData) {
        processEntityData(navigationEntityData);
      } else {
        fetchRawMaterialData(navigationQrData);
      }
    } else {
      setError("No raw material data provided");
      setLoading(false);
    }
  }, [navigationQrData, navigationEntityData]);

  const processEntityData = (entityData) => {
    const rawMaterial = {
      componentId: entityData.componentId || entityData[0],
      materialType: entityData.materialType || entityData[1],
      origin: entityData.origin || entityData[2],
      image: entityData.image || entityData[3],
      location: entityData.location || entityData[4],
      timestamp: entityData.timestamp || entityData[5],
      supplier: entityData.supplier || entityData[6],
      used: entityData.used || entityData[7] || false,
    };
    setRawMaterialData(rawMaterial);
    setLoading(false);
  };

  const fetchRawMaterialData = async (qrData) => {
    try {
      const parts = qrData.split(",");
      if (parts.length < 2) {
        setError("Invalid QR code format");
        setLoading(false);
        return;
      }

      const componentId = parts[1];
      console.log("🔍 Fetching raw material data for:", componentId);

      // First try to fetch from database
      try {
        console.log("📡 Attempting database fetch...");
        const dbResponse = await api.get(`/raw-material/${componentId}`);

        if (dbResponse.data && dbResponse.data.length > 0) {
          const dbData = dbResponse.data[0];
          console.log("✅ Database data found:", dbData);

          setRawMaterialData({
            componentId: dbData.component_id,
            materialType: dbData.material_type,
            origin: dbData.origin,
            image: dbData.image,
            location: dbData.location,
            timestamp: dbData.timestamp,
            supplier: dbData.supplier_address,
            used: dbData.used,
            createdAt: dbData.created_at,
            updatedAt: dbData.updated_at,
          });
          setLoading(false);
          return;
        }
      } catch (dbError) {
        console.log(
          "⚠️ Database fetch failed, trying blockchain...",
          dbError.message
        );
      }

      // Fallback to blockchain if database fails
      console.log("🔗 Attempting blockchain fetch...");
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          provider
        );

        const rawMaterialBlockchain = await contract.getRawMaterial(
          componentId
        );

        if (rawMaterialBlockchain && rawMaterialBlockchain.componentId) {
          console.log("✅ Blockchain data found:", rawMaterialBlockchain);

          setRawMaterialData({
            componentId: rawMaterialBlockchain.componentId,
            materialType: rawMaterialBlockchain.materialType,
            origin: rawMaterialBlockchain.origin,
            image: rawMaterialBlockchain.image,
            location: rawMaterialBlockchain.location,
            timestamp: rawMaterialBlockchain.timestamp,
            supplier: rawMaterialBlockchain.supplier,
            used: rawMaterialBlockchain.used,
          });
        } else {
          setError("Raw material not found on blockchain");
        }
      } else {
        setError("Please install MetaMask to access blockchain data.");
      }
    } catch (error) {
      console.error("❌ Error fetching raw material:", error);
      setError(`Failed to fetch raw material data: ${error.message}`);
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    if (auth?.role === "supplier") {
      navigate("/supplier");
    } else if (auth?.role === "manufacturer") {
      navigate("/manufacturer");
    } else if (auth?.role === "certifier") {
      navigate("/certifier");
    } else if (auth?.role === "assembler") {
      navigate("/assembler");
    } else if (auth?.role === "distributor") {
      navigate("/distributor");
    } else if (auth?.role === "retailer") {
      navigate("/retailer");
    } else if (auth?.role === "consumer") {
      navigate("/consumer");
    } else if (auth?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleScanAnother = () => {
    navigate("/scanner");
  };

  const downloadQR = () => {
    const canvas = document.getElementById("rawMaterialQR");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${
        rawMaterialData?.componentId || "raw-material"
      }.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Enhanced PDF generation with html2canvas + jsPDF
  const generatePDF = async () => {
    if (!rawMaterialData) return;

    // Debug: Check if dependencies are loaded
    console.log("🔍 Checking dependencies...");
    console.log("html2canvas available:", typeof html2canvas);
    console.log("jsPDF available:", typeof jsPDF);

    // If dependencies are not available, show error
    if (typeof html2canvas === "undefined" || typeof jsPDF === "undefined") {
      alert(
        "PDF dependencies not loaded. Please install: npm install html2canvas jspdf"
      );
      return;
    }

    setPdfGenerating(true);
    try {
      // Create a temporary container for PDF content with better styling
      const pdfContainer = document.createElement("div");
      pdfContainer.id = "pdf-content";
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "800px";
      pdfContainer.style.background = "white";
      pdfContainer.style.padding = "40px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";
      pdfContainer.style.color = "black";

      // Get QR code as data URL with error handling
      let qrDataUrl = null;
      try {
        const qrCanvas = document.getElementById("rawMaterialQR");
        if (qrCanvas) {
          qrDataUrl = qrCanvas.toDataURL("image/png");
          console.log("✅ QR Code captured successfully");
        } else {
          console.warn("⚠️ QR Code canvas not found");
        }
      } catch (qrError) {
        console.error("❌ QR Code capture failed:", qrError);
      }

      // Get material image URL with error handling
      let materialImageUrl = null;
      try {
        materialImageUrl = getImageUrl(rawMaterialData.image);
        if (materialImageUrl) {
          console.log("✅ Material image URL obtained:", materialImageUrl);
        } else {
          console.warn("⚠️ No material image available");
        }
      } catch (imageError) {
        console.error("❌ Image URL generation failed:", imageError);
      }

      // Build the comprehensive HTML content
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a237e; padding-bottom: 20px;">
          <h1 style="color: #1a237e; margin-bottom: 10px; font-size: 32px; font-weight: bold;">Raw Material Authentication Certificate</h1>
          <p style="color: #666; font-size: 18px; margin: 0;">Premium Supply Chain Traceability</p>
        </div>
        
        <div style="display: flex; gap: 40px; margin-bottom: 40px; align-items: flex-start;">
          <div style="flex: 0 0 280px; text-align: center;">
            <h3 style="color: #1a237e; margin-bottom: 20px; font-size: 20px;">Material Specimen</h3>
            ${
              materialImageUrl
                ? `<img src="${materialImageUrl}" alt="Raw Material" style="width: 240px; height: 240px; object-fit: cover; border-radius: 12px; border: 2px solid #1a237e; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" crossorigin="anonymous" />`
                : `<div style="width: 240px; height: 240px; border: 2px dashed #1a237e; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; background-color: #f5f5f5; color: #666; font-size: 16px;">Material Preview</div>`
            }
            <div style="background-color: #1a237e; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-top: 10px;">
              ${rawMaterialData.materialType}
            </div>
          </div>
          
          <div style="flex: 1;">
            <h2 style="color: #1a237e; border-bottom: 2px solid #e3f2fd; padding-bottom: 8px; margin-bottom: 20px; font-size: 24px;">Authenticity Certificate</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Component ID</div>
                <div style="color: #333; font-size: 14px; font-weight: 500; font-family: monospace;">${
                  rawMaterialData.componentId
                }</div>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Origin Country</div>
                <div style="color: #333; font-size: 14px; font-weight: 500;">${
                  rawMaterialData.origin
                }</div>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Status</div>
                <span style="padding: 4px 12px; border-radius: 15px; color: white; font-weight: bold; font-size: 11px; text-transform: uppercase; background-color: ${
                  rawMaterialData.used ? "#f44336" : "#4caf50"
                };">
                  ${rawMaterialData.used ? "UTILIZED" : "AVAILABLE"}
                </span>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Registration Date</div>
                <div style="color: #333; font-size: 14px; font-weight: 500;">${formatTimestamp(
                  rawMaterialData.timestamp
                )}</div>
              </div>
              
              ${
                rawMaterialData.location
                  ? `
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9; grid-column: span 2;">
                <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Location</div>
                <div style="color: #333; font-size: 14px; font-weight: 500;">${rawMaterialData.location}</div>
              </div>`
                  : ""
              }
              
              ${
                rawMaterialData.createdAt
                  ? `
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9; grid-column: span 2;">
                <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Database Record</div>
                <div style="color: #333; font-size: 14px; font-weight: 500;">${dayjs(
                  rawMaterialData.createdAt
                ).format("MMMM D, YYYY hh:mm A")}</div>
              </div>`
                  : ""
              }
            </div>
          </div>
        </div>

        <div style="background-color: #f9f9f9; padding: 25px; border-radius: 10px; border: 1px solid #e0e0e0; margin-bottom: 30px;">
          <h2 style="color: #1a237e; border-bottom: 2px solid #e3f2fd; padding-bottom: 8px; margin-bottom: 20px; font-size: 22px;">Supplier Verification</h2>
          <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: white;">
            <div style="color: #1a237e; font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Blockchain Address</div>
            <div style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #333; background-color: #f5f5f5; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
              ${formatFullAddress(rawMaterialData.supplier)}
            </div>
          </div>
        </div>

        ${
          qrDataUrl
            ? `
        <div style="text-align: center; margin: 30px 0; padding: 25px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #1a237e; margin-bottom: 20px; font-size: 20px;">Digital Authentication Code</h2>
          <div style="display: inline-block; padding: 15px; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <img src="${qrDataUrl}" alt="QR Code" style="width: 150px; height: 150px;" />
          </div>
          <p style="margin-top: 15px; color: #666; font-size: 12px;">
            Scan this QR code to verify authenticity
          </p>
        </div>`
            : ""
        }

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e3f2fd; font-size: 11px; color: #666;">
          <p style="margin: 5px 0;">Generated on ${dayjs().format(
            "MMMM D, YYYY hh:mm A"
          )}</p>
          <p style="margin: 5px 0;">Luxury Watch Supply Chain Management System</p>
          <p style="color: #1a237e; font-size: 12px; font-weight: bold; margin: 10px 0;">Blockchain-Verified Authenticity Certificate</p>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      // Wait a bit for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate canvas from HTML with high quality settings
      const canvas = await html2canvas(pdfContainer, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: pdfContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF with automatic download
      const fileName = `Raw_Material_Certificate_${
        rawMaterialData.componentId
      }_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(pdfContainer);

      console.log("✅ PDF generated successfully:", fileName);
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleImageError = (e) => {
    console.log("❌ Image failed to load:", e.target.src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully");
    setImageError(false);
    setImageLoading(false);
  };

  const getImageUrl = (imageName) => {
    if (!imageName || imageName === "") return null;
    return `${api.defaults.baseURL}/file/raw-material/${imageName}`;
  };

  const formatFullAddress = (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      return "N/A";
    }
    return address;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === "0") {
      return "N/A";
    }
    try {
      const date = dayjs(parseInt(timestamp) * 1000);
      return date.isValid()
        ? date.format("MMMM D, YYYY hh:mm:ss A")
        : "Invalid Date";
    } catch {
      return "Invalid Date";
    }
  };

  // Enhanced image display component with supplier theme
  const ImageDisplay = ({ imageName, alt = "Raw Material" }) => {
    const imageUrl = getImageUrl(imageName);

    if (!imageUrl) {
      return (
        <Box
          sx={{
            width: 240,
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: supplierColors.gradients.premium,
            border: `2px solid ${supplierColors.alpha.primary30}`,
            borderRadius: "16px",
            margin: "auto",
            ...supplierUtils.getPerformanceStyles(
              {},
              { animation: `${supplierStyles.premiumCard.animation}` }
            ),
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "4rem",
                mb: 1,
                filter: `drop-shadow(0 0 8px ${supplierColors.alpha.primary30})`,
              }}
            >
              {supplierUtils.getMaterialIcon(rawMaterialData?.materialType)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: supplierColors.primary, fontWeight: 600 }}
            >
              Material Preview
            </Typography>
          </Box>
        </Box>
      );
    }

    if (imageError) {
      return (
        <Box
          sx={{
            width: 240,
            height: 240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            background: supplierColors.alpha.primary05,
            border: `2px dashed ${supplierColors.alpha.primary30}`,
            borderRadius: "16px",
          }}
        >
          <Warning
            sx={{ fontSize: "3rem", mb: 1, color: supplierColors.warning }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#ffffff", textAlign: "center" }}
          >
            Image not found
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ position: "relative", textAlign: "center" }}>
        {imageLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: supplierColors.alpha.primary10,
              borderRadius: "16px",
              zIndex: 1,
            }}
          >
            <CircularProgress sx={{ color: supplierColors.primary }} />
          </Box>
        )}
        <CardMedia
          component="img"
          sx={{
            width: 240,
            height: 240,
            objectFit: "cover",
            borderRadius: "16px",
            margin: "auto",
            display: "block",
            border: `2px solid ${supplierColors.alpha.primary30}`,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: `0 8px 24px ${supplierColors.alpha.primary30}`,
            },
          }}
          image={imageUrl}
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={supplierMuiTheme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: `linear-gradient(135deg, 
              rgba(18, 18, 18, 0.95) 0%, 
              rgba(30, 30, 30, 0.98) 50%, 
              rgba(18, 18, 18, 0.95) 100%
            )`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card sx={supplierStyles.premiumCard}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress
                sx={{
                  mb: 2,
                  color: supplierColors.primary,
                  animation: `${supplierColors.animations?.softGlow} 2s ease-in-out infinite`,
                }}
              />
              <Typography
                sx={{
                  color: "#ffffff",
                  fontFamily: supplierTypography.accent,
                  fontWeight: 600,
                }}
              >
                Loading raw material data...
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={supplierMuiTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, 
            rgba(18, 18, 18, 0.95) 0%, 
            rgba(30, 30, 30, 0.98) 50%, 
            rgba(18, 18, 18, 0.95) 100%
          )`,
          backgroundAttachment: "fixed",
          paddingTop: "2%",
          paddingBottom: "5%",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "900px",
            margin: "auto",
            padding: "32px",
          }}
        >
          {/* Header Section */}
          <Box sx={{ ...supplierStyles.pageHeader, mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: supplierTypography.primary,
                fontWeight: 700,
                color: "#ffffff",
                mb: 1,
                textShadow: `0 0 20px ${supplierColors.alpha.primary30}`,
              }}
            >
              Raw Material Authentication
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: supplierTypography.accent,
                color: supplierColors.primary,
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              Premium Supply Chain Traceability
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: supplierColors.alpha.primary05,
                border: `1px solid ${supplierColors.error}`,
                color: "#ffffff",
                "& .MuiAlert-icon": {
                  color: supplierColors.error,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {rawMaterialData && (
            <>
              {/* Main Information Card */}
              <Card
                sx={{
                  ...supplierStyles.premiumCardWithShimmer,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    {/* Image Section */}
                    <Grid item xs={12} md={5}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 3,
                            color: supplierColors.primary,
                            fontFamily: supplierTypography.accent,
                            fontWeight: 600,
                          }}
                        >
                          Material Specimen
                        </Typography>
                        <ImageDisplay
                          imageName={rawMaterialData.image}
                          alt="Raw Material"
                        />

                        {/* Material Type Badge */}
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label={rawMaterialData.materialType}
                            sx={{
                              background: supplierColors.gradients.accent,
                              color: "#ffffff",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              padding: "8px 4px",
                              "& .MuiChip-label": {
                                padding: "0 12px",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Details Section */}
                    <Grid item xs={12} md={7}>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 3,
                          color: "#ffffff",
                          fontFamily: supplierTypography.primary,
                          fontWeight: 700,
                        }}
                      >
                        Authenticity Certificate
                      </Typography>

                      {/* Component ID */}
                      <Box sx={supplierStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: supplierColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Component ID
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: supplierTypography.mono,
                            color: "#ffffff",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {rawMaterialData.componentId}
                        </Typography>
                      </Box>

                      {/* Origin */}
                      <Box sx={supplierStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: supplierColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Origin Country
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {rawMaterialData.origin}
                        </Typography>
                      </Box>

                      {/* Status */}
                      <Box sx={supplierStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: supplierColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Availability Status
                        </Typography>
                        {rawMaterialData.used ? (
                          <Chip
                            label="UTILIZED"
                            sx={{
                              backgroundColor: supplierColors.error,
                              color: "#ffffff",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          />
                        ) : (
                          <Chip
                            label="AVAILABLE"
                            sx={{
                              backgroundColor: supplierColors.success,
                              color: "#ffffff",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          />
                        )}
                      </Box>

                      {/* Timestamp */}
                      <Box sx={supplierStyles.infoCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: supplierColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Registration Date
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#ffffff",
                            fontFamily: supplierTypography.secondary,
                          }}
                        >
                          {formatTimestamp(rawMaterialData.timestamp)}
                        </Typography>
                      </Box>

                      {/* Database timestamps if available */}
                      {rawMaterialData.createdAt && (
                        <Box sx={supplierStyles.infoCard}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: supplierColors.primary,
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            Database Record
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {dayjs(rawMaterialData.createdAt).format(
                              "MMMM D, YYYY hh:mm A"
                            )}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Supplier Information */}
              <Card
                sx={{
                  ...supplierStyles.premiumCard,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: "#ffffff",
                      fontFamily: supplierTypography.primary,
                      fontWeight: 700,
                    }}
                  >
                    Supplier Verification
                  </Typography>

                  {/* Supplier Address */}
                  <Box sx={supplierStyles.infoCard}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: supplierColors.primary,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Blockchain Address
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-all",
                        fontFamily: supplierTypography.mono,
                        color: "#ffffff",
                        backgroundColor: supplierColors.alpha.primary10,
                        p: 2,
                        borderRadius: "8px",
                        border: `1px solid ${supplierColors.alpha.primary30}`,
                      }}
                    >
                      {formatFullAddress(rawMaterialData.supplier)}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box sx={supplierStyles.infoCard}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: supplierColors.primary,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: "break-word",
                        color: "#ffffff",
                        backgroundColor: supplierColors.alpha.primary10,
                        p: 2,
                        borderRadius: "8px",
                        border: `1px solid ${supplierColors.alpha.primary30}`,
                      }}
                    >
                      {rawMaterialData.location || "N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* QR Code Section */}
              {qrData && (
                <Card sx={supplierStyles.qrSection}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        textAlign: "center",
                        color: "#ffffff",
                        fontFamily: supplierTypography.primary,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <QrCode2 sx={{ color: supplierColors.primary }} />
                      Digital Authentication Code
                    </Typography>

                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          p: 2,
                          background: "#ffffff",
                          borderRadius: "12px",
                          boxShadow: `0 4px 12px ${supplierColors.alpha.primary30}`,
                        }}
                      >
                        <QRCode
                          id="rawMaterialQR"
                          value={qrData}
                          size={180}
                          level={"H"}
                          includeMargin={true}
                        />
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Download />}
                      onClick={downloadQR}
                      sx={{
                        ...supplierStyles.premiumButton.contained,
                        fontSize: "1rem",
                      }}
                    >
                      Download Authentication Code
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{
                      ...supplierStyles.premiumButton.outlined,
                      height: "56px",
                    }}
                  >
                    Return
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Home />}
                    onClick={handleHome}
                    sx={{
                      ...supplierStyles.premiumButton.outlined,
                      height: "56px",
                    }}
                  >
                    Dashboard
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<QrCodeScanner />}
                    onClick={handleScanAnother}
                    sx={{
                      ...supplierStyles.premiumButton.contained,
                      height: "56px",
                    }}
                  >
                    Scan Another
                  </Button>
                </Grid>
              </Grid>

              {/* PDF Export Button - New Row */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={
                      pdfGenerating ? (
                        <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                      ) : (
                        <PictureAsPdf />
                      )
                    }
                    onClick={generatePDF}
                    disabled={pdfGenerating}
                    sx={{
                      ...supplierStyles.premiumButton.contained,
                      height: "56px",
                      fontSize: "1.1rem",
                      background: pdfGenerating
                        ? supplierColors.alpha.primary30
                        : supplierColors.gradients.accent,
                      "&:hover": {
                        background: pdfGenerating
                          ? supplierColors.alpha.primary30
                          : supplierColors.gradients.premium,
                        transform: pdfGenerating ? "none" : "translateY(-2px)",
                      },
                      "&:disabled": {
                        color: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {pdfGenerating ? "Generating PDF..." : "Save as PDF"}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ViewRawMaterial;
