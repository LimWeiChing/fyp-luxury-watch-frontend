import React from "react";
import { Box, Typography, styled } from "@mui/material";

// List of 20 sample brand names (replace with actual logos)
const brandLogos = [
  "rolex.png",
  "omega.png",
  "cartier.png",
  "audemars.png",
  "patek.png",
  "bvlgari.png",
  "hublot.png",
  "tagheuer.png",
  "longines.png",
  "tissot.png",
  "rado.png",
  "iwc.png",
  "seiko.png",
  "casio.png",
  "hermes.png",
  "blancpain.png",
  "breguet.png",
  "panerai.png",
  "chopard.png",
  "zenith.png",
];

// Styled components
const ScrollingWrapper = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "relative",
  background: "#ffffff",
  padding: theme.spacing(4, 0),
}));

const ScrollTrack = styled(Box)(({ theme }) => ({
  display: "inline-block",
  animation: "scrollLeft 60s linear infinite",
  "& > img": {
    height: 120,
    margin: theme.spacing(0, 3),
    verticalAlign: "middle",
    filter: "grayscale(100%) opacity(0.8)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      filter: "grayscale(0%) opacity(1)",
    },
  },
  "@keyframes scrollLeft": {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-50%)" },
  },
}));

const Companies = () => {
  return (
    <Box sx={{ backgroundColor: "#fff", py: 8, px: 2 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 4,
          fontFamily: "serif",
        }}
      >
        Some of our Member Brands:
      </Typography>

      <ScrollingWrapper>
        <ScrollTrack>
          {/* Duplicate the logos to ensure seamless loop */}
          {[...brandLogos, ...brandLogos].map((logo, idx) => (
            <img
              key={idx}
              src={`/img/brands/${logo}`}
              alt={logo.replace(".png", "")}
            />
          ))}
        </ScrollTrack>
      </ScrollingWrapper>

      {/* Discover all button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Box
          component="button"
          sx={{
            backgroundColor: "#00ffe5",
            color: "#000",
            px: 4,
            py: 1,
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#00d8c0",
            },
          }}
        >
          DISCOVER ALL →
        </Box>
      </Box>
    </Box>
  );
};

export default Companies;
