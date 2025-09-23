import React from "react";
import { Box, Container, Typography, styled } from "@mui/material";
import logo from "../../img/logo.png";
import linkedinIcon from "../../img/linkedinicon.png";
import xIcon from "../../img/twittericon.png"; // Twitter = X

// Wrapper for the entire footer
const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#1c1c1c",
  color: "#00ffe5",
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
  borderTop: "1px dotted #00ffe5",
}));

// Grid layout for content sections
const FooterGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
}));

// Column structure
const FooterColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

// Section title style
const FooterTitle = styled(Typography)({
  fontWeight: 600,
  color: "#ffffff",
  textTransform: "uppercase",
  fontSize: "14px",
  marginBottom: "8px",
});

// Footer link style
const FooterLink = styled("a")({
  color: "#00ffe5",
  fontSize: "14px",
  fontWeight: 400,
  textDecoration: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#ffffff",
    transform: "translateX(4px)",
  },
});

// Social icon style with hover animation
const SocialIcon = styled("img")({
  width: 24,
  height: 24,
  border: "1px dotted #00ffe5",
  borderRadius: "50%",
  padding: "6px",
  marginLeft: "10px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: "#00ffe5",
    filter: "invert(1)",
  },
});

// Gradient animated brand name
const BrandText = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "16px",
  textAlign: "center",
  background:
    "linear-gradient(to right,#c0e6fd,#80aad3,#5b86b6,#3f6593,#1b3554)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: "gradientFade 3s ease-in-out infinite alternate",
  "@keyframes gradientFade": {
    from: { opacity: 0.7 },
    to: { opacity: 1 },
  },
}));

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <FooterGrid>
          {/* Logo and Brand Name */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="LWC Logo"
              style={{ width: "80px", marginBottom: "10px" }}
            />
            <BrandText>Luxury Watch Chain</BrandText>
          </Box>

          {/* Footer Links */}
          <Box
            sx={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <FooterColumn>
              <FooterTitle>ABOUT</FooterTitle>
              <FooterLink href="#">ABOUT</FooterLink>
              <FooterLink href="#">GOVERNANCE</FooterLink>
              <FooterLink href="#">SOLUTIONS</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>MEMBERS</FooterTitle>
              <FooterLink href="#">MEMBERS</FooterLink>
              <FooterLink href="#">TECHNICAL SUPPORT</FooterLink>
              <FooterLink href="#">FAQS</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>PRESS</FooterTitle>
              <FooterLink href="#">PRESS</FooterLink>
              <FooterLink href="#">CONTACTS</FooterLink>
              <FooterLink href="#">JOIN THE TEAM</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>FIND US ON</FooterTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SocialIcon src={linkedinIcon} alt="LinkedIn" />
                <SocialIcon src={xIcon} alt="X" />
              </Box>
            </FooterColumn>
          </Box>
        </FooterGrid>

        {/* Divider Line */}
        <Box
          sx={{
            width: "100%",
            height: "1px",
            borderBottom: "1px dotted #00ffe5",
            my: 4,
          }}
        />

        {/* Copyright & Legal */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ color: "#fff", fontSize: "13px", mb: 1 }}
          >
            ©2025 LWC Blockchain. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "13px" }}>
            <FooterLink href="#">Privacy Policy</FooterLink> |{" "}
            <FooterLink href="#">Cookie Policy</FooterLink> |{" "}
            <FooterLink href="#">Terms & Conditions</FooterLink>
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
