import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Link,
  Fade,
  Zoom,
} from "@mui/material";
import { styled, alpha, keyframes } from "@mui/material/styles";
import {
  Token,
  OpenInNew,
  Close,
  ContentCopy,
  Download,
  Share,
  Verified,
  Security,
  Storage,
  Timeline,
  Diamond,
  AutoAwesome,
  AccountBalanceWallet,
  QrCode,
  Image as ImageIcon,
  Link as LinkIcon,
  CloudDownload,
  PictureAsPdf,
} from "@mui/icons-material";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  consumerColors,
  consumerTypography,
  consumerUtils,
} from "./ConsumerTheme";

// Artistic animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const nftGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(156, 39, 176, 0.3); }
  50% { box-shadow: 0 0 40px rgba(156, 39, 176, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const ArtisticDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: `linear-gradient(135deg, 
      rgba(26, 26, 26, 0.95) 0%, 
      rgba(45, 45, 45, 0.98) 50%, 
      rgba(26, 26, 26, 0.95) 100%
    )`,
    backdropFilter: "blur(20px)",
    border: `2px solid ${alpha("#9c27b0", 0.3)}`,
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
    overflow: "hidden",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, #9c27b0, #673ab7, #3f51b5, #2196f3)",
      animation: `${shimmer} 2s infinite`,
    },
  },
}));

const NftDialogTitle = styled(DialogTitle)({
  background: `linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #3f51b5 100%)`,
  color: "#ffffff",
  padding: "24px 32px",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
    transform: "translateX(-100%)",
    animation: `${shimmer} 3s infinite`,
  },
});

const ArtisticNftCard = styled(Card)({
  background: `linear-gradient(135deg, 
    ${alpha("#9c27b0", 0.1)} 0%, 
    ${alpha("#673ab7", 0.15)} 50%, 
    ${alpha("#3f51b5", 0.1)} 100%
  )`,
  border: `2px solid ${alpha("#9c27b0", 0.3)}`,
  borderRadius: "16px",
  position: "relative",
  overflow: "hidden",
  animation: `${nftGlow} 4s infinite ease-in-out`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 50% 50%, 
      ${alpha("#9c27b0", 0.1)} 0%, 
      transparent 70%
    )`,
    pointerEvents: "none",
  },
});

const NftImageContainer = styled(Box)({
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  background: `linear-gradient(135deg, ${alpha("#9c27b0", 0.2)} 0%, ${alpha(
    "#673ab7",
    0.2
  )} 100%)`,
  border: `2px solid ${alpha("#9c27b0", 0.4)}`,
  animation: `${float} 6s infinite ease-in-out`,
  "&:hover": {
    transform: "scale(1.02)",
    transition: "transform 0.3s ease",
  },
});

const AttributeChip = styled(Chip)(({ variant }) => ({
  background:
    variant === "primary"
      ? `linear-gradient(45deg, #9c27b0, #673ab7)`
      : `${alpha("#9c27b0", 0.2)}`,
  color: "#ffffff",
  fontWeight: 600,
  border: `1px solid ${alpha("#9c27b0", 0.4)}`,
  borderRadius: "8px",
  "& .MuiChip-label": {
    fontFamily: consumerTypography.accent,
  },
}));

const InfoSection = styled(Paper)({
  background: `linear-gradient(135deg, 
    ${alpha(consumerColors.primary, 0.1)} 0%, 
    ${alpha("#9c27b0", 0.15)} 100%
  )`,
  border: `1px solid ${alpha("#9c27b0", 0.2)}`,
  borderRadius: "12px",
  padding: "20px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "linear-gradient(180deg, #9c27b0, #673ab7)",
    borderRadius: "2px",
  },
});

const ActionButton = styled(Button)(({ variant, color }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.95rem",
  fontFamily: consumerTypography.accent,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",

  ...(variant === "contained" && {
    background:
      color === "primary"
        ? "linear-gradient(45deg, #9c27b0, #673ab7)"
        : "linear-gradient(45deg, #ff6f00, #ff8f00)",
    color: "#ffffff",
    boxShadow: `0 4px 20px ${alpha(
      color === "primary" ? "#9c27b0" : "#ff6f00",
      0.4
    )}`,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 8px 30px ${alpha(
        color === "primary" ? "#9c27b0" : "#ff6f00",
        0.6
      )}`,
    },
  }),

  ...(variant === "outlined" && {
    border: `2px solid ${alpha(
      color === "primary" ? "#9c27b0" : "#ff6f00",
      0.5
    )}`,
    color: color === "primary" ? "#9c27b0" : "#ff6f00",
    background: alpha(color === "primary" ? "#9c27b0" : "#ff6f00", 0.1),
    "&:hover": {
      background: alpha(color === "primary" ? "#9c27b0" : "#ff6f00", 0.2),
      borderColor: color === "primary" ? "#9c27b0" : "#ff6f00",
      transform: "translateY(-1px)",
    },
  }),
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  textAlign: "center",
});

// Enhanced text truncation component with copy functionality
const TruncatedText = styled(Box)(({ maxwidth = "200px" }) => ({
  maxWidth: maxwidth,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  cursor: "pointer",
  "&:hover": {
    color: "#9c27b0",
  },
}));

const ViewNFT = ({ open, onClose, watch, onError }) => {
  const [nftMetadata, setNftMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fetch NFT metadata when dialog opens
  useEffect(() => {
    if (open && watch?.nft_metadata_uri) {
      fetchNftMetadata();
    } else if (!open) {
      // Reset state when dialog closes
      setNftMetadata(null);
      setImageLoading(true);
      setImageError(false);
      setCopySuccess("");
      setPdfLoading(false);
    }
  }, [open, watch]);

  const fetchNftMetadata = async () => {
    if (!watch?.nft_metadata_uri) {
      if (onError) onError("No NFT metadata available for this watch");
      return;
    }

    setLoading(true);
    try {
      let metadataUrl = watch.nft_metadata_uri;

      // Convert IPFS URI to HTTP gateway
      if (metadataUrl.startsWith("ipfs://")) {
        metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataUrl.slice(
          7
        )}`;
      }

      const response = await axios.get(metadataUrl, {
        timeout: 15000,
        headers: {
          Accept: "application/json",
        },
      });

      setNftMetadata(response.data);
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      if (onError) {
        onError("Failed to fetch NFT metadata. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!nftMetadata || !watch) return;

    setPdfLoading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Set fonts
      doc.setFont("helvetica");

      // Header with gradient effect (simulated with colors)
      doc.setFillColor(156, 39, 176); // Purple color
      doc.rect(0, 0, pageWidth, 25, "F");

      // Title
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("NFT Digital Certificate", pageWidth / 2, 16, {
        align: "center",
      });

      // Reset text color for body
      doc.setTextColor(0, 0, 0);
      yPosition = 40;

      // NFT Basic Information
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("NFT Information", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // NFT Details
      const nftInfo = [
        ["Name:", nftMetadata.name || "N/A"],
        ["Watch ID:", watch.watch_id || "N/A"],
        ["Description:", nftMetadata.description || "N/A"],
        ["Token Standard:", "ERC-721"],
        ["Storage:", "IPFS"],
        ["Blockchain:", "Ethereum"],
      ];

      nftInfo.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, yPosition);
        doc.setFont("helvetica", "normal");

        // Handle long text by splitting lines
        const textWidth = pageWidth - margin * 2 - 60;
        const splitValue = doc.splitTextToSize(value, textWidth);
        doc.text(splitValue, margin + 60, yPosition);
        yPosition += splitValue.length * 6 + 3;
      });

      yPosition += 10;

      // NFT Attributes Section
      if (nftMetadata.attributes && nftMetadata.attributes.length > 0) {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("NFT Attributes", margin, yPosition);
        yPosition += 15;

        // Create table for attributes
        const attributeData = nftMetadata.attributes.map((attr) => [
          attr.trait_type || "N/A",
          String(attr.value || "N/A"),
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Trait Type", "Value"]],
          body: attributeData,
          theme: "striped",
          headStyles: {
            fillColor: [156, 39, 176],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 10,
            cellPadding: 5,
          },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 110 },
          },
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }

      // Supply Chain Information
      if (nftMetadata.supply_chain) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Supply Chain Provenance", margin, yPosition);
        yPosition += 15;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        const supplyChainData = [];

        if (nftMetadata.supply_chain.components) {
          supplyChainData.push([
            "Components",
            `${nftMetadata.supply_chain.components.length || 0} verified parts`,
          ]);
        }

        if (nftMetadata.supply_chain.assembly) {
          const qualityStatus = nftMetadata.supply_chain.assembly
            .quality_assured
            ? "Quality Assured"
            : "Standard";
          supplyChainData.push(["Assembly Status", qualityStatus]);
        }

        if (nftMetadata.supply_chain.raw_materials) {
          supplyChainData.push([
            "Raw Materials",
            `${
              nftMetadata.supply_chain.raw_materials.length || 0
            } certified materials`,
          ]);
        }

        if (supplyChainData.length > 0) {
          doc.autoTable({
            startY: yPosition,
            head: [["Category", "Details"]],
            body: supplyChainData,
            theme: "striped",
            headStyles: {
              fillColor: [103, 58, 183],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            styles: {
              fontSize: 10,
              cellPadding: 5,
            },
          });

          yPosition = doc.lastAutoTable.finalY + 20;
        }
      }

      // Blockchain Provenance
      if (nftMetadata.provenance) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Blockchain Provenance", margin, yPosition);
        yPosition += 15;

        const provenanceData = [
          [
            "Token Standard",
            nftMetadata.provenance.token_standard || "ERC-721",
          ],
          [
            "Storage Provider",
            nftMetadata.provenance.storage_provider || "IPFS",
          ],
          [
            "Blockchain Network",
            nftMetadata.provenance.blockchain || "Ethereum",
          ],
        ];

        doc.autoTable({
          startY: yPosition,
          head: [["Property", "Value"]],
          body: provenanceData,
          theme: "striped",
          headStyles: {
            fillColor: [63, 81, 181],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 10,
            cellPadding: 5,
          },
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }

      // Technical Details
      if (watch.nft_metadata_uri) {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Technical Details", margin, yPosition);
        yPosition += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Metadata URI:", margin, yPosition);
        yPosition += 8;

        // Split long URI across multiple lines if needed
        const uri = watch.nft_metadata_uri;
        const splitUri = doc.splitTextToSize(uri, pageWidth - margin * 2);
        doc.setFont("courier", "normal");
        doc.text(splitUri, margin, yPosition);
        yPosition += splitUri.length * 6;
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY);
      doc.text("Luxury Watch NFT Certificate", pageWidth - margin, footerY, {
        align: "right",
      });

      // Generate filename
      const fileName = `NFT_Certificate_${watch.watch_id}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Save the PDF
      doc.save(fileName);

      // Show success message
      setCopySuccess("PDF downloaded successfully!");
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (onError) {
        onError("Failed to generate PDF. Please try again.");
      }
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCopyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getIpfsGatewayUrl = (ipfsUri) => {
    if (!ipfsUri) return null;
    if (ipfsUri.startsWith("ipfs://")) {
      return `https://gateway.pinata.cloud/ipfs/${ipfsUri.slice(7)}`;
    }
    if (ipfsUri.startsWith("Qm") && ipfsUri.length === 46) {
      return `https://gateway.pinata.cloud/ipfs/${ipfsUri}`;
    }
    return ipfsUri;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getNftImageUrl = () => {
    if (watch?.nft_image_uri) {
      return getIpfsGatewayUrl(watch.nft_image_uri);
    }
    if (nftMetadata?.image) {
      return getIpfsGatewayUrl(nftMetadata.image);
    }
    return null;
  };

  const formatAttributeValue = (value) => {
    if (typeof value === "string" && value.length > 50) {
      return `${value.slice(0, 50)}...`;
    }
    return value;
  };

  // Enhanced address formatting with copy functionality
  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (address.length > 42) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  if (!open) return null;

  return (
    <ArtisticDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
    >
      <NftDialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              background: "linear-gradient(45deg, #ffa000, #ff6f00)",
              width: 48,
              height: 48,
              animation: `${float} 3s infinite ease-in-out`,
            }}
          >
            <Token sx={{ fontSize: 24 }} />
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: consumerTypography.luxury,
                color: "#ffffff",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              NFT Digital Certificate
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontFamily: consumerTypography.secondary,
                color: "#ffffff",
              }}
            >
              {watch?.watch_id} - Blockchain Authenticated Luxury Timepiece
            </Typography>
          </Box>

          <Tooltip title="Close">
            <IconButton
              onClick={onClose}
              sx={{
                color: "#ffffff",
                "&:hover": {
                  background: alpha("#ffffff", 0.1),
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Stack>
      </NftDialogTitle>

      <DialogContent
        sx={{
          background: "#1a1a1a",
          color: "#ffffff",
          padding: "32px",
          minHeight: "60vh",
        }}
      >
        {loading ? (
          <LoadingContainer>
            <Zoom in timeout={600}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: "linear-gradient(45deg, #9c27b0, #673ab7)",
                  mb: 3,
                  animation: `${float} 2s infinite ease-in-out`,
                }}
              >
                <AutoAwesome sx={{ fontSize: 40 }} />
              </Avatar>
            </Zoom>
            <CircularProgress
              size={60}
              sx={{
                color: "#9c27b0",
                mb: 3,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontFamily: consumerTypography.accent,
                mb: 1,
              }}
            >
              Loading NFT Metadata
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Fetching blockchain certificate data...
            </Typography>
          </LoadingContainer>
        ) : nftMetadata ? (
          <Fade in timeout={800}>
            <Box>
              {/* NFT Header */}
              <ArtisticNftCard sx={{ mb: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <NftImageContainer>
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
                              background: alpha("#9c27b0", 0.2),
                              zIndex: 2,
                            }}
                          >
                            <CircularProgress sx={{ color: "#9c27b0" }} />
                          </Box>
                        )}

                        {getNftImageUrl() && !imageError ? (
                          <Box
                            component="img"
                            src={getNftImageUrl()}
                            alt="NFT Image"
                            sx={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              display: imageLoading ? "none" : "block",
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 200,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#9c27b0",
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 60, mb: 1 }} />
                            <Typography
                              variant="body2"
                              sx={{ color: "#ffffff" }}
                            >
                              {imageError ? "Image not available" : "No image"}
                            </Typography>
                          </Box>
                        )}
                      </NftImageContainer>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: "#ffffff",
                              fontFamily: consumerTypography.luxury,
                              mb: 1,
                              textShadow: "0 2px 8px rgba(156, 39, 176, 0.3)",
                            }}
                          >
                            {nftMetadata.name}
                          </Typography>

                          {nftMetadata.description && (
                            <Typography
                              variant="body1"
                              sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                lineHeight: 1.6,
                                fontFamily: consumerTypography.secondary,
                              }}
                            >
                              {nftMetadata.description}
                            </Typography>
                          )}
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <AttributeChip
                            icon={<Verified />}
                            label="ERC-721"
                            variant="primary"
                            size="small"
                          />
                          <AttributeChip
                            icon={<Security />}
                            label="Blockchain Verified"
                            variant="secondary"
                            size="small"
                          />
                          <AttributeChip
                            icon={<Storage />}
                            label="IPFS Stored"
                            variant="secondary"
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </ArtisticNftCard>

              {/* NFT Attributes - Enhanced with better text handling */}
              {nftMetadata.attributes && nftMetadata.attributes.length > 0 && (
                <InfoSection sx={{ mb: 3 }}>
                  <Box sx={{ pl: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        color: "#9c27b0",
                        fontFamily: consumerTypography.accent,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Diamond sx={{ mr: 1 }} />
                      NFT Attributes
                    </Typography>

                    <Grid container spacing={2}>
                      {nftMetadata.attributes.map((attr, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            sx={{
                              p: 2,
                              background: alpha("#9c27b0", 0.1),
                              border: `1px solid ${alpha("#9c27b0", 0.2)}`,
                              borderRadius: "8px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: `0 4px 20px ${alpha(
                                  "#9c27b0",
                                  0.3
                                )}`,
                              },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                fontWeight: 600,
                              }}
                            >
                              {attr.trait_type}
                            </Typography>

                            {/* Enhanced value display with copy functionality for addresses */}
                            {attr.trait_type
                              ?.toLowerCase()
                              .includes("address") ? (
                              <Tooltip title={`Click to copy: ${attr.value}`}>
                                <TruncatedText
                                  onClick={() =>
                                    handleCopyToClipboard(
                                      attr.value,
                                      attr.trait_type
                                    )
                                  }
                                  sx={{
                                    fontWeight: 600,
                                    color: "#ffffff",
                                    fontFamily: consumerTypography.mono,
                                    fontSize: "0.9rem",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {formatAddress(attr.value)}
                                  <ContentCopy
                                    sx={{ ml: 1, fontSize: 14, opacity: 0.7 }}
                                  />
                                </TruncatedText>
                              </Tooltip>
                            ) : (
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  color: "#ffffff",
                                  fontFamily: consumerTypography.accent,
                                  wordBreak: "break-word",
                                }}
                              >
                                {formatAttributeValue(attr.value)}
                              </Typography>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </InfoSection>
              )}

              {/* Supply Chain Data */}
              {nftMetadata.supply_chain && (
                <InfoSection sx={{ mb: 3 }}>
                  <Box sx={{ pl: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        color: consumerColors.primary,
                        fontFamily: consumerTypography.accent,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Timeline sx={{ mr: 1 }} />
                      Supply Chain Provenance
                    </Typography>

                    <Grid container spacing={3}>
                      {nftMetadata.supply_chain.components && (
                        <Grid item xs={12} md={6}>
                          <Paper
                            sx={{
                              p: 2,
                              background: alpha(consumerColors.primary, 0.1),
                              border: `1px solid ${alpha(
                                consumerColors.primary,
                                0.2
                              )}`,
                              borderRadius: "8px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#ffffff", mb: 1 }}
                            >
                              <strong>Certified Components:</strong>
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: consumerColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              {nftMetadata.supply_chain.components?.length || 0}{" "}
                              verified parts
                            </Typography>
                          </Paper>
                        </Grid>
                      )}

                      {nftMetadata.supply_chain.assembly && (
                        <Grid item xs={12} md={6}>
                          <Paper
                            sx={{
                              p: 2,
                              background: alpha(consumerColors.success, 0.1),
                              border: `1px solid ${alpha(
                                consumerColors.success,
                                0.2
                              )}`,
                              borderRadius: "8px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#ffffff", mb: 1 }}
                            >
                              <strong>Assembly Status:</strong>
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: consumerColors.success,
                                fontWeight: 600,
                              }}
                            >
                              {nftMetadata.supply_chain.assembly
                                ?.quality_assured
                                ? "Quality Assured"
                                : "Standard"}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </InfoSection>
              )}

              {/* Blockchain Provenance */}
              {nftMetadata.provenance && (
                <InfoSection>
                  <Box sx={{ pl: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        color: "#673ab7",
                        fontFamily: consumerTypography.accent,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AccountBalanceWallet sx={{ mr: 1 }} />
                      Blockchain Provenance
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}
                        >
                          Token Standard
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#ffffff", fontWeight: 600 }}
                        >
                          {nftMetadata.provenance.token_standard || "ERC-721"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}
                        >
                          Storage Provider
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#ffffff", fontWeight: 600 }}
                        >
                          {nftMetadata.provenance.storage_provider || "IPFS"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}
                        >
                          Blockchain Network
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#ffffff", fontWeight: 600 }}
                        >
                          {nftMetadata.provenance.blockchain || "Ethereum"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </InfoSection>
              )}

              {/* Copy Success Notification */}
              {copySuccess && (
                <Fade in timeout={300}>
                  <Box
                    sx={{
                      position: "fixed",
                      top: 20,
                      right: 20,
                      background: "linear-gradient(45deg, #4caf50, #388e3c)",
                      color: "#ffffff",
                      px: 3,
                      py: 1,
                      borderRadius: "20px",
                      zIndex: 9999,
                      boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {copySuccess}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
          </Fade>
        ) : (
          <LoadingContainer>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(45deg, #f44336, #d32f2f)",
                mb: 3,
              }}
            >
              <Close sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontFamily: consumerTypography.accent,
                mb: 1,
              }}
            >
              No NFT Data Available
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Unable to load NFT metadata for this watch
            </Typography>
          </LoadingContainer>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          background: "#1a1a1a",
          borderTop: `1px solid ${alpha("#9c27b0", 0.2)}`,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: "100%" }}
          flexWrap="wrap"
        >
          <ActionButton
            onClick={onClose}
            variant="outlined"
            color="primary"
            startIcon={<Close />}
          >
            Close
          </ActionButton>
        </Stack>
      </DialogActions>
    </ArtisticDialog>
  );
};

export default ViewNFT;
