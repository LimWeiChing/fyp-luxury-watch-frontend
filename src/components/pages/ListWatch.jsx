// ListWatch.jsx - Complete Enhanced Watches Listing with Unified Dashboard Design Pattern
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Pagination,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  LinearProgress,
  Fab,
  Badge,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Watch as WatchIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Sell as SellIcon,
  BuildCircle as BuildCircleIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";
import { dashboardConfigs } from "./dashboardConfigs";
import api from "../../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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

// Styled Components
const DashboardCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(47, 47, 47, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(169, 169, 169, 0.2)",
  borderRadius: "16px",
  color: "#ffffff",
  transition: "all 0.3s ease",
  animation: `${fadeInUp} 0.6s ease-out`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
  },
}));

const StatCard = styled(Paper)(({ theme, bordercolor }) => ({
  background: "rgba(60, 60, 60, 0.8)",
  border: `1px solid ${bordercolor || "rgba(169, 169, 169, 0.3)"}`,
  borderRadius: "12px",
  padding: theme.spacing(2),
  color: "#ffffff",
  textAlign: "center",
  animation: `${pulseGlow} 3s infinite`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: "rgba(45, 45, 45, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  "& .MuiTableCell-root": {
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.9)",
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    background: "rgba(51, 51, 51, 0.95)",
    fontWeight: "bold",
  },
}));

const WelcomeHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  animation: `${fadeInUp} 0.8s ease-out`,
}));

const ListWatch = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [watches, setWatches] = useState([]);
  const [filteredWatches, setFilteredWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
  });
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    available: 0,
    sold: 0,
  });

  // Contract address - same as used throughout the system
  const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";

  // Get role config
  const roleConfig = dashboardConfigs[auth?.role] || dashboardConfigs.assembler;

  // Role-based features
  const canAddWatch = auth?.role === "assembler";
  const canViewShipping = ["distributor", "retailer", "admin"].includes(
    auth?.role
  );
  const canViewSales = ["retailer", "consumer", "admin"].includes(auth?.role);

  useEffect(() => {
    fetchWatches();
  }, [auth?.role]);

  useEffect(() => {
    filterWatches();
  }, [watches, searchQuery, statusFilter, availabilityFilter, pagination.page]);

  const fetchWatches = async () => {
    setLoading(true);
    try {
      let endpoint = "/watches";

      // Role-based data filtering
      switch (auth?.role) {
        case "consumer":
          endpoint = "/watches/for-sale";
          break;
        case "retailer":
          endpoint = "/watches/available";
          break;
        case "distributor":
          endpoint = "/watches/shipping";
          break;
        case "assembler":
          if (auth?.wallet_address) {
            endpoint = `/watches/assembler/${auth.wallet_address}`;
          }
          break;
        default:
          endpoint = "/watches";
      }

      const response = await api.get(endpoint);
      let watchesData = [];

      if (response.data.watches) {
        // Handle response with nested structure
        watchesData = response.data.watches;
      } else if (Array.isArray(response.data)) {
        watchesData = response.data;
      } else {
        watchesData = [];
      }

      setWatches(watchesData);
      calculateStats(watchesData);

      console.log(
        `✅ Fetched ${watchesData.length} watches for role: ${auth?.role}`
      );
    } catch (error) {
      console.error("❌ Error fetching watches:", error);
      setError("Failed to fetch watches. Please check your connection.");
      setWatches([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (watchesData) => {
    const newStats = {
      total: watchesData.length,
      delivered: watchesData.filter((w) => w.shipping_status === 3).length,
      available: watchesData.filter((w) => w.available_for_sale && !w.sold)
        .length,
      sold: watchesData.filter((w) => w.sold).length,
    };
    setStats(newStats);
  };

  const filterWatches = () => {
    let filtered = [...watches];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (watch) =>
          watch.watch_id?.toLowerCase().includes(query) ||
          watch.location?.toLowerCase().includes(query) ||
          watch.assembler_address?.toLowerCase().includes(query) ||
          watch.current_owner?.toLowerCase().includes(query) ||
          (watch.component_ids &&
            watch.component_ids.some((id) => id.toLowerCase().includes(query)))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (watch) => watch.shipping_status === parseInt(statusFilter)
      );
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      if (availabilityFilter === "sold") {
        filtered = filtered.filter((watch) => watch.sold === true);
      } else if (availabilityFilter === "available") {
        filtered = filtered.filter(
          (watch) => watch.available_for_sale === true && !watch.sold
        );
      } else if (availabilityFilter === "not_available") {
        filtered = filtered.filter(
          (watch) => !watch.available_for_sale && !watch.sold
        );
      }
    }

    // Pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedResults = filtered.slice(
      startIndex,
      startIndex + pagination.limit
    );

    setFilteredWatches(paginatedResults);
    setPagination((prev) => ({ ...prev, total: filtered.length }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAvailabilityFilterChange = (event) => {
    setAvailabilityFilter(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewWatch = (watch) => {
    // Navigate to ViewWatch with the watch data
    // FIXED: QR Code format should be {CONTRACT_ADDRESS},{watch_id}
    navigate("/view-watch", {
      state: {
        qrData: `${CONTRACT_ADDRESS},${watch.watch_id}`,
        watchData: {
          watchId: watch.watch_id,
          componentIds: watch.component_ids,
          image: watch.image,
          location: watch.location,
          timestamp: watch.timestamp || watch.created_at,
          assemblerAddress: watch.assembler_address,
          currentOwner: watch.current_owner,
          ownershipHistory: watch.ownership_history,
          shippingStatus: watch.shipping_status,
          shippingTrail: watch.shipping_trail,
          distributorAddress: watch.distributor_address,
          retailerAddress: watch.retailer_address,
          availableForSale: watch.available_for_sale,
          sold: watch.sold,
        },
      },
    });
  };

  const handleTraceability = (watchId) => {
    navigate(`/traceability/${watchId}`);
  };

  const getShippingStatusChip = (status) => {
    const statusInfo = {
      0: { label: "Not Shipped", color: "#ff9800", icon: HourglassEmptyIcon },
      1: { label: "Shipped", color: "#2196f3", icon: LocalShippingIcon },
      2: { label: "In Transit", color: "#ff9800", icon: LocalShippingIcon },
      3: { label: "Delivered", color: "#4caf50", icon: CheckCircleIcon },
    };

    const info = statusInfo[status] || {
      label: "Unknown",
      color: "#f44336",
      icon: CancelIcon,
    };
    const IconComponent = info.icon;

    return (
      <Chip
        label={info.label}
        size="small"
        icon={<IconComponent style={{ fontSize: 16 }} />}
        sx={{
          bgcolor: info.color,
          color: "#fff",
          fontWeight: "bold",
        }}
      />
    );
  };

  const getAvailabilityChip = (availableForSale, sold) => {
    if (sold) {
      return (
        <Chip
          label="Sold"
          size="small"
          icon={<CheckCircleIcon style={{ fontSize: 16 }} />}
          sx={{
            bgcolor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      );
    } else if (availableForSale) {
      return (
        <Chip
          label="Available"
          size="small"
          icon={<StoreIcon style={{ fontSize: 16 }} />}
          sx={{
            bgcolor: "#2196f3",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      );
    } else {
      return (
        <Chip
          label="Not Available"
          size="small"
          sx={{
            bgcolor: "#757575",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      );
    }
  };

  const searchByWatchId = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/watch/${searchQuery.trim()}`);
      if (response.data && response.data.length > 0) {
        setWatches(response.data);
        setError("");
      } else {
        setError(`No watch found with Watch ID: ${searchQuery}`);
      }
    } catch (error) {
      setError("Error searching for Watch ID. Please try again.");
    }
  };

  const getPageTitle = () => {
    switch (auth?.role) {
      case "consumer":
        return "Available Watches";
      case "retailer":
        return "Watches Catalog";
      case "distributor":
        return "Shipping Management";
      case "assembler":
        return "My Assembled Watches";
      default:
        return "Watches Inventory";
    }
  };

  const getPageSubtitle = () => {
    switch (auth?.role) {
      case "consumer":
        return "Browse luxury watches available for purchase";
      case "retailer":
        return "Manage your watch sales catalog";
      case "distributor":
        return "Track and manage watch shipments";
      case "assembler":
        return "View and manage your assembled watches";
      default:
        return "Complete listing of all assembled luxury watches";
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Statistics data for cards
  const statsData = [
    {
      icon: WatchIcon,
      value: stats.total,
      label: "Total Watches",
      color: roleConfig.primaryColor,
      progress: 100,
      badgeContent: stats.total,
    },
    {
      icon: CheckCircleIcon,
      value: stats.delivered,
      label: "Delivered",
      color: "#4caf50",
      progress: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
      badgeContent: stats.delivered,
    },
    {
      icon: SellIcon,
      value: stats.available,
      label: "Available for Sale",
      color: "#2196f3",
      progress: stats.total > 0 ? (stats.available / stats.total) * 100 : 0,
      badgeContent: stats.available,
    },
    {
      icon: BuildCircleIcon,
      value: stats.sold,
      label: "Sold",
      color: "#ff9800",
      progress: stats.total > 0 ? (stats.sold / stats.total) * 100 : 0,
      badgeContent: stats.sold,
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Header */}
        <WelcomeHeader>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", "Gambetta", serif',
              fontWeight: 700,
              background: `linear-gradient(45deg, #ffffff 30%, ${roleConfig.primaryColor} 70%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              mb: 1,
            }}
          >
            {getPageTitle()}
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(169, 169, 169, 0.8)" }}>
            {getPageSubtitle()}
          </Typography>
        </WelcomeHeader>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Enhanced Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard bordercolor={`${stat.color}50`}>
                  <Badge badgeContent={stat.badgeContent} color="primary">
                    <StatIcon sx={{ fontSize: 40, mb: 1, color: stat.color }} />
                  </Badge>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(169, 169, 169, 0.8)" }}
                  >
                    {stat.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      mt: 2,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: stat.color,
                      },
                    }}
                  />
                </StatCard>
              </Grid>
            );
          })}
        </Grid>

        {/* Enhanced Search and Filter Controls */}
        <DashboardCard sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: roleConfig.primaryColor }}
              >
                Search & Filter
              </Typography>
              {canAddWatch && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/assemble-watch")}
                  sx={{
                    background: `linear-gradient(45deg, ${roleConfig.primaryColor} 30%, ${roleConfig.primaryColor}CC 90%)`,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${roleConfig.primaryColor}CC 30%, ${roleConfig.primaryColor} 90%)`,
                    },
                  }}
                >
                  Assemble New Watch
                </Button>
              )}
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by Watch ID, Location, Component ID, Owner Address..."
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{ color: "rgba(169, 169, 169, 0.7)" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#ffffff",
                      "& fieldset": {
                        borderColor: "rgba(169, 169, 169, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(169, 169, 169, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: roleConfig.primaryColor,
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(169, 169, 169, 0.5)",
                    },
                  }}
                />
              </Grid>

              {canViewShipping && (
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "rgba(169, 169, 169, 0.7)" }}>
                      Shipping
                    </InputLabel>
                    <Select
                      value={statusFilter}
                      label="Shipping"
                      onChange={handleStatusFilterChange}
                      sx={{
                        color: "#ffffff",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(169, 169, 169, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(169, 169, 169, 0.5)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: roleConfig.primaryColor,
                        },
                        "& .MuiSvgIcon-root": {
                          color: "rgba(169, 169, 169, 0.7)",
                        },
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="0">Not Shipped</MenuItem>
                      <MenuItem value="1">Shipped</MenuItem>
                      <MenuItem value="2">In Transit</MenuItem>
                      <MenuItem value="3">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {canViewSales && (
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "rgba(169, 169, 169, 0.7)" }}>
                      Availability
                    </InputLabel>
                    <Select
                      value={availabilityFilter}
                      label="Availability"
                      onChange={handleAvailabilityFilterChange}
                      sx={{
                        color: "#ffffff",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(169, 169, 169, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(169, 169, 169, 0.5)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: roleConfig.primaryColor,
                        },
                        "& .MuiSvgIcon-root": {
                          color: "rgba(169, 169, 169, 0.7)",
                        },
                      }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="sold">Sold</MenuItem>
                      <MenuItem value="not_available">Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={fetchWatches}
                  disabled={loading}
                  sx={{
                    color: roleConfig.primaryColor,
                    bgcolor: "rgba(169, 169, 169, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(169, 169, 169, 0.2)",
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </DashboardCard>

        {/* Enhanced Watches Table */}
        <DashboardCard>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", color: roleConfig.primaryColor }}
            >
              {getPageTitle()} ({pagination.total} total)
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress sx={{ color: roleConfig.primaryColor }} />
              </Box>
            ) : (
              <>
                <StyledTableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Watch ID</TableCell>
                        <TableCell>Components</TableCell>
                        {canViewShipping && (
                          <TableCell>Shipping Status</TableCell>
                        )}
                        {canViewSales && <TableCell>Availability</TableCell>}
                        <TableCell>Location</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredWatches.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={canViewShipping && canViewSales ? 7 : 6}
                            align="center"
                            sx={{ py: 4 }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ color: "rgba(169, 169, 169, 0.6)" }}
                            >
                              {searchQuery ||
                              statusFilter !== "all" ||
                              availabilityFilter !== "all"
                                ? "No watches match your search criteria"
                                : "No watches found"}
                            </Typography>
                            {(searchQuery ||
                              statusFilter !== "all" ||
                              availabilityFilter !== "all") && (
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setSearchQuery("");
                                  setStatusFilter("all");
                                  setAvailabilityFilter("all");
                                }}
                                sx={{
                                  mt: 2,
                                  borderColor: roleConfig.primaryColor,
                                  color: roleConfig.primaryColor,
                                  "&:hover": {
                                    borderColor: roleConfig.primaryColor,
                                    backgroundColor: `${roleConfig.primaryColor}1a`,
                                  },
                                }}
                              >
                                Clear Filters
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredWatches.map((watch) => (
                          <TableRow
                            key={watch.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(169, 169, 169, 0.05)",
                              },
                              cursor: "pointer",
                            }}
                            onClick={() => handleViewWatch(watch)}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {watch.watch_id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${
                                  watch.component_ids?.length || 0
                                } components`}
                                variant="outlined"
                                size="small"
                                sx={{
                                  color: roleConfig.primaryColor,
                                  borderColor: roleConfig.primaryColor,
                                }}
                              />
                            </TableCell>
                            {canViewShipping && (
                              <TableCell>
                                {getShippingStatusChip(watch.shipping_status)}
                              </TableCell>
                            )}
                            {canViewSales && (
                              <TableCell>
                                {getAvailabilityChip(
                                  watch.available_for_sale,
                                  watch.sold
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                              <Tooltip
                                title={
                                  watch.location || "No location specified"
                                }
                              >
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    maxWidth: 150,
                                    color: watch.location
                                      ? "rgba(255, 255, 255, 0.8)"
                                      : "rgba(169, 169, 169, 0.5)",
                                  }}
                                >
                                  {watch.location || "N/A"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: "rgba(169, 169, 169, 0.8)" }}
                              >
                                {watch.created_at
                                  ? dayjs(watch.created_at).format(
                                      "MMM DD, YYYY"
                                    )
                                  : "N/A"}
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
                                      handleViewWatch(watch);
                                    }}
                                    sx={{
                                      color: roleConfig.primaryColor,
                                      "&:hover": {
                                        backgroundColor: `${roleConfig.primaryColor}1a`,
                                      },
                                    }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>

                                {/* Role-based action buttons */}
                                {auth?.role === "distributor" &&
                                  watch.shipping_status < 3 && (
                                    <Tooltip title="Update Shipping">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("/update-shipping", {
                                            state: { watchId: watch.watch_id },
                                          });
                                        }}
                                        sx={{
                                          color: "#2196f3",
                                          "&:hover": {
                                            backgroundColor:
                                              "rgba(33, 150, 243, 0.1)",
                                          },
                                        }}
                                      >
                                        <LocalShippingIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                {auth?.role === "retailer" &&
                                  watch.shipping_status === 3 &&
                                  !watch.available_for_sale && (
                                    <Tooltip title="Mark Available">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("/mark-available", {
                                            state: { watchId: watch.watch_id },
                                          });
                                        }}
                                        sx={{
                                          color: "#9c27b0",
                                          "&:hover": {
                                            backgroundColor:
                                              "rgba(156, 39, 176, 0.1)",
                                          },
                                        }}
                                      >
                                        <StoreIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                {auth?.role === "consumer" &&
                                  watch.available_for_sale &&
                                  !watch.sold && (
                                    <Tooltip title="Purchase Watch">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("/purchase-watch", {
                                            state: { watchId: watch.watch_id },
                                          });
                                        }}
                                        sx={{
                                          color: "#ff9800",
                                          "&:hover": {
                                            backgroundColor:
                                              "rgba(255, 152, 0, 0.1)",
                                          },
                                        }}
                                      >
                                        <ShoppingCartIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "rgba(255, 255, 255, 0.9)",
                          borderColor: "rgba(169, 169, 169, 0.3)",
                          "&:hover": {
                            backgroundColor: "rgba(169, 169, 169, 0.1)",
                          },
                        },
                        "& .Mui-selected": {
                          bgcolor: `${roleConfig.primaryColor} !important`,
                          color: "#ffffff",
                          "&:hover": {
                            bgcolor: `${roleConfig.primaryColor} !important`,
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </DashboardCard>

        {/* Floating Action Button for Quick Actions */}
        {canAddWatch && (
          <Fab
            color="primary"
            aria-label="add watch"
            onClick={() => navigate("/assemble-watch")}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              background: `linear-gradient(45deg, ${roleConfig.primaryColor} 30%, ${roleConfig.primaryColor}CC 90%)`,
              "&:hover": {
                background: `linear-gradient(45deg, ${roleConfig.primaryColor}CC 30%, ${roleConfig.primaryColor} 90%)`,
              },
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default ListWatch;
