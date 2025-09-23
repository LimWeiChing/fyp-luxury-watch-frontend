import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Box,
  Paper,
  Typography,
  Autocomplete,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Email,
  Phone,
  Web,
  LocationOn,
  Description,
  Business,
  CloudUpload,
  Check,
  Error,
  AccountCircle,
  Security,
  ContactPage,
} from "@mui/icons-material";
import api from "../../api/axios";
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(169, 169, 169, 0.1)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(169, 169, 169, 0.15)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(169, 169, 169, 0.4)",
      },
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(169, 169, 169, 0.2)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#a9a9a9",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(169, 169, 169, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#a9a9a9",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1.5, 4),
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
  "&:disabled": {
    background: "rgba(169, 169, 169, 0.3)",
    color: "rgba(255, 255, 255, 0.5)",
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

const ImagePreviewCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  background: "rgba(169, 169, 169, 0.1)",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  borderRadius: "12px",
  overflow: "hidden",
  animation: `${fadeInUp} 0.4s ease-out`,
}));

const options = [
  {
    value: "supplier",
    label: "Supplier",
    icon: "🏭",
    description: "Raw material provider",
  },
  {
    value: "manufacturer",
    label: "Manufacturer",
    icon: "⚙️",
    description: "Component creator",
  },
  {
    value: "certifier",
    label: "Certifier",
    icon: "✅",
    description: "Quality assurance",
  },
  {
    value: "assembler",
    label: "Assembler",
    icon: "🔧",
    description: "Watch assembly",
  },
  {
    value: "distributor",
    label: "Distributor",
    icon: "🚚",
    description: "Logistics handler",
  },
  {
    value: "retailer",
    label: "Retailer",
    icon: "🏪",
    description: "Sales provider",
  },
  { value: "consumer", label: "Consumer", icon: "👤", description: "End user" },
];

const AddAccount = () => {
  // Form state
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(options[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({
    file: null,
    filepreview: null,
  });

  const errRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setErrMsg("");
    setSuccessMsg("");
  }, [
    user,
    pwd,
    pwd2,
    role,
    name,
    description,
    website,
    location,
    email,
    phone,
  ]);

  const handleImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrMsg("Image file size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrMsg("Please select a valid image file");
        return;
      }

      setImage({
        file: file,
        filepreview: URL.createObjectURL(file),
      });
    }
  };

  // Enhanced image upload with progress
  const uploadImage = async (imageFile) => {
    if (!imageFile) {
      console.log("No image file to upload");
      return null;
    }

    try {
      const data = new FormData();
      data.append("image", imageFile);

      const response = await api.post("/upload/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      if (response.data.success === 1) {
        console.log("✅ Image uploaded successfully:", response.data.filename);
        return response.data.filename;
      } else {
        console.log("❌ Image upload failed");
        return null;
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const validateForm = () => {
    if (!user.trim()) {
      setErrMsg("Username is required");
      return false;
    }

    if (!pwd.trim()) {
      setErrMsg("Password is required");
      return false;
    }

    if (pwd.length < 6) {
      setErrMsg("Password must be at least 6 characters long");
      return false;
    }

    if (!pwd2.trim()) {
      setErrMsg("Please confirm your password");
      return false;
    }

    if (pwd !== pwd2) {
      setErrMsg("Passwords do not match");
      return false;
    }

    if (!role) {
      setErrMsg("Please select a role");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== ADD ACCOUNT FORM SUBMISSION ===");
    console.log("Username:", user);
    console.log("Role:", role.value);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Description:", description);
    console.log("Website:", website);
    console.log("Location:", location);
    console.log("Has Image:", !!image.file);

    if (!validateForm()) {
      errRef.current?.focus();
      return;
    }

    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    try {
      // Step 1: Upload image if provided
      let uploadedImageName = null;
      if (image.file) {
        console.log("📤 Uploading image...");
        uploadedImageName = await uploadImage(image.file);
      }

      // Step 2: Create account with all data in one request
      console.log("📝 Creating account with all information...");
      const accountData = {
        username: user.trim(),
        password: pwd,
        role: role.value,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        description: description.trim(),
        website: website.trim(),
        location: location.trim(),
        image: uploadedImageName || "",
      };

      const accountResponse = await api.post("/addaccount", accountData, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      console.log("✅ Account creation response:", accountResponse.data);

      if (!accountResponse.data.success) {
        throw new Error(
          accountResponse.data.message || "Failed to create account"
        );
      }

      // Success - show success message
      setSuccessMsg(
        `Account '${user}' created successfully as '${role.label}'! 🎉`
      );

      // Reset form after success
      setTimeout(() => {
        setUser("");
        setPwd("");
        setPwd2("");
        setEmail("");
        setPhone("");
        setRole(options[0]);
        setName("");
        setDescription("");
        setWebsite("");
        setLocation("");
        setImage({
          file: null,
          filepreview: null,
        });
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error("❌ Error creating account:", err);

      if (!err?.response) {
        setErrMsg("Server is down. Please try again later.");
      } else if (err.response?.status === 400) {
        setErrMsg(
          err.response.data.message || "Invalid input. Please check your data."
        );
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized access.");
      } else if (err.response?.status === 500) {
        setErrMsg("Server error. Please try again later.");
      } else {
        setErrMsg(err.message || "Account creation failed. Please try again.");
      }
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={24}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <PersonAdd sx={{ fontSize: 48, color: "#a9a9a9", mb: 2 }} />
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
            Create Account
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Complete account setup for luxury watch supply chain network
          </Typography>
        </Box>

        {/* Error and Success Messages */}
        {errMsg && (
          <Alert
            severity="error"
            ref={errRef}
            sx={{
              mb: 3,
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderLeft: "4px solid #f44336",
              color: "#ffffff",
            }}
            onClose={() => setErrMsg("")}
            icon={<Error sx={{ color: "#f44336" }} />}
          >
            {errMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderLeft: "4px solid #4caf50",
              color: "#ffffff",
            }}
            onClose={() => setSuccessMsg("")}
            icon={<Check sx={{ color: "#4caf50" }} />}
          >
            {successMsg}
          </Alert>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column - Account Credentials */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "#a9a9a9", textAlign: "center" }}
              >
                Account Credentials
              </Typography>

              <StyledTextField
                fullWidth
                id="username-field"
                margin="normal"
                label="Username *"
                variant="outlined"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                id="password-field"
                margin="normal"
                label="Password *"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                id="confirm-password-field"
                margin="normal"
                label="Confirm Password *"
                type={showPassword2 ? "text" : "password"}
                variant="outlined"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword2(!showPassword2)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Autocomplete
                disablePortal
                id="role-selector"
                options={options}
                getOptionLabel={(option) => option.label}
                value={role}
                onChange={(event, newRole) => {
                  setRole(newRole || options[0]);
                }}
                disabled={loading}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Typography sx={{ fontSize: "1.2rem" }}>
                      {option.icon}
                    </Typography>
                    <Box>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    fullWidth
                    margin="normal"
                    label="Role *"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Right Column - Profile Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "#a9a9a9", textAlign: "center" }}
              >
                Profile Information
              </Typography>

              <StyledTextField
                fullWidth
                id="name-field"
                margin="normal"
                label="Company Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactPage sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                id="email-field"
                margin="normal"
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                id="phone-field"
                margin="normal"
                label="Phone Number"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                id="website-field"
                margin="normal"
                label="Website"
                variant="outlined"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Web sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                id="location-field"
                margin="normal"
                label="Location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Full Width - Description and Image */}
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                id="description-field"
                margin="normal"
                label="Description"
                variant="outlined"
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
                      <Description sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={loading}
                  startIcon={<CloudUpload />}
                  sx={{
                    borderColor: "rgba(169, 169, 169, 0.5)",
                    color: "#a9a9a9",
                    "&:hover": {
                      backgroundColor: "rgba(169, 169, 169, 0.1)",
                      borderColor: "#a9a9a9",
                    },
                  }}
                >
                  Upload Profile Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                  />
                </Button>
              </Box>

              {image.filepreview && (
                <Fade in={!!image.filepreview}>
                  <ImagePreviewCard>
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Avatar
                        src={image.filepreview}
                        alt="Profile Preview"
                        sx={{
                          width: 120,
                          height: 120,
                          margin: "auto",
                          border: "2px solid rgba(169, 169, 169, 0.3)",
                          animation: `${pulseGlow} 2s infinite`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        Profile Image Preview
                      </Typography>
                    </CardContent>
                  </ImagePreviewCard>
                </Fade>
              )}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              pt: 2,
              borderTop: "1px solid rgba(169, 169, 169, 0.2)",
            }}
          >
            <SecondaryButton onClick={handleBack} disabled={loading}>
              Cancel
            </SecondaryButton>

            <PrimaryButton
              type="submit"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                ) : (
                  <PersonAdd />
                )
              }
            >
              {loading ? "Creating Account..." : "Create Account"}
            </PrimaryButton>
          </Box>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default AddAccount;
