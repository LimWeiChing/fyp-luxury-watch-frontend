import { Box, Typography, styled } from "@mui/material";

const StatCircle = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: "50%",
  backgroundColor: "#00ffe5", // Bright cyan glow
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  color: "#000",
  fontWeight: "bold",
  fontSize: "48px",
  boxShadow: "0 0 40px #00ffe5",
  [theme.breakpoints.down("sm")]: {
    width: 160,
    height: 160,
    fontSize: "36px",
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: "center",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const Guide = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1e1e1e",
        py: 10,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          fontSize: "42px",
          color: "#ffffff",
          fontWeight: "500",
          mb: 2,
        }}
      >
        From Luxury, For Luxury
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          color: "#ffffff",
          mb: 6,
          maxWidth: 600,
        }}
      >
        The First and Leading Blockchain Solutions Provider Dedicated to the
        Luxury Industry
      </Typography>

      {/* Stats */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {/* Stat 1 */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <StatCircle>+50</StatCircle>
          <StatLabel>Member Brands</StatLabel>
        </Box>

        {/* Stat 2 */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <StatCircle>
            <Box component="span" sx={{ fontSize: "48px" }}>
              +50
            </Box>
          </StatCircle>
          <StatLabel>Products on the Blockchain</StatLabel>
        </Box>
      </Box>
    </Box>
  );
};

export default Guide;
