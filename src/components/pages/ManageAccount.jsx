import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fade,
  Slide,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ManageAccounts as ManageAccountsIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  ContactPage as ContactPageIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
  margin: "auto",
  marginTop: theme.spacing(2),
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
  padding: theme.spacing(1, 2),
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

const DangerButton = styled(StyledButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  color: "#ffffff",
  "&:hover": {
    background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
    transform: "translateY(-2px)",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: "rgba(169, 169, 169, 0.05)",
  borderRadius: "12px",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  "& .MuiTableHead-root": {
    "& .MuiTableCell-root": {
      backgroundColor: "rgba(169, 169, 169, 0.1)",
      color: "#a9a9a9",
      fontWeight: 600,
      borderBottom: "1px solid rgba(169, 169, 169, 0.2)",
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(169, 169, 169, 0.1)",
        cursor: "pointer",
      },
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid rgba(169, 169, 169, 0.1)",
      color: "#ffffff",
    },
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(169, 169, 169, 0.1) 0%, rgba(169, 169, 169, 0.05) 100%)",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(169, 169, 169, 0.2)",
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

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userImageError, setUserImageError] = useState({});

  // Stats state
  const [stats, setStats] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const fetchUsers = async () => {
    console.log("=== FETCHING ALL PROFILES ===");
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/profileAll", {
        timeout: 15000,
      });

      console.log("✅ Profiles fetched successfully");
      console.log("Data received:", response.data);
      console.log("Number of profiles:", response.data.length);

      setUsers(response.data);
      setSuccess(`Successfully loaded ${response.data.length} user profiles`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error fetching profiles:", err);

      let errorMessage = "Failed to fetch user profiles";

      if (!err?.response) {
        errorMessage =
          "Server is not responding. Please check if the server is running.";
      } else if (err.response?.status === 404) {
        errorMessage =
          "Profiles endpoint not found. Please check server configuration.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error occurred while fetching profiles.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filtering
  };

  const calculateStats = () => {
    const roleStats = {};
    let totalWithEmail = 0;
    let totalWithPhone = 0;
    let recentlyCreated = 0;

    const oneWeekAgo = dayjs().subtract(7, "day");

    users.forEach((user) => {
      // Role statistics
      if (user.role) {
        roleStats[user.role] = (roleStats[user.role] || 0) + 1;
      }

      // Contact info statistics
      if (user.email) totalWithEmail++;
      if (user.phone) totalWithPhone++;

      // Recently created accounts
      if (dayjs(user.created_at).isAfter(oneWeekAgo)) {
        recentlyCreated++;
      }
    });

    setStats({
      total: users.length,
      roles: roleStats,
      withEmail: totalWithEmail,
      withPhone: totalWithPhone,
      recentlyCreated,
    });
  };

  const handleViewUser = async (user) => {
    console.log("=== VIEW USER DETAILS ===");
    console.log("User:", user);

    try {
      // Fetch detailed user information using the corrected endpoint
      const response = await api.get(`/profile/${user.id}`, {
        timeout: 10000,
      });
      console.log("✅ Detailed user data response:", response.data);

      if (response.data.success && response.data.data) {
        setSelectedUser(response.data.data);
      } else {
        // Fallback to basic user data if detailed fetch fails
        setSelectedUser(user);
      }

      setViewDialogOpen(true);
    } catch (err) {
      console.error("❌ Error fetching user details:", err);
      // Fallback to basic user data
      setSelectedUser(user);
      setViewDialogOpen(true);
    }
  };

  const handleDeleteUser = (user) => {
    console.log("=== DELETE USER REQUEST ===");
    console.log("User:", user);
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    console.log("=== CONFIRMING DELETE USER ===");
    console.log("User ID:", selectedUser.id);

    try {
      setLoading(true);
      const response = await api.delete(`/user/${selectedUser.id}`, {
        timeout: 10000,
      });

      console.log("✅ User deleted successfully:", response.data);

      setSuccess(`User '${selectedUser.username}' deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);

      // Refresh user list
      await fetchUsers();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting user:", err);

      let errorMessage = "Failed to delete user";

      if (err.response?.status === 404) {
        errorMessage = "User not found";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response.data.message ||
          "Cannot delete user - user has related data";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).fromNow();
  };

  const getRoleChip = (role) => {
    const config = roleConfig[role] || roleConfig.consumer;
    return (
      <Chip
        icon={<span style={{ fontSize: "16px" }}>{config.icon}</span>}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: `${config.color}20`,
          color: config.color,
          border: `1px solid ${config.color}40`,
          fontWeight: 600,
        }}
      />
    );
  };

  const getUserAvatar = (user) => {
    const config = roleConfig[user.role] || roleConfig.consumer;
    const imageUrl = user.image
      ? `${api.defaults.baseURL}/file/profile/${user.image}`
      : null;
    const handleImageError = () => {
      setUserImageError((prev) => ({ ...prev, [user.id]: true }));
    };

    return (
      <Avatar
        src={!userImageError[user.id] ? imageUrl : null}
        onError={handleImageError}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: config.color,
          border: `2px solid ${config.color}40`,
        }}
      >
        {(!imageUrl || userImageError[user.id]) &&
          (user.name
            ? user.name.charAt(0).toUpperCase()
            : user.username.charAt(0).toUpperCase())}
      </Avatar>
    );
  };

  const getProfileImageUrl = (imageName) => {
    if (!imageName) return null;
    return `${api.defaults.baseURL}/file/profile/${imageName}`;
  };
  // Calculate displayed rows
  const displayedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <StyledContainer>
      {/* Header */}
      <StyledPaper elevation={24} sx={{ maxWidth: "100%", mb: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <ManageAccountsIcon sx={{ fontSize: 48, color: "#a9a9a9", mb: 2 }} />
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
            Account Management
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Monitor and control user permissions across the network
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: "center" }}>
                <PeopleIcon sx={{ fontSize: 40, color: "#4caf50", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ color: "#4caf50", fontWeight: 700 }}
                >
                  {stats.total || 0}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Total Users
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: "center" }}>
                <EmailIcon sx={{ fontSize: 40, color: "#2196f3", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ color: "#2196f3", fontWeight: 700 }}
                >
                  {stats.withEmail || 0}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  With Email
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: "center" }}>
                <PhoneIcon sx={{ fontSize: 40, color: "#ff9800", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ color: "#ff9800", fontWeight: 700 }}
                >
                  {stats.withPhone || 0}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  With Phone
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: "center" }}>
                <PersonAddIcon sx={{ fontSize: 40, color: "#e91e63", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ color: "#e91e63", fontWeight: 700 }}
                >
                  {stats.recentlyCreated || 0}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  This Week
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Role Distribution */}
        {stats.roles && Object.keys(stats.roles).length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#a9a9a9" }}>
              Role Distribution
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.entries(stats.roles).map(([role, count]) => {
                const config = roleConfig[role] || roleConfig.consumer;
                return (
                  <Chip
                    key={role}
                    icon={
                      <span style={{ fontSize: "16px" }}>{config.icon}</span>
                    }
                    label={`${config.label}: ${count}`}
                    sx={{
                      backgroundColor: `${config.color}20`,
                      color: config.color,
                      border: `1px solid ${config.color}40`,
                      fontWeight: 600,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </StyledPaper>

      {/* Main Content */}
      <StyledPaper elevation={24} sx={{ maxWidth: "100%" }}>
        {/* Error and Success Messages */}
        {error && (
          <Slide direction="down" in={!!error}>
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
          </Slide>
        )}

        {success && (
          <Slide direction="down" in={!!success}>
            <Alert
              severity="success"
              sx={{
                mb: 3,
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                borderLeft: "4px solid #4caf50",
                color: "#ffffff",
              }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          </Slide>
        )}

        {/* Controls */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <StyledTextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Filter by Role
            </InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{
                color: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(169, 169, 169, 0.3)",
                },
                "& .MuiSvgIcon-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            >
              <MenuItem value="">All Roles</MenuItem>
              {Object.entries(roleConfig).map(([role, config]) => (
                <MenuItem key={role} value={role}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{config.icon}</span>
                    {config.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Refresh data">
            <IconButton
              onClick={fetchUsers}
              disabled={loading}
              sx={{
                color: "#a9a9a9",
                "&:hover": { backgroundColor: "rgba(169, 169, 169, 0.1)" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <PrimaryButton
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/add-account")}
          >
            Add Account
          </PrimaryButton>
        </Box>

        {/* Results Info */}
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "rgba(255, 255, 255, 0.7)" }}
        >
          Showing {displayedUsers.length} of {filteredUsers.length} users
          {searchTerm && ` (filtered from ${users.length} total)`}
        </Typography>

        {/* User Table */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <CircularProgress sx={{ color: "#a9a9a9" }} />
            <Typography sx={{ ml: 2, color: "rgba(255, 255, 255, 0.7)" }}>
              Loading user profiles...
            </Typography>
          </Box>
        ) : (
          <>
            <StyledTableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      onClick={() => handleViewUser(user)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          {getUserAvatar(user)}
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {user.name || user.username}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{getRoleChip(user.role)}</TableCell>
                      <TableCell>
                        <Box>
                          {user.email && (
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mb: 0.5,
                              }}
                            >
                              <EmailIcon sx={{ fontSize: 16 }} />
                              {user.email}
                            </Typography>
                          )}
                          {user.phone && (
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <PhoneIcon sx={{ fontSize: 16 }} />
                              {user.phone}
                            </Typography>
                          )}
                          {!user.email && !user.phone && (
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                            >
                              No contact info
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(user.created_at)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {getRelativeTime(user.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUser(user);
                              }}
                              sx={{ color: "#4caf50" }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user);
                              }}
                              sx={{ color: "#f44336" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: "#ffffff",
                "& .MuiTablePagination-selectIcon": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </>
        )}

        {/* Back Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <SecondaryButton onClick={() => navigate(-1)}>
            Back to Dashboard
          </SecondaryButton>
        </Box>
      </StyledPaper>

      {/* Enhanced View User Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background:
              "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(169, 169, 169, 0.2)",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AccountCircleIcon sx={{ color: "#a9a9a9" }} />
            <Typography variant="h6">User Profile Details</Typography>
          </Box>
          <IconButton
            onClick={() => setViewDialogOpen(false)}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    src={getProfileImageUrl(selectedUser.image)}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      mb: 2,
                      backgroundColor:
                        roleConfig[selectedUser.role]?.color || "#607d8b",
                      fontSize: "3rem",
                      animation: `${pulseGlow} 2s infinite`,
                    }}
                  >
                    {!selectedUser.image &&
                      (selectedUser.name
                        ? selectedUser.name.charAt(0).toUpperCase()
                        : selectedUser.username.charAt(0).toUpperCase())}
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {selectedUser.name || selectedUser.username}
                  </Typography>
                  {getRoleChip(selectedUser.role)}
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon sx={{ color: "#a9a9a9" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Username"
                      secondary={selectedUser.username}
                      sx={{
                        "& .MuiListItemText-primary": { color: "#a9a9a9" },
                        "& .MuiListItemText-secondary": { color: "#ffffff" },
                      }}
                    />
                  </ListItem>

                  {selectedUser.name && (
                    <ListItem>
                      <ListItemIcon>
                        <ContactPageIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Full Name"
                        secondary={selectedUser.name}
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                          "& .MuiListItemText-secondary": { color: "#ffffff" },
                        }}
                      />
                    </ListItem>
                  )}

                  {selectedUser.email && (
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={selectedUser.email}
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                          "& .MuiListItemText-secondary": { color: "#ffffff" },
                        }}
                      />
                    </ListItem>
                  )}

                  {selectedUser.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedUser.phone}
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                          "& .MuiListItemText-secondary": { color: "#ffffff" },
                        }}
                      />
                    </ListItem>
                  )}

                  {selectedUser.website && (
                    <ListItem>
                      <ListItemIcon>
                        <WebIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Website"
                        secondary={
                          <a
                            href={
                              selectedUser.website.startsWith("http")
                                ? selectedUser.website
                                : `https://${selectedUser.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#4caf50", textDecoration: "none" }}
                          >
                            {selectedUser.website}
                          </a>
                        }
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                        }}
                      />
                    </ListItem>
                  )}

                  {selectedUser.location && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={selectedUser.location}
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                          "& .MuiListItemText-secondary": { color: "#ffffff" },
                        }}
                      />
                    </ListItem>
                  )}

                  {selectedUser.description && (
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Description"
                        secondary={selectedUser.description}
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                          "& .MuiListItemText-secondary": { color: "#ffffff" },
                        }}
                      />
                    </ListItem>
                  )}

                  <Divider
                    sx={{ my: 2, backgroundColor: "rgba(169, 169, 169, 0.2)" }}
                  />

                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon sx={{ color: "#a9a9a9" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Member Since"
                      secondary={formatDate(selectedUser.created_at)}
                      sx={{
                        "& .MuiListItemText-primary": { color: "#a9a9a9" },
                        "& .MuiListItemText-secondary": { color: "#ffffff" },
                      }}
                    />
                  </ListItem>

                  {selectedUser.updated_at && (
                    <ListItem>
                      <ListItemIcon>
                        <CalendarTodayIcon sx={{ color: "#a9a9a9" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Last Updated"
                        secondary={formatDate(selectedUser.updated_at)}
                        sx={{
                          "& .MuiListItemText-primary": { color: "#a9a9a9" },
                          "& .MuiListItemText-secondary": { color: "#ffffff" },
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setViewDialogOpen(false)}>
            Close
          </SecondaryButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(169, 169, 169, 0.2)",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WarningIcon sx={{ color: "#f44336" }} />
          <Typography variant="h6">Confirm Deletion</Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete the following user?
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                <Typography variant="h6" sx={{ color: "#f44336" }}>
                  {selectedUser.name || selectedUser.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Username: {selectedUser.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Role:{" "}
                  {roleConfig[selectedUser.role]?.label || selectedUser.role}
                </Typography>
                {selectedUser.email && (
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Email: {selectedUser.email}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ mt: 2, color: "#f44336" }}>
                ⚠️ This action cannot be undone. All associated data will be
                permanently deleted.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </SecondaryButton>
          <DangerButton
            onClick={confirmDeleteUser}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {loading ? "Deleting..." : "Delete User"}
          </DangerButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default ManageAccount;
