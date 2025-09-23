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
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  QrCode2,
  Download,
  QrCodeScanner,
  CheckCircle,
  Warning,
  Build,
  Precision,
  Engineering,
  PictureAsPdf,
} from "@mui/icons-material";

// Import manufacturer theme
import manufacturerTheme, {
  manufacturerColors,
  manufacturerStyles,
  manufacturerTypography,
  manufacturerUtils,
  manufacturerConstants,
  manufacturerMuiTheme,
} from "./ManufacturerTheme";

import useAuth from "../../hooks/useAuth";
import abi from "../../utils/LuxuryWatchNFT.json";

const ViewComponent = () => {
  const [componentData, setComponentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState("");
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [rawDbData, setRawDbData] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const CONTRACT_ADDRESS = manufacturerConstants.CONTRACT_ADDRESS;
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
      fetchComponentData(navigationQrData);
    } else {
      setError("No component data provided");
      setLoading(false);
    }
  }, [navigationQrData]);

  const fetchComponentData = async (qrData) => {
    try {
      const parts = qrData.split(",");
      if (parts.length < 2) {
        setError("Invalid QR code format");
        setLoading(false);
        return;
      }

      const componentId = parts[1];
      console.log("=== FETCHING COMPONENT DATA ===");
      console.log("Component ID:", componentId);

      // ALWAYS fetch from database first
      try {
        const dbResponse = await api.get(`/component/${componentId}`);

        console.log("=== RAW DATABASE RESPONSE ===");
        console.log("Full response:", dbResponse.data);

        if (dbResponse.data && dbResponse.data.length > 0) {
          const dbRecord = dbResponse.data[0];
          setRawDbData(dbRecord);

          console.log("=== RAW DATABASE FIELDS ===");
          console.log("component_id:", dbRecord.component_id);
          console.log("certifier_address:", dbRecord.certifier_address);
          console.log("certifier_remarks:", dbRecord.certifier_remarks);
          console.log("certifier_location:", dbRecord.certifier_location);
          console.log("certify_timestamp:", dbRecord.certify_timestamp);
          console.log("status:", dbRecord.status);
          console.log("===============================");

          // Create clean component data object
          const cleanComponentData = {
            componentId: dbRecord.component_id,
            componentType: dbRecord.component_type,
            serialNumber: dbRecord.serial_number,
            rawMaterialId: dbRecord.raw_material_id,
            image: dbRecord.image,
            location: dbRecord.location,
            timestamp: dbRecord.timestamp,
            manufacturer: dbRecord.manufacturer_address,
            status: dbRecord.status,

            // Basic certification fields for compatibility
            certifiedBy: dbRecord.certifier_address,
            certificationTimestamp: dbRecord.certify_timestamp,
            certifierRemarks: dbRecord.certifier_remarks,
            certifierImage: dbRecord.certifier_image,
            certifierLocation: dbRecord.certifier_location,

            // AssembleWatch compatibility
            component_id: dbRecord.component_id,
            component_type: dbRecord.component_type,
            serial_number: dbRecord.serial_number,
            manufacturer_address: dbRecord.manufacturer_address,
          };

          console.log("=== PROCESSED COMPONENT DATA ===");
          console.log("cleanComponentData:", cleanComponentData);
          console.log("================================");

          setComponentData(cleanComponentData);
          setLoading(false);
          return;
        } else {
          console.log("No data returned from database");
        }
      } catch (dbError) {
        console.error("Database fetch error:", dbError);
        setError(`Database error: ${dbError.message}`);
        setLoading(false);
        return;
      }

      // Fallback to blockchain if database fails
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          provider
        );

        try {
          const componentBlockchain = await contract.getComponent(componentId);
          console.log("Blockchain response:", componentBlockchain);

          if (componentBlockchain && componentBlockchain.componentId) {
            const blockchainData = {
              componentId: componentBlockchain.componentId,
              componentType: componentBlockchain.componentType,
              serialNumber: componentBlockchain.serialNumber,
              rawMaterialId: componentBlockchain.rawMaterialId,
              image: componentBlockchain.image,
              location: componentBlockchain.location,
              timestamp: componentBlockchain.timestamp,
              manufacturer: componentBlockchain.manufacturer,
              status: componentBlockchain.status,
              certifiedBy: componentBlockchain.certifier,
              certificationTimestamp: componentBlockchain.certifyTimestamp,
              certifierRemarks: componentBlockchain.certifierRemarks,
              certifierImage: componentBlockchain.certifierImage,
              certifierLocation: componentBlockchain.certifierLocation,
              component_id: componentBlockchain.componentId,
              component_type: componentBlockchain.componentType,
              serial_number: componentBlockchain.serialNumber,
              manufacturer_address: componentBlockchain.manufacturer,
            };

            setComponentData(blockchainData);
          } else {
            setError("Component not found on blockchain");
          }
        } catch (contractError) {
          console.error("Contract call error:", contractError);
          setError("Failed to fetch from blockchain");
        }
      } else {
        setError("Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error fetching component:", error);
      setError(`Failed to fetch component data: ${error.message}`);
    }

    setLoading(false);
  };

  // DIRECT database field access function
  const getDirectDbValue = (fieldName) => {
    if (!rawDbData || !rawDbData[fieldName]) {
      return "N/A";
    }

    const value = rawDbData[fieldName];

    // Handle null, undefined, empty string
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null"
    ) {
      return "N/A";
    }

    return String(value).trim();
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
    return `${api.defaults.baseURL}/file/component/${imageName}`;
  };

  const formatTimestamp = (timestamp) => {
    if (
      !timestamp ||
      timestamp === "0" ||
      timestamp === 0 ||
      timestamp === null
    ) {
      return "N/A";
    }

    try {
      let timestampNum = parseInt(timestamp);
      if (timestampNum.toString().length <= 10) {
        timestampNum = timestampNum * 1000;
      }
      const date = dayjs(timestampNum);
      const year = date.year();
      if (year < 2000 || year > 2100) {
        return "Invalid Date";
      }
      return date.isValid()
        ? date.format("MMMM D, YYYY hh:mm:ss A")
        : "Invalid Date";
    } catch (error) {
      console.error(
        "Error formatting timestamp:",
        error,
        "timestamp:",
        timestamp
      );
      return "Invalid Date";
    }
  };

  const formatAddress = (address) => {
    if (!address || address === null || address === undefined) {
      return "N/A";
    }
    const addressStr = String(address).trim();
    if (
      addressStr === "" ||
      addressStr === "null" ||
      addressStr === "undefined"
    ) {
      return "N/A";
    }
    return addressStr;
  };

  const formatFullAddress = (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") {
      return "N/A";
    }
    return address;
  };

  const getStatusDisplay = (status) => {
    const statusStr = String(status);
    switch (statusStr) {
      case "0":
        return (
          <Chip
            label="NOT CERTIFIED"
            sx={{
              backgroundColor: manufacturerColors.warning,
              color: "#ffffff",
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#ffffff" },
            }}
            icon={<Warning />}
          />
        );
      case "1":
        return (
          <Chip
            label="CERTIFIED"
            sx={{
              backgroundColor: manufacturerColors.success,
              color: "#ffffff",
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#ffffff" },
            }}
            icon={<CheckCircle />}
          />
        );
      case "2":
        return (
          <Chip
            label="USED IN ASSEMBLY"
            sx={{
              backgroundColor: manufacturerColors.info,
              color: "#ffffff",
              fontWeight: 600,
            }}
          />
        );
      default:
        return (
          <Chip
            label="UNKNOWN"
            sx={{
              backgroundColor: manufacturerColors.alpha.primary30,
              color: "#ffffff",
              fontWeight: 600,
            }}
          />
        );
    }
  };

  const canBeAssembled = () => {
    return (
      componentData &&
      (componentData.status === 1 || componentData.status === "1") &&
      componentData.status !== 2 &&
      componentData.status !== "2"
    );
  };

  // Enhanced PDF generation with html2canvas + jsPDF for components
  const generatePDF = async () => {
    if (!componentData) return;

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
      pdfContainer.style.padding = "40px 60px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";
      pdfContainer.style.color = "black";
      pdfContainer.style.margin = "0 auto";

      // Get QR code as data URL with error handling
      let qrDataUrl = null;
      try {
        const qrCanvas = document.getElementById("componentQR");
        if (qrCanvas) {
          qrDataUrl = qrCanvas.toDataURL("image/png");
          console.log("✅ QR Code captured successfully");
        } else {
          console.warn("⚠️ QR Code canvas not found");
        }
      } catch (qrError) {
        console.error("❌ QR Code capture failed:", qrError);
      }

      // Get component image URL with error handling
      let componentImageUrl = null;
      try {
        componentImageUrl = getImageUrl(componentData.image);
        if (componentImageUrl) {
          console.log("✅ Component image URL obtained:", componentImageUrl);
        } else {
          console.warn("⚠️ No component image available");
        }
      } catch (imageError) {
        console.error("❌ Image URL generation failed:", imageError);
      }

      // Build the comprehensive HTML content for component
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2c3e50; padding-bottom: 20px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px; font-size: 32px; font-weight: bold;">Component Manufacturing Certificate</h1>
          <p style="color: #666; font-size: 18px; margin: 0;">Precision Engineering Verification</p>
        </div>
        
        <div style="display: flex; gap: 40px; margin-bottom: 40px; align-items: flex-start;">
          <div style="flex: 0 0 280px; text-align: center;">
            <h3 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px;">Component Specimen</h3>
            ${
              componentImageUrl
                ? `<img src="${componentImageUrl}" alt="Component" style="width: 240px; height: 240px; object-fit: cover; border-radius: 12px; border: 2px solid #2c3e50; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" crossorigin="anonymous" />`
                : `<div style="width: 240px; height: 240px; border: 2px dashed #2c3e50; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; background-color: #f5f5f5; color: #666; font-size: 16px;">Component Preview</div>`
            }
            <div style="background-color: #2c3e50; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-top: 10px;">
              ${componentData.componentType}
            </div>
          </div>
          
          <div style="flex: 1;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #e3f2fd; padding-bottom: 8px; margin-bottom: 20px; font-size: 24px;">Manufacturing Certificate</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Component ID</div>
                <div style="color: #333; font-size: 14px; font-weight: 500; font-family: monospace;">${
                  componentData.componentId
                }</div>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Serial Number</div>
                <div style="color: #333; font-size: 14px; font-weight: 500; font-family: monospace;">${
                  componentData.serialNumber
                }</div>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Status</div>
                <span style="padding: 4px 12px; border-radius: 15px; color: white; font-weight: bold; font-size: 11px; text-transform: uppercase; background-color: ${
                  componentData.status === 0 || componentData.status === "0"
                    ? "#ff9800"
                    : componentData.status === 1 || componentData.status === "1"
                    ? "#4caf50"
                    : componentData.status === 2 || componentData.status === "2"
                    ? "#2196f3"
                    : "#9e9e9e"
                };">
                  ${
                    componentData.status === 0 || componentData.status === "0"
                      ? "NOT CERTIFIED"
                      : componentData.status === 1 ||
                        componentData.status === "1"
                      ? "CERTIFIED"
                      : componentData.status === 2 ||
                        componentData.status === "2"
                      ? "USED IN ASSEMBLY"
                      : "UNKNOWN"
                  }
                </span>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Manufacturing Date</div>
                <div style="color: #333; font-size: 14px; font-weight: 500;">${formatTimestamp(
                  componentData.timestamp
                )}</div>
              </div>
              
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9; grid-column: span 2;">
                <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Source Material ID</div>
                <div style="color: #333; font-size: 14px; font-weight: 500; font-family: monospace;">${
                  componentData.rawMaterialId
                }</div>
              </div>
              
              ${
                componentData.location
                  ? `
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9; grid-column: span 2;">
                <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Manufacturing Location</div>
                <div style="color: #333; font-size: 14px; font-weight: 500;">${componentData.location}</div>
              </div>`
                  : ""
              }
            </div>
          </div>
        </div>

        <div style="background-color: #f9f9f9; padding: 25px; border-radius: 10px; border: 1px solid #e0e0e0; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #e3f2fd; padding-bottom: 8px; margin-bottom: 20px; font-size: 22px;">Manufacturer Verification</h2>
          <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: white;">
            <div style="color: #2c3e50; font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Blockchain Address</div>
            <div style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #333; background-color: #f5f5f5; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
              ${formatFullAddress(componentData.manufacturer)}
            </div>
          </div>
        </div>

        ${
          (componentData.status === 1 ||
            componentData.status === "1" ||
            componentData.status === 2 ||
            componentData.status === "2") &&
          rawDbData &&
          getDirectDbValue("certifier_address") !== "N/A"
            ? `
        <div style="background-color: #f0f8ff; padding: 25px; border-radius: 10px; border: 1px solid #4caf50; margin-bottom: 30px;">
          <h2 style="color: #4caf50; border-bottom: 2px solid #4caf50; padding-bottom: 8px; margin-bottom: 20px; font-size: 22px;">Quality Certification</h2>
          
          <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: flex-start;">
            ${
              getDirectDbValue("certifier_image") !== "N/A"
                ? `
            <div style="flex: 0 0 200px; text-align: center;">
              <h4 style="color: #4caf50; margin-bottom: 10px; font-size: 14px; font-weight: bold;">Certification Evidence</h4>
<img src="${api.defaults.baseURL}/file/certifier/${getDirectDbValue(
                    "certifier_image"
                  )}" alt="Certification Evidence" style="width: 180px; height: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #4caf50; display: block; margin: 0 auto;" crossorigin="anonymous" />
            </div>`
                : ""
            }
            
            <div style="flex: 1;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: white;">
                  <div style="color: #4caf50; font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Certifier Address</div>
                  <div style="font-family: 'Courier New', monospace; font-size: 10px; word-break: break-all; color: #333; background-color: #f5f5f5; padding: 8px; border-radius: 4px;">
                    ${getDirectDbValue("certifier_address")}
                  </div>
                </div>
                
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: white;">
                  <div style="color: #4caf50; font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Certification Date</div>
                  <div style="color: #333; font-size: 14px; font-weight: 500;">
                    ${formatTimestamp(getDirectDbValue("certify_timestamp"))}
                  </div>
                </div>
                
                ${
                  getDirectDbValue("certifier_location") !== "N/A"
                    ? `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: white; grid-column: span 2;">
                  <div style="color: #4caf50; font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Certification Facility</div>
                  <div style="color: #333; font-size: 14px; font-weight: 500;">
                    ${getDirectDbValue("certifier_location")}
                  </div>
                </div>`
                    : ""
                }
                
                ${
                  getDirectDbValue("certifier_remarks") !== "N/A"
                    ? `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: white; grid-column: span 2;">
                  <div style="color: #4caf50; font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Quality Assessment</div>
                  <div style="color: #333; font-size: 14px; font-weight: 500;">
                    ${getDirectDbValue("certifier_remarks")}
                  </div>
                </div>`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>`
            : ""
        }

        ${
          qrDataUrl
            ? `
        <div style="text-align: center; margin: 30px 0; padding: 25px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px;">Digital Manufacturing Code</h2>
          <div style="display: inline-block; padding: 15px; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <img src="${qrDataUrl}" alt="QR Code" style="width: 150px; height: 150px;" />
          </div>
          <p style="margin-top: 15px; color: #666; font-size: 12px;">
            Scan this QR code to verify component authenticity
          </p>
        </div>`
            : ""
        }

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e3f2fd; font-size: 11px; color: #666;">
          <p style="margin: 5px 0;">Generated on ${dayjs().format(
            "MMMM D, YYYY hh:mm A"
          )}</p>
          <p style="margin: 5px 0;">Luxury Watch Component Manufacturing System</p>
          <p style="color: #2c3e50; font-size: 12px; font-weight: bold; margin: 10px 0;">Blockchain-Verified Manufacturing Certificate</p>
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
      const fileName = `Component_Certificate_${
        componentData.componentId
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

  // Enhanced image display component with manufacturer theme
  const ImageDisplay = ({ imageName, alt = "Component" }) => {
    const imageUrl = getImageUrl(imageName);

    if (!imageUrl) {
      return (
        <Box
          sx={{
            width: 280,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: manufacturerColors.gradients.forge,
            border: `2px solid ${manufacturerColors.alpha.primary30}`,
            borderRadius: "16px",
            margin: "auto",
            ...manufacturerUtils.getPerformanceStyles(
              {},
              { animation: `${manufacturerStyles.precisionCard.animation}` }
            ),
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "5rem",
                mb: 1,
                filter: `drop-shadow(0 0 8px ${manufacturerColors.alpha.primary30})`,
              }}
            >
              {manufacturerUtils.getComponentIcon(componentData?.componentType)}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: manufacturerColors.primary,
                fontWeight: 600,
                fontFamily: manufacturerTypography.technical,
              }}
            >
              Precision Component
            </Typography>
          </Box>
        </Box>
      );
    }

    if (imageError) {
      return (
        <Box
          sx={{
            width: 280,
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            background: manufacturerColors.alpha.primary05,
            border: `2px dashed ${manufacturerColors.alpha.primary30}`,
            borderRadius: "16px",
          }}
        >
          <Warning
            sx={{ fontSize: "4rem", mb: 1, color: manufacturerColors.warning }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#ffffff", textAlign: "center" }}
          >
            Component Image Not Found
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
              background: manufacturerColors.alpha.primary10,
              borderRadius: "16px",
              zIndex: 1,
            }}
          >
            <CircularProgress sx={{ color: manufacturerColors.primary }} />
          </Box>
        )}
        <CardMedia
          component="img"
          sx={{
            width: 280,
            height: 280,
            objectFit: "cover",
            borderRadius: "16px",
            margin: "auto",
            display: "block",
            border: `2px solid ${manufacturerColors.alpha.primary30}`,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: `0 8px 24px ${manufacturerColors.alpha.primary30}`,
            },
          }}
          image={imageUrl}
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </Box>
    );
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

  const handleAddToAssembly = () => {
    if (
      componentData &&
      (componentData.status === 1 || componentData.status === "1")
    ) {
      console.log(
        "🔧 Adding component to assembly:",
        componentData.componentId
      );

      // Use direct database values for assembly
      const entityDataForAssembly = {
        componentId: componentData.componentId,
        component_id: componentData.componentId,
        componentType: componentData.componentType,
        component_type: componentData.componentType,
        serialNumber: componentData.serialNumber,
        serial_number: componentData.serialNumber,
        manufacturer: componentData.manufacturer,
        manufacturer_address: componentData.manufacturer,
        status: componentData.status,
        certified: true,
        used: componentData.status === 2 || componentData.status === "2",
        rawMaterialId: componentData.rawMaterialId,
        raw_material_id: componentData.rawMaterialId,
        image: componentData.image,
        location: componentData.location,
        timestamp: componentData.timestamp,

        // Use DIRECT database values
        certifiedBy: getDirectDbValue("certifier_address"),
        certifier_address: getDirectDbValue("certifier_address"),
        certificationTimestamp: getDirectDbValue("certify_timestamp"),
        certify_timestamp: getDirectDbValue("certify_timestamp"),
        certifierRemarks: getDirectDbValue("certifier_remarks"),
        certifier_remarks: getDirectDbValue("certifier_remarks"),
        certifierImage: getDirectDbValue("certifier_image"),
        certifier_image: getDirectDbValue("certifier_image"),
        certifierLocation: getDirectDbValue("certifier_location"),
        certifier_location: getDirectDbValue("certifier_location"),
      };

      navigate("/assemble-watch", {
        state: {
          scannedComponentId: componentData.componentId,
          entityData: entityDataForAssembly,
          qrData: qrData,
        },
      });
    } else {
      setError("Component must be certified (status = 1) before assembly");
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("componentQR");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${
        componentData?.componentId || "component"
      }.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={manufacturerMuiTheme}>
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
          <Card sx={manufacturerStyles.precisionCard}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress
                sx={{
                  mb: 2,
                  color: manufacturerColors.primary,
                  animation: `${manufacturerColors.animations?.manufacturerGlow} 2s ease-in-out infinite`,
                }}
              />
              <Typography
                sx={{
                  color: "#ffffff",
                  fontFamily: manufacturerTypography.technical,
                  fontWeight: 600,
                }}
              >
                Loading precision component data...
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={manufacturerMuiTheme}>
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
            width: "95%",
            maxWidth: "1100px",
            margin: "auto",
            padding: "32px",
          }}
        >
          {/* Header Section */}
          <Box sx={{ ...manufacturerStyles.pageHeader, mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: manufacturerTypography.primary,
                fontWeight: 700,
                color: "#ffffff",
                mb: 1,
                textShadow: `0 0 20px ${manufacturerColors.alpha.primary30}`,
              }}
            >
              Precision Component Analysis
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: manufacturerTypography.technical,
                color: manufacturerColors.primary,
                fontWeight: 500,
                letterSpacing: "1px",
              }}
            >
              Master Craftsmanship Verification
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: manufacturerColors.alpha.primary05,
                border: `1px solid ${manufacturerColors.error}`,
                color: "#ffffff",
                "& .MuiAlert-icon": {
                  color: manufacturerColors.error,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {componentData && (
            <>
              {/* Main Information Card */}
              <Card
                sx={{
                  ...manufacturerStyles.precisionCardWithForge,
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
                            color: manufacturerColors.primary,
                            fontFamily: manufacturerTypography.technical,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                          }}
                        >
                          Component Specimen
                        </Typography>
                        <ImageDisplay
                          imageName={componentData.image}
                          alt="Component"
                        />

                        {/* Component Type Badge */}
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label={componentData.componentType}
                            sx={{
                              background: manufacturerColors.gradients.accent,
                              color: "#ffffff",
                              fontWeight: 600,
                              fontSize: "1rem",
                              padding: "10px 6px",
                              fontFamily: manufacturerTypography.technical,
                              "& .MuiChip-label": {
                                padding: "0 16px",
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
                          fontFamily: manufacturerTypography.primary,
                          fontWeight: 700,
                        }}
                      >
                        Manufacturing Certificate
                      </Typography>

                      {/* Component ID */}
                      <Box sx={manufacturerStyles.materialCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: manufacturerColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Component ID
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: manufacturerTypography.mono,
                            color: "#ffffff",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {componentData.componentId}
                        </Typography>
                      </Box>

                      {/* Serial Number */}
                      <Box sx={manufacturerStyles.materialCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: manufacturerColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Serial Number
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: manufacturerTypography.mono,
                            color: "#ffffff",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {componentData.serialNumber}
                        </Typography>
                      </Box>

                      {/* Raw Material ID */}
                      <Box sx={manufacturerStyles.materialCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: manufacturerColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Source Material ID
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: manufacturerTypography.mono,
                            color: "#ffffff",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {componentData.rawMaterialId}
                        </Typography>
                      </Box>

                      {/* Status */}
                      <Box sx={manufacturerStyles.materialCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: manufacturerColors.primary,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Manufacturing Status
                        </Typography>
                        {getStatusDisplay(componentData.status)}
                      </Box>

                      {/* Manufacturing Date */}
                      <Box sx={manufacturerStyles.materialCard}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: manufacturerColors.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Manufacturing Date
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#ffffff",
                            fontFamily: manufacturerTypography.secondary,
                          }}
                        >
                          {formatTimestamp(componentData.timestamp)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Manufacturer Information */}
              <Card
                sx={{
                  ...manufacturerStyles.precisionCard,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: "#ffffff",
                      fontFamily: manufacturerTypography.primary,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Engineering sx={{ color: manufacturerColors.primary }} />
                    Manufacturing Verification
                  </Typography>

                  {/* Manufacturer Address */}
                  <Box sx={manufacturerStyles.materialCard}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: manufacturerColors.primary,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Manufacturer Blockchain Address
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-all",
                        fontFamily: manufacturerTypography.mono,
                        color: "#ffffff",
                        backgroundColor: manufacturerColors.alpha.primary10,
                        p: 2,
                        borderRadius: "8px",
                        border: `1px solid ${manufacturerColors.alpha.primary30}`,
                      }}
                    >
                      {formatAddress(componentData.manufacturer)}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box sx={manufacturerStyles.materialCard}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: manufacturerColors.primary,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Manufacturing Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: "break-word",
                        color: "#ffffff",
                        backgroundColor: manufacturerColors.alpha.primary10,
                        p: 2,
                        borderRadius: "8px",
                        border: `1px solid ${manufacturerColors.alpha.primary30}`,
                      }}
                    >
                      {componentData.location || "N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Certification Information */}
              {(componentData.status === 1 ||
                componentData.status === "1" ||
                componentData.status === 2 ||
                componentData.status === "2") &&
                rawDbData && (
                  <Card
                    sx={{
                      ...manufacturerStyles.precisionCard,
                      mb: 3,
                      background: manufacturerColors.gradients.forge,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          color: manufacturerColors.success,
                          fontFamily: manufacturerTypography.primary,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CheckCircle />
                        Quality Certification
                      </Typography>

                      <Divider
                        sx={{
                          mb: 3,
                          borderColor: manufacturerColors.alpha.primary30,
                        }}
                      />

                      <Grid container spacing={3}>
                        {getDirectDbValue("certifier_image") !== "N/A" && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: manufacturerColors.primary,
                                  mb: 1,
                                  fontWeight: 600,
                                }}
                              >
                                Certification Image
                              </Typography>
                              <CardMedia
                                component="img"
                                sx={{
                                  width: "100%",
                                  height: 140,
                                  objectFit: "cover",
                                  borderRadius: "12px",
                                  border: `2px solid ${manufacturerColors.alpha.primary30}`,
                                }}
                                image={`${
                                  api.defaults.baseURL
                                }/file/certifier/${getDirectDbValue(
                                  "certifier_image"
                                )}`}
                                alt="Certification"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </Box>
                          </Grid>
                        )}
                        <Grid
                          item
                          xs={12}
                          md={
                            getDirectDbValue("certifier_image") !== "N/A"
                              ? 8
                              : 12
                          }
                        >
                          {/* Certifier Address */}
                          <Box sx={manufacturerStyles.materialCard}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: manufacturerColors.primary,
                                fontWeight: 600,
                                mb: 1,
                              }}
                            >
                              Certifier Address
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-all",
                                fontFamily: manufacturerTypography.mono,
                                color: "#ffffff",
                                backgroundColor:
                                  manufacturerColors.alpha.primary10,
                                p: 2,
                                borderRadius: "8px",
                                border: `1px solid ${manufacturerColors.alpha.primary30}`,
                              }}
                            >
                              {getDirectDbValue("certifier_address")}
                            </Typography>
                          </Box>

                          {/* Certification Date */}
                          <Box sx={manufacturerStyles.materialCard}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: manufacturerColors.primary,
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              Certification Date
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#ffffff",
                                fontFamily: manufacturerTypography.secondary,
                              }}
                            >
                              {formatTimestamp(
                                getDirectDbValue("certify_timestamp")
                              )}
                            </Typography>
                          </Box>

                          {/* Certification Location */}
                          <Box sx={manufacturerStyles.materialCard}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: manufacturerColors.primary,
                                fontWeight: 600,
                                mb: 1,
                              }}
                            >
                              Certification Facility
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-word",
                                color: "#ffffff",
                                backgroundColor:
                                  manufacturerColors.alpha.primary10,
                                p: 2,
                                borderRadius: "8px",
                                border: `1px solid ${manufacturerColors.alpha.primary30}`,
                              }}
                            >
                              {getDirectDbValue("certifier_location")}
                            </Typography>
                          </Box>

                          {/* Certification Remarks */}
                          <Box sx={manufacturerStyles.materialCard}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: manufacturerColors.primary,
                                fontWeight: 600,
                                mb: 1,
                              }}
                            >
                              Quality Assessment
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-word",
                                color: "#ffffff",
                                backgroundColor:
                                  manufacturerColors.alpha.primary10,
                                p: 2,
                                borderRadius: "8px",
                                border: `1px solid ${manufacturerColors.alpha.primary30}`,
                              }}
                            >
                              {getDirectDbValue("certifier_remarks")}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}

              {/* Assembly Action for Assemblers */}
              {auth?.role === "assembler" && (
                <Card
                  sx={{
                    ...manufacturerStyles.precisionCard,
                    mb: 3,
                    background: canBeAssembled()
                      ? manufacturerColors.gradients.forge
                      : manufacturerColors.alpha.primary05,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        color: canBeAssembled()
                          ? manufacturerColors.primary
                          : manufacturerColors.warning,
                        fontFamily: manufacturerTypography.primary,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Build />
                      Assembly Integration
                    </Typography>

                    {canBeAssembled() ? (
                      <>
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 3,
                            color: manufacturerColors.success,
                            fontWeight: 500,
                          }}
                        >
                          ✅ Component certified and ready for precision
                          assembly integration.
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleAddToAssembly}
                          startIcon={<Build />}
                          sx={{
                            ...manufacturerStyles.precisionButton.contained,
                            height: "56px",
                            fontSize: "1.1rem",
                          }}
                        >
                          Integrate into Watch Assembly
                        </Button>
                      </>
                    ) : componentData.status === 0 ||
                      componentData.status === "0" ? (
                      <Typography
                        variant="body1"
                        sx={{
                          color: manufacturerColors.warning,
                          fontWeight: 500,
                        }}
                      >
                        ⚠️ Component requires quality certification before
                        assembly integration.
                      </Typography>
                    ) : componentData.status === 2 ||
                      componentData.status === "2" ? (
                      <Typography
                        variant="body1"
                        sx={{ color: manufacturerColors.info, fontWeight: 500 }}
                      >
                        ℹ️ Component has been successfully integrated into
                        another timepiece assembly.
                      </Typography>
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          color: manufacturerColors.error,
                          fontWeight: 500,
                        }}
                      >
                        ❌ Component status indeterminate. Assembly integration
                        unavailable.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* QR Code Section */}
              {qrData && (
                <Card sx={manufacturerStyles.qrSection}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        textAlign: "center",
                        color: "#ffffff",
                        fontFamily: manufacturerTypography.primary,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <QrCode2 sx={{ color: manufacturerColors.primary }} />
                      Digital Manufacturing Code
                    </Typography>

                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          p: 2,
                          background: "#ffffff",
                          borderRadius: "12px",
                          boxShadow: `0 4px 12px ${manufacturerColors.alpha.primary30}`,
                        }}
                      >
                        <QRCode
                          id="componentQR"
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
                        ...manufacturerStyles.precisionButton.contained,
                        fontSize: "1rem",
                      }}
                    >
                      Download Manufacturing Code
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
                      ...manufacturerStyles.precisionButton.outlined,
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
                      ...manufacturerStyles.precisionButton.outlined,
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
                      ...manufacturerStyles.precisionButton.contained,
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
                      ...manufacturerStyles.precisionButton.contained,
                      height: "56px",
                      fontSize: "1.1rem",
                      background: pdfGenerating
                        ? manufacturerColors.alpha.primary30
                        : manufacturerColors.gradients.accent,
                      "&:hover": {
                        background: pdfGenerating
                          ? manufacturerColors.alpha.primary30
                          : manufacturerColors.gradients.forge,
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

export default ViewComponent;
