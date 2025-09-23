// ListComponent.jsx - Components Listing with Unified Dashboard Design Pattern
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
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Build as BuildIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Engineering as EngineeringIcon,
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

const ListComponent = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
  });
  const [error, setError] = useState("");
  const [componentTypes, setComponentTypes] = useState([]);

  // Contract address - same as used throughout the system
  const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";

  // Get role config
  const roleConfig =
    dashboardConfigs[auth?.role] || dashboardConfigs.manufacturer;

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    filterComponents();
  }, [components, searchQuery, statusFilter, typeFilter, pagination.page]);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/components");
      const componentsData = response.data || [];
      setComponents(componentsData);

      // Extract unique component types for filter dropdown
      const types = [
        ...new Set(componentsData.map((c) => c.component_type)),
      ].filter(Boolean);
      setComponentTypes(types);

      console.log("✅ Fetched components:", componentsData.length);
    } catch (error) {
      console.error("❌ Error fetching components:", error);
      setError("Failed to fetch components. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filterComponents = () => {
    let filtered = [...components];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (component) =>
          component.component_id?.toLowerCase().includes(query) ||
          component.component_type?.toLowerCase().includes(query) ||
          component.serial_number?.toLowerCase().includes(query) ||
          component.raw_material_id?.toLowerCase().includes(query) ||
          component.location?.toLowerCase().includes(query) ||
          component.manufacturer_address?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (component) => component.status === statusFilter
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (component) => component.component_type === typeFilter
      );
    }

    // Pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedResults = filtered.slice(
      startIndex,
      startIndex + pagination.limit
    );

    setFilteredComponents(paginatedResults);
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

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewComponent = (component) => {
    // Navigate to ViewComponent with the component data
    // FIXED: QR Code format should be {CONTRACT_ADDRESS},{component_id}
    navigate("/view-component", {
      state: {
        qrData: `${CONTRACT_ADDRESS},${component.component_id}`,
        entityData: {
          componentId: component.component_id,
          componentType: component.component_type,
          serialNumber: component.serial_number,
          rawMaterialId: component.raw_material_id,
          image: component.image,
          location: component.location,
          timestamp: component.timestamp || component.created_at,
          manufacturerAddress: component.manufacturer_address,
          status: component.status,
          certifierRemarks: component.certifier_remarks,
          certifierImage: component.certifier_image,
          certifierAddress: component.certifier_address,
          certifyTimestamp: component.certify_timestamp,
        },
      },
    });
  };

  const getStatusChip = (status) => {
    const statusInfo = {
      0: { label: "Created", color: "#ff9800", icon: HourglassEmptyIcon },
      1: { label: "Certified", color: "#4caf50", icon: CheckCircleIcon },
      2: { label: "Used in Assembly", color: "#2196f3", icon: BuildIcon },
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

  const searchByComponentId = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/component/${searchQuery.trim()}`);
      if (response.data && response.data.length > 0) {
        setComponents(response.data);
        setError("");
      } else {
        setError(`No component found with Component ID: ${searchQuery}`);
      }
    } catch (error) {
      setError("Error searching for Component ID. Please try again.");
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Statistics data for cards
  const stats = [
    {
      icon: BuildIcon,
      value: components.length,
      label: "Total Components",
      color: roleConfig.primaryColor,
      progress: 100,
    },
    {
      icon: CheckCircleIcon,
      value: components.filter((c) => c.status === "1").length,
      label: "Certified",
      color: "#4caf50",
      progress:
        components.length > 0
          ? (components.filter((c) => c.status === "1").length /
              components.length) *
            100
          : 0,
    },
    {
      icon: EngineeringIcon,
      value: components.filter((c) => c.status === "2").length,
      label: "Used in Assembly",
      color: "#2196f3",
      progress:
        components.length > 0
          ? (components.filter((c) => c.status === "2").length /
              components.length) *
            100
          : 0,
    },
    {
      icon: BuildIcon,
      value: componentTypes.length,
      label: "Component Types",
      color: "#9c27b0",
      progress: 100,
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
            Components Inventory
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(169, 169, 169, 0.8)" }}>
            Complete listing of all manufactured components
          </Typography>
        </WelcomeHeader>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard bordercolor={`${stat.color}50`}>
                  <StatIcon sx={{ fontSize: 40, mb: 1, color: stat.color }} />
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
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

        {/* Search and Filter Controls */}
        <DashboardCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: roleConfig.primaryColor }}
            >
              Search & Filter
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by Component ID, Type, Serial Number, Raw Material ID..."
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

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "rgba(169, 169, 169, 0.7)" }}>
                    Status
                  </InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
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
                    <MenuItem value="0">Created</MenuItem>
                    <MenuItem value="1">Certified</MenuItem>
                    <MenuItem value="2">Used in Assembly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "rgba(169, 169, 169, 0.7)" }}>
                    Type
                  </InputLabel>
                  <Select
                    value={typeFilter}
                    label="Type"
                    onChange={handleTypeFilterChange}
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
                    <MenuItem value="all">All Types</MenuItem>
                    {componentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={fetchComponents}
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

        {/* Components Table */}
        <DashboardCard>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", color: roleConfig.primaryColor }}
            >
              Components ({pagination.total} total)
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
                        <TableCell>Component ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Serial Number</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Raw Material</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredComponents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography
                              variant="body1"
                              sx={{ color: "rgba(169, 169, 169, 0.6)" }}
                            >
                              {searchQuery ||
                              statusFilter !== "all" ||
                              typeFilter !== "all"
                                ? "No components match your search criteria"
                                : "No components found"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredComponents.map((component) => (
                          <TableRow
                            key={component.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(169, 169, 169, 0.05)",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {component.component_id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={component.component_type}
                                variant="outlined"
                                size="small"
                                sx={{
                                  color: roleConfig.primaryColor,
                                  borderColor: roleConfig.primaryColor,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {component.serial_number || "N/A"}
                            </TableCell>
                            <TableCell>
                              {getStatusChip(component.status)}
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  component.raw_material_id ||
                                  "No raw material specified"
                                }
                              >
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    maxWidth: 120,
                                    color: component.raw_material_id
                                      ? "rgba(255, 255, 255, 0.8)"
                                      : "rgba(169, 169, 169, 0.5)",
                                  }}
                                >
                                  {component.raw_material_id || "N/A"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: "rgba(169, 169, 169, 0.8)" }}
                              >
                                {component.created_at
                                  ? dayjs(component.created_at).format(
                                      "MMM DD, YYYY"
                                    )
                                  : "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewComponent(component)}
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>

                {/* Pagination */}
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
      </Container>
    </DashboardLayout>
  );
};

export default ListComponent;
