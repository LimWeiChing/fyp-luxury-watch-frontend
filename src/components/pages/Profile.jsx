import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Fade,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Person,
  Business,
  Language,
  LocationOn,
  Email,
  Phone,
  AccountBalanceWallet,
  CalendarToday,
  Description,
  AccountCircle,
  Refresh,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Enhanced animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(169, 169, 169, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(169, 169, 169, 0.6);
  }
`;

// Styled Components with luxury theme
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 40, 40, 0.9) 100%),
    radial-gradient(circle at 50% 50%, rgba(169, 169, 169, 0.1) 0%, transparent 70%)
  `,
  backgroundAttachment: "fixed",
  padding: theme.spacing(3),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 50% 50%, rgba(169, 169, 169, 0.05) 0%, transparent 70%)",
    zIndex: 0,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: "800px",
  margin: "auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
  background:
    "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  color: "#ffffff",
  animation: `${fadeInUp} 0.6s ease-out`,
  position: "relative",
  zIndex: 1,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, #a9a9a9, transparent)",
    borderRadius: "16px 16px 0 0",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #a9a9a9 0%, #868686 100%)",
  color: "#ffffff",
  boxShadow: "0 4px 16px rgba(169, 169, 169, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #868686 0%, #a9a9a9 100%)",
    boxShadow: "0 6px 24px rgba(169, 169, 169, 0.4)",
    transform: "translateY(-2px)",
  },
}));

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  border: "1px solid rgba(169, 169, 169, 0.5)",
  color: "#a9a9a9",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "rgba(169, 169, 169, 0.1)",
    borderColor: "#a9a9a9",
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: "rgba(169, 169, 169, 0.1)",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(169, 169, 169, 0.2)",
  },
}));

const roleConfig = {
  supplier: { color: "#4caf50", icon: "🏭", label: "Supplier" },
  manufacturer: { color: "#2196f3", icon: "⚙️", label: "Manufacturer" },
  certifier: { color: "#ff9800", icon: "✅", label: "Certifier" },
  assembler: { color: "#9c27b0", icon: "🔧", label: "Assembler" },
  distributor: { color: "#795548", icon: "🚚", label: "Distributor" },
  retailer: { color: "#e91e63", icon: "🏪", label: "Retailer" },
  consumer: { color: "#607d8b", icon: "👤", label: "Consumer" },
  admin: { color: "#f44336", icon: "👑", label: "Administrator" },
};

const Profile = () => {
  const [profileData, setProfileData] = useState({
    id: null,
    username: "",
    name: "",
    description: "",
    role: "",
    website: "",
    location: "",
    email: "",
    phone: "",
    wallet_address: "",
    image: "",
    created_at: "",
    updated_at: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getProfileImage = () => {
    if (imageError || !profileData.image) {
      return null;
    }
    return `${api.defaults.baseURL}/file/profile/${profileData.image}`;
  };

  const getInitials = () => {
    if (profileData.name) {
      return profileData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (profileData.username) {
      return profileData.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getRoleColor = (role) => {
    return roleConfig[role?.toLowerCase()]?.color || "#757575";
  };

  const getRoleConfig = (role) => {
    return roleConfig[role?.toLowerCase()] || roleConfig.consumer;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleData = async () => {
    if (!auth.user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    console.log("=== FETCHING PROFILE DATA ===");
    console.log("Auth user:", auth.user);
    console.log("============================");

    try {
      setLoading(true);
      setError("");

      // Use the corrected profile endpoint
      let response;

      try {
        // Try to get user by the auth identifier (could be ID or username)
        response = await api.get(`/profile/${auth.user}`, {
          timeout: 15000,
        });

        console.log("✅ Profile API response:", response.data);

        if (response.data.success && response.data.data) {
          // Use the data from the successful API response
          const userData = response.data.data;
          console.log("✅ Profile data received:", userData);

          setProfileData({
            id: userData.id || null,
            username: userData.username || "Unknown",
            name: userData.name || "",
            description: userData.description || "",
            role: userData.role || "consumer",
            website: userData.website || "",
            location: userData.location || "",
            email: userData.email || "",
            phone: userData.phone || "",
            wallet_address: userData.wallet_address || "",
            image: userData.image || "",
            created_at: userData.created_at || "",
            updated_at: userData.updated_at || "",
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (firstError) {
        console.log("First attempt failed, trying fallback approach...");

        // Fallback: try getting all users and find the right one
        const allUsersResponse = await api.get("/users", {
          timeout: 15000,
        });

        const userData = allUsersResponse.data.find(
          (user) => user.username === auth.user || user.id == auth.user
        );

        if (!userData) {
          throw new Error("Profile not found for this user");
        }

        console.log("✅ Fallback profile data received:", userData);

        setProfileData({
          id: userData.id || null,
          username: userData.username || "Unknown",
          name: userData.name || "",
          description: userData.description || "",
          role: userData.role || "consumer",
          website: userData.website || "",
          location: userData.location || "",
          email: userData.email || "",
          phone: userData.phone || "",
          wallet_address: userData.wallet_address || "",
          image: userData.image || "",
          created_at: userData.created_at || "",
          updated_at: userData.updated_at || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);

      let errorMessage = "Failed to load profile data";

      if (!err?.response) {
        errorMessage =
          "Server is not responding. Please check if the server is running.";
      } else if (err.response?.status === 404) {
        errorMessage =
          "Profile not found. Please check if your account exists.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error occurred while fetching profile.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleData();
  }, [auth.user]);

  if (loading) {
    return (
      <StyledContainer>
        <StyledPaper elevation={24}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#a9a9a9", mb: 3 }} />
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Loading your profile...
            </Typography>
          </Box>
        </StyledPaper>
      </StyledContainer>
    );
  }

  const roleConf = getRoleConfig(profileData.role);

  return (
    <StyledContainer>
      <StyledPaper elevation={24}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <AccountCircle sx={{ fontSize: 48, color: "#a9a9a9", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", "Gambetta", serif',
              fontWeight: 700,
              background: "linear-gradient(45deg, #ffffff 70%, #a9a9a9 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Profile Details
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Your luxury watch supply chain identity
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Fade in={!!error}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                borderLeft: "4px solid #f44336",
                color: "#ffffff",
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Profile Content */}
        <Grid container spacing={4}>
          {/* Left Column - Profile Image and Basic Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                src={getProfileImage()}
                onError={handleImageError}
                sx={{
                  width: 180,
                  height: 180,
                  margin: "auto",
                  mb: 3,
                  backgroundColor: roleConf.color,
                  fontSize: "4rem",
                  fontWeight: "bold",
                  border: `3px solid ${roleConf.color}40`,
                  animation: `${pulseGlow} 3s infinite`,
                }}
              >
                {getInitials()}
              </Avatar>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  color: "#ffffff",
                }}
              >
                {profileData.name || profileData.username}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 2,
                }}
              >
                @{profileData.username}
              </Typography>

              <Chip
                icon={<span style={{ fontSize: "20px" }}>{roleConf.icon}</span>}
                label={roleConf.label}
                sx={{
                  backgroundColor: `${roleConf.color}20`,
                  color: roleConf.color,
                  border: `2px solid ${roleConf.color}40`,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  height: "40px",
                  mb: 2,
                }}
              />

              {profileData.description && (
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    color: "rgba(255, 255, 255, 0.8)",
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(169, 169, 169, 0.1)",
                    border: "1px solid rgba(169, 169, 169, 0.2)",
                  }}
                >
                  "{profileData.description}"
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Right Column - Detailed Information */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12}>
                <InfoCard>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#a9a9a9", fontWeight: "bold" }}
                    >
                      Contact Information
                    </Typography>

                    <Grid container spacing={2}>
                      {profileData.email && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "rgba(33, 150, 243, 0.1)",
                              border: "1px solid rgba(33, 150, 243, 0.3)",
                            }}
                          >
                            <Email sx={{ mr: 2, color: "#2196f3" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: "#2196f3" }}
                              >
                                Email
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ffffff" }}
                              >
                                {profileData.email}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}

                      {profileData.phone && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                              border: "1px solid rgba(76, 175, 80, 0.3)",
                            }}
                          >
                            <Phone sx={{ mr: 2, color: "#4caf50" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: "#4caf50" }}
                              >
                                Phone
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ffffff" }}
                              >
                                {profileData.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}

                      {profileData.website && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "rgba(255, 152, 0, 0.1)",
                              border: "1px solid rgba(255, 152, 0, 0.3)",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Language sx={{ mr: 2, color: "#ff9800" }} />
                              <Typography
                                variant="caption"
                                sx={{ color: "#ff9800" }}
                              >
                                Website
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              component="a"
                              href={
                                profileData.website.startsWith("http")
                                  ? profileData.website
                                  : `https://${profileData.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#ffffff",
                                textDecoration: "none",
                                "&:hover": { color: "#ff9800" },
                                display: "block",
                              }}
                            >
                              {profileData.website}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {profileData.location && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "rgba(233, 30, 99, 0.1)",
                              border: "1px solid rgba(233, 30, 99, 0.3)",
                            }}
                          >
                            <LocationOn sx={{ mr: 2, color: "#e91e63" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: "#e91e63" }}
                              >
                                Location
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ffffff" }}
                              >
                                {profileData.location}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </InfoCard>
              </Grid>

              {/* Blockchain Information */}
              {profileData.wallet_address && (
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#a9a9a9", fontWeight: "bold" }}
                      >
                        Blockchain Information
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(156, 39, 176, 0.1)",
                          border: "1px solid rgba(156, 39, 176, 0.3)",
                        }}
                      >
                        <AccountBalanceWallet
                          sx={{ mr: 2, color: "#9c27b0" }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#9c27b0" }}
                          >
                            Wallet Address
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              color: "#ffffff",
                              wordBreak: "break-all",
                              backgroundColor: "rgba(0, 0, 0, 0.3)",
                              p: 1,
                              borderRadius: 1,
                              mt: 1,
                            }}
                          >
                            {profileData.wallet_address}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </InfoCard>
                </Grid>
              )}

              {/* Account Information */}
              <Grid item xs={12}>
                <InfoCard>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#a9a9a9", fontWeight: "bold" }}
                    >
                      Account Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "rgba(121, 85, 72, 0.1)",
                            border: "1px solid rgba(121, 85, 72, 0.3)",
                          }}
                        >
                          <CalendarToday sx={{ mr: 2, color: "#795548" }} />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#795548" }}
                            >
                              Member Since
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#ffffff" }}
                            >
                              {formatDate(profileData.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {profileData.updated_at && (
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "rgba(96, 125, 139, 0.1)",
                              border: "1px solid rgba(96, 125, 139, 0.3)",
                            }}
                          >
                            <Person sx={{ mr: 2, color: "#607d8b" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{ color: "#607d8b" }}
                              >
                                Last Updated
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ffffff" }}
                              >
                                {formatDate(profileData.updated_at)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "rgba(169, 169, 169, 0.3)" }} />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <SecondaryButton
            startIcon={<Refresh />}
            onClick={() => handleData()}
            disabled={loading}
          >
            Refresh Profile
          </SecondaryButton>

          <PrimaryButton onClick={handleBack}>Back to Dashboard</PrimaryButton>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Profile;
