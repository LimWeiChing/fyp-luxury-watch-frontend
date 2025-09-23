import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Chip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Dashboard,
  AccountCircle,
  Settings,
  Logout,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings,
  Inventory,
  PrecisionManufacturing,
  Verified,
  BuildCircle,
  LocalShipping,
  Storefront,
  Person,
  Collections,
  Favorite,
  Notifications,
  Security,
} from "@mui/icons-material";
import WatchIcon from "@mui/icons-material/Watch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import bgImg from "../../img/bg.png";
import logo from "../../img/logo.png";
import logoname from "../../img/logoname.png";

// Drawer width
const drawerWidth = 320;

// MAIN COMPONENT - KEEPING BEAUTIFUL BACKGROUND ONLY
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    // BEAUTIFUL BACKGROUND PRESERVED
    background: `
      radial-gradient(circle at 20% 80%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 64, 129, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0f0f0f 75%, #000000 100%),
      url(${bgImg})
    `,
    backgroundSize: "cover, cover, cover, cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    position: "relative",
    // STATIC TECH GRID PATTERN (NO ANIMATION)
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 245, 255, 0.03) 2px,
          rgba(0, 245, 255, 0.03) 4px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(255, 64, 129, 0.03) 2px,
          rgba(255, 64, 129, 0.03) 4px
        )
      `,
      zIndex: 0,
    },
    // STATIC OVERLAY (NO ANIMATION)
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 30% 40%, rgba(0, 245, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 70% 60%, rgba(255, 64, 129, 0.05) 0%, transparent 50%)
      `,
      zIndex: 1,
    },
  })
);

// SIMPLIFIED COMPONENTS - NO HEAVY EFFECTS
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  background: "rgba(0, 0, 0, 0.9)",
  borderBottom: "1px solid rgba(0, 245, 255, 0.2)",
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: "rgba(0, 0, 0, 0.95)",
  borderBottom: "1px solid rgba(0, 245, 255, 0.3)",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background: "rgba(0, 0, 0, 0.95)",
    borderRight: "1px solid rgba(0, 245, 255, 0.3)",
    color: "#ffffff",
    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)",
  },
}));

const CompanyHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  borderBottom: "1px solid rgba(0, 245, 255, 0.2)",
  background: "rgba(0, 245, 255, 0.05)",
}));

const UserProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: "1px solid rgba(0, 245, 255, 0.2)",
  background: "rgba(10, 10, 10, 0.8)",
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  cursor: "pointer",
}));

const LogoBox = styled(Box)(({ theme }) => ({
  width: 90,
  height: 70,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(2),
  borderRadius: "50%",
  background: "rgba(0, 245, 255, 0.1)",
  border: "2px solid rgba(0, 245, 255, 0.3)",
}));

const LogoNameBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "70px",
  borderRadius: theme.spacing(1),
  background: "rgba(0, 245, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}));

// SIMPLIFIED CLOCK COMPONENT
const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginLeft: 4,
        padding: "8px 16px",
        background: "rgba(0, 0, 0, 0.7)",
        borderRadius: 2,
        border: "1px solid rgba(0, 245, 255, 0.2)",
      }}
    >
      <AccessTimeIcon
        sx={{
          mr: 1.5,
          color: "#00f5ff",
          fontSize: 24,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: "#ffffff",
          fontFamily: '"Orbitron", "JetBrains Mono", monospace',
          fontSize: "0.95rem",
          fontWeight: 600,
          letterSpacing: 1.2,
        }}
      >
        {formatTime(currentTime)}
      </Typography>
    </Box>
  );
};

const roleIcons = {
  admin: AdminPanelSettings,
  supplier: Inventory,
  manufacturer: PrecisionManufacturing,
  certifier: Verified,
  assembler: BuildCircle,
  distributor: LocalShipping,
  retailer: Storefront,
  consumer: Person,
};

const roleColors = {
  admin: "#00f5ff",
  supplier: "#4caf50",
  manufacturer: "#ff9800",
  certifier: "#2196f3",
  assembler: "#673ab7",
  distributor: "#00bcd4",
  retailer: "#e91e63",
  consumer: "#ff6f00",
};

const roleRoutes = {
  admin: [
    { text: "Dashboard", path: "/admin", icon: Dashboard },
    { text: "Add Account", path: "/add-account", icon: AdminPanelSettings },
    { text: "Manage Account", path: "/manage-account", icon: Settings },
  ],
  supplier: [
    { text: "Dashboard", path: "/supplier", icon: Dashboard },
    {
      text: "Register Raw Material",
      path: "/register-raw-material",
      icon: Inventory,
    },
    { text: "Materials Inventory", path: "/ListRaw", icon: Collections },
    { text: "Scan QR Code", path: "/scanner", icon: Security },
  ],
  manufacturer: [
    { text: "Dashboard", path: "/manufacturer", icon: Dashboard },
    {
      text: "Create Component",
      path: "/create-component",
      icon: PrecisionManufacturing,
    },
    { text: "Materials Inventory", path: "/list-components", icon: Inventory },
    { text: "Scan Raw Material", path: "/scanner", icon: Security },
  ],
  certifier: [
    { text: "Dashboard", path: "/certifier", icon: Dashboard },
    {
      text: "Certify Component",
      path: "/certify-component",
      icon: Verified,
    },
    {
      text: "Component Reviews",
      path: "/components-review",
      icon: Collections,
    },
    { text: "Scan Component", path: "/scanner", icon: Security },
  ],
  assembler: [
    { text: "Dashboard", path: "/assembler", icon: Dashboard },
    { text: "Assemble Watch", path: "/assemble-watch", icon: BuildCircle },
    { text: "Watches Inventory", path: "/list-watches", icon: Collections },
    { text: "Component Scanner", path: "/scanner", icon: Security },
  ],
  distributor: [
    { text: "Dashboard", path: "/distributor", icon: Dashboard },
    { text: "Update Shipping", path: "/update-shipping", icon: LocalShipping },
    {
      text: "Watches Tracking",
      path: "/watches-shipping",
      icon: LocalShipping,
    },
    { text: "Tracking Scanner", path: "/scanner", icon: Security },
  ],
  retailer: [
    { text: "Dashboard", path: "/retailer", icon: Dashboard },
    { text: "Mark Available", path: "/mark-available", icon: Storefront },
    { text: "Watches Catalog", path: "/watches-catalog", icon: Collections },
    { text: "Scan Watch QR Code", path: "/scanner", icon: Security },
  ],
  consumer: [
    { text: "Dashboard", path: "/consumer", icon: Dashboard },
    { text: "Purchase Watch", path: "/purchase-watch", icon: Person },
    { text: "My Collection", path: "/watch-collection", icon: Favorite },
    { text: "Verify Scanner", path: "/scanner", icon: Security },
  ],
};

// SIMPLIFIED LIST ITEM BUTTON
const StyledListItemButton = styled(ListItemButton)(({ theme, userRole }) => ({
  color: "#ffffff",
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: `${roleColors[userRole]}20`,
    "& .MuiListItemIcon-root": {
      color: roleColors[userRole],
    },
  },
  "& .MuiListItemIcon-root": {
    color: `${roleColors[userRole]}cc`,
  },
  "& .MuiListItemText-primary": {
    fontFamily: '"Exo 2", "Roboto", sans-serif',
    fontWeight: 500,
    fontSize: "0.95rem",
    letterSpacing: 0.5,
  },
}));

// SIMPLIFIED NOTIFICATION BADGE
const NotificationBadge = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  background: "#ff4081",
  color: "#ffffff",
  fontFamily: '"Orbitron", monospace',
  fontSize: "0.75rem",
  fontWeight: 700,
  height: 24,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [open, setOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Profile image states - following Profile.jsx pattern
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    image: "",
  });
  const [imageError, setImageError] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Image handling functions - following Profile.jsx pattern
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
    if (auth?.user) {
      return auth.user.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Fetch profile data - following Profile.jsx pattern
  const fetchProfileData = async () => {
    if (!auth.user) {
      console.log("No auth user available");
      return;
    }

    try {
      console.log("=== FETCHING PROFILE DATA FOR DASHBOARD ===");
      console.log("Auth user:", auth.user);

      const response = await api.get(`/profile/${auth.user}`, {
        timeout: 10000,
      });

      console.log("✅ Profile API response:", response.data);

      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        setProfileData({
          name: userData.name || "",
          username: userData.username || auth.user || "",
          image: userData.image || "",
        });
        console.log("✅ Profile data loaded for dashboard:", userData);
      } else {
        // Fallback to auth data
        setProfileData({
          name: auth.name || "",
          username: auth.user || "",
          image: "",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching profile for dashboard:", error);
      // Fallback to auth data
      setProfileData({
        name: auth.name || "",
        username: auth.user || "",
        image: "",
      });
    }
  };

  // Load profile data on component mount and when auth changes
  useEffect(() => {
    fetchProfileData();
  }, [auth.user]);

  const userRole = auth?.role || "consumer";
  const userName = profileData.name || auth?.user || "Elite User";
  const RoleIcon = roleIcons[userRole] || Person;
  const menuItems = roleRoutes[userRole] || roleRoutes.consumer;

  return (
    <Box sx={{ display: "flex" }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: "none" }),
              color: "#00f5ff",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <WatchIcon
              sx={{
                mr: 2,
                color: "#00f5ff",
                fontSize: 32,
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontFamily: '"Orbitron", "Exo 2", sans-serif',
                fontWeight: 800,
                background:
                  "linear-gradient(45deg, #ffffff 30%, #00f5ff 70%, #ff4081 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 2,
              }}
            >
              LUXURY WATCH SYSTEM
            </Typography>
            <RealTimeClock />
          </Box>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer variant="persistent" anchor="left" open={open}>
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: "#00f5ff",
            }}
          >
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>

        <CompanyHeader>
          <LogoContainer>
            <LogoBox>
              <img
                src={logo}
                alt="Quantum Logo"
                style={{
                  width: "80%",
                  height: "80%",
                  objectFit: "contain",
                }}
              />
            </LogoBox>
            <LogoNameBox>
              <img
                src={logoname}
                alt="Quantum Chronos"
                style={{
                  maxWidth: "180px",
                  height: "auto",
                  maxHeight: "50px",
                  objectFit: "contain",
                }}
              />
            </LogoNameBox>
          </LogoContainer>
        </CompanyHeader>

        <UserProfileSection>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Enhanced Avatar with Profile Image - following Profile.jsx pattern */}
            <Avatar
              src={getProfileImage()}
              onError={handleImageError}
              sx={{
                bgcolor: roleColors[userRole],
                mr: 2,
                width: 56,
                height: 56,
                border: `2px solid ${roleColors[userRole]}40`,
                fontSize: "1.2rem",
                fontWeight: "bold",
                // Fallback to role icon if no initials
                "& .MuiAvatar-fallback": {
                  fontSize: "1.5rem",
                },
              }}
            >
              {/* Show initials if no image, otherwise fall back to role icon */}
              {!getProfileImage() && (profileData.name || profileData.username)
                ? getInitials()
                : !getProfileImage() && <RoleIcon sx={{ fontSize: 28 }} />}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontFamily: '"Exo 2", sans-serif',
                }}
              >
                {userName}
              </Typography>
              <Chip
                label={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                size="small"
                sx={{
                  background: `${roleColors[userRole]}30`,
                  color: "#ffffff",
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  border: `1px solid ${roleColors[userRole]}60`,
                }}
              />
            </Box>
          </Box>
        </UserProfileSection>

        <Divider sx={{ borderColor: "rgba(0, 245, 255, 0.2)" }} />

        <List>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <ListItem key={item.text} disablePadding>
                <StyledListItemButton
                  onClick={() => handleNavigation(item.path)}
                  userRole={userRole}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </StyledListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider
          sx={{
            borderColor: "rgba(0, 245, 255, 0.2)",
            margin: (theme) => theme.spacing(2, 0),
          }}
        />

        <List>
          <ListItem disablePadding>
            <StyledListItemButton
              onClick={() => setSettingsOpen(!settingsOpen)}
              userRole={userRole}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="System Settings" />
              {settingsOpen ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
          </ListItem>
          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledListItemButton
                sx={{ pl: 4 }}
                onClick={() => handleNavigation("/profile")}
                userRole={userRole}
              >
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="User Profile" />
              </StyledListItemButton>
              <StyledListItemButton
                sx={{ pl: 4 }}
                onClick={handleLogout}
                userRole={userRole}
              >
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Secure Logout" />
              </StyledListItemButton>
            </List>
          </Collapse>
        </List>
      </StyledDrawer>

      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
      </Main>
    </Box>
  );
};

export default DashboardLayout;
