import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled, keyframes } from "@mui/material/styles";
import { InputAdornment, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WatchIcon from "@mui/icons-material/Watch";
import bgImg from "../../img/bg.png";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";

// Animations
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

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "2rem 1rem",
}));

const LoginCard = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  borderRadius: "20px",
  padding: "4rem 3.5rem",
  marginTop: "2rem",
  marginBottom: "2rem",
  minHeight: "600px",
  maxWidth: "500px",
  width: "100%",
  boxShadow:
    "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(169, 169, 169, 0.1)",
  position: "relative",
  overflow: "hidden",
  animation: `${fadeInUp} 0.8s ease-out`,

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, #a9a9a9, transparent)",
    animation: `${slideIn} 1.5s ease-out`,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "20px",
    height: "20px",
    border: "2px solid rgba(169, 169, 169, 0.3)",
    borderRadius: "50%",
    borderTop: "2px solid #a9a9a9",
    animation: `${rotate} 3s linear infinite`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(60, 60, 60, 0.8)",
    borderRadius: "12px",
    transition: "all 0.3s ease",

    "& fieldset": {
      borderColor: "rgba(169, 169, 169, 0.3)",
      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: "rgba(169, 169, 169, 0.6)",
      boxShadow: "0 0 10px rgba(169, 169, 169, 0.2)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#a9a9a9",
      borderWidth: "2px",
      boxShadow: "0 0 20px rgba(169, 169, 169, 0.4)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "rgba(169, 169, 169, 0.8)",
    "&.Mui-focused": {
      color: "#a9a9a9",
    },
  },

  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
    padding: "16px 14px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #2f2f2f 30%, #4a4a4a 90%)",
  borderRadius: "12px",
  border: "1px solid rgba(169, 169, 169, 0.3)",
  color: "#ffffff",
  height: "50px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(169, 169, 169, 0.2), transparent)",
    transition: "left 0.5s ease",
  },

  "&:hover": {
    background: "linear-gradient(45deg, #4a4a4a 30%, #5a5a5a 90%)",
    boxShadow: "0 10px 25px rgba(169, 169, 169, 0.3)",
    transform: "translateY(-2px)",

    "&::before": {
      left: "100%",
    },
  },

  "&:active": {
    transform: "translateY(0)",
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: "rgba(169, 169, 169, 0.8)",
  border: "1px solid rgba(169, 169, 169, 0.3)",
  borderRadius: "8px",
  padding: "8px 24px",
  transition: "all 0.3s ease",

  "&:hover": {
    color: "#ffffff",
    borderColor: "#a9a9a9",
    backgroundColor: "rgba(169, 169, 169, 0.1)",
  },
}));

const TitleContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: "3rem",
  position: "relative",
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", "Gambetta", serif',
  fontWeight: "700",
  fontSize: "2.2rem",
  background: "linear-gradient(45deg, #ffffff 30%, #a9a9a9 70%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  marginBottom: "0.5rem",
  animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
  whiteSpace: "nowrap",
  letterSpacing: "2px",

  "@media (max-width: 600px)": {
    fontSize: "1.8rem",
    letterSpacing: "1px",
  },

  "@media (max-width: 480px)": {
    fontSize: "1.5rem",
    letterSpacing: "0.5px",
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  color: "rgba(169, 169, 169, 0.9)",
  fontSize: "1.2rem",
  fontWeight: "300",
  letterSpacing: "2px",
  animation: `${fadeInUp} 0.6s ease-out 0.4s both`,
}));

const LoginTitle = styled(Typography)(({ theme }) => ({
  color: "#ffffff",
  fontSize: "1.8rem",
  fontWeight: "500",
  marginBottom: "2rem",
  textAlign: "center",
  animation: `${fadeInUp} 0.6s ease-out 0.6s both`,
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: "#ff6b6b",
  backgroundColor: "rgba(255, 107, 107, 0.1)",
  border: "1px solid rgba(255, 107, 107, 0.3)",
  borderRadius: "8px",
  padding: "12px 16px",
  marginTop: "1rem",
  textAlign: "center",
  animation: `${pulseGlow} 2s infinite`,
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    color: "rgba(169, 169, 169, 0.9)",
  },
  "& .MuiCheckbox-root": {
    color: "rgba(169, 169, 169, 0.6)",
    "&.Mui-checked": {
      color: "#a9a9a9",
    },
  },
}));

const WatchIconStyled = styled(WatchIcon)(({ theme }) => ({
  fontSize: "3rem",
  color: "#a9a9a9",
  marginBottom: "1rem",
  animation: `${rotate} 8s linear infinite`,
}));

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/login",
        {
          username: user,
          password: pwd,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Login successful:", res.data);

      if (!res.data || Object.keys(res.data).length === 0) {
        setErrMsg("Login failed. Invalid credentials.");
      } else {
        const { role } = res.data;
        setAuth({ user, pwd, role });
        setUser("");
        setPwd("");
        navigate(`/${role}`, { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server is down. Please try again later.");
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        setErrMsg("Invalid username or password.");
      } else {
        setErrMsg("Login failed. Please try again.");
      }
      errRef.current?.focus();
    }
  };

  return (
    <Box
      sx={{
        background: `
          linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(40, 40, 40, 0.8) 100%),
          url(${bgImg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(169, 169, 169, 0.1) 0%, transparent 70%)",
          zIndex: 0,
        },
      }}
    >
      <StyledContainer component="main" maxWidth="md">
        <LoginCard>
          <TitleContainer>
            <WatchIconStyled />
            <MainTitle>LUXURY WATCH SYSTEM</MainTitle>
          </TitleContainer>

          <LoginTitle>Access Your Account</LoginTitle>

          {errMsg && (
            <ErrorMessage component="p" variant="body2" ref={errRef}>
              {errMsg}
            </ErrorMessage>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={user}
              onChange={(e) => setUser(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "rgba(169, 169, 169, 0.6)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "rgba(169, 169, 169, 0.6)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "rgba(169, 169, 169, 0.6)" }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <StyledFormControlLabel
                control={<Checkbox value="remember" />}
                label="Remember me"
              />
            </Box>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 3 }}
            >
              Sign In
            </StyledButton>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <BackButton onClick={handleBack}>Back to Home</BackButton>
            </Box>
          </Box>
        </LoginCard>
      </StyledContainer>
    </Box>
  );
}
