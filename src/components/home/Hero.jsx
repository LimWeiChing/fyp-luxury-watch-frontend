import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import V1 from "../../img/V1.mp4";
import logo from "../../img/logo.png";
import CustomButton from "./CustomButton";

// Styled AppBar with scroll effect
const TransparentAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? "#ffffff" : "transparent",
  boxShadow: scrolled ? theme.shadows[4] : "none",
  transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
}));

// Logo and Brand
const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const Logo = styled("img")({
  height: "60px", // Zoomed in for clarity
  marginRight: "14px",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

// Gradient text animation
const BrandText = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "20px",
  background:
    "linear-gradient(to right,#c0e6fd,#80aad3,#5b86b6,#3f6593,#1b3554,#000f22)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: "gradientFade 3s ease-in-out infinite alternate",
  "@keyframes gradientFade": {
    from: { opacity: 0.7 },
    to: { opacity: 1 },
  },
}));

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* AppBar */}
      <TransparentAppBar position="fixed" scrolled={scrolled ? 1 : 0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <LogoContainer>
            <Logo src={logo} alt="LWC Logo" />
            <BrandText>Luxury Watch Chain</BrandText>
          </LogoContainer>

          <Box sx={{ display: "flex", gap: 3 }}>
            {[
              "ABOUT",
              "SOLUTIONS",
              "CUSTOMER JOURNEY",
              "LICENSES",
              "RESOURCES",
            ].map((label, i) => (
              <Button
                key={i}
                component={Link}
                to=""
                sx={{
                  color: scrolled ? "#1a1a1a" : "inherit",
                  fontWeight: scrolled ? "bold" : "normal",
                }}
              >
                {label}
              </Button>
            ))}

            <Button
              sx={{ color: "#00c2b8", fontWeight: "bold" }}
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </TransparentAppBar>

      {/* Fullscreen autoplay video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
        }}
      >
        <source src={V1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Scan QR Button at bottom center */}
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Link to="/scanner">
          <CustomButton
            backgroundColor="#0F1B4C"
            color="#fff"
            buttonText="Scan QR"
            heroBtn={true}
          />
        </Link>
      </Box>
    </Box>
  );
};

export default Hero;
