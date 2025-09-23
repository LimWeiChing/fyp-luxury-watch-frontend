// ListRaw.jsx - Raw Materials Listing with Unified Dashboard Design Pattern
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
  Inventory as InventoryIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  LocalShipping as LocalShippingIcon,
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

const ListRaw = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [rawMaterials, setRawMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
  });
  const [error, setError] = useState("");
  const [materialTypes, setMaterialTypes] = useState([]);

  // Contract address - same as used in RegisterRawMaterial
  const CONTRACT_ADDRESS = "0x0172B73e1C608cf50a8adC16c9182782B89bf74f";

  // Get role config
  const roleConfig = dashboardConfigs[auth?.role] || dashboardConfigs.supplier;

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [
    rawMaterials,
    searchQuery,
    statusFilter,
    materialTypeFilter,
    pagination.page,
  ]);

  const fetchRawMaterials = async () => {
    setLoading(true);
    try {
      const response = await api.get("/raw-materials");
      const materials = response.data || [];
      setRawMaterials(materials);

      // Extract unique material types for filter dropdown
      const types = [...new Set(materials.map((m) => m.material_type))].filter(
        Boolean
      );
      setMaterialTypes(types);

      console.log("✅ Fetched raw materials:", materials.length);
    } catch (error) {
      console.error("❌ Error fetching raw materials:", error);
      setError("Failed to fetch raw materials. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = [...rawMaterials];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (material) =>
          material.component_id?.toLowerCase().includes(query) ||
          material.material_type?.toLowerCase().includes(query) ||
          material.origin?.toLowerCase().includes(query) ||
          material.location?.toLowerCase().includes(query) ||
          material.supplier_address?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((material) => {
        if (statusFilter === "used") return material.used === true;
        if (statusFilter === "available")
          return material.used === false || material.used === null;
        return true;
      });
    }

    // Material type filter
    if (materialTypeFilter !== "all") {
      filtered = filtered.filter(
        (material) => material.material_type === materialTypeFilter
      );
    }

    // Pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedResults = filtered.slice(
      startIndex,
      startIndex + pagination.limit
    );

    setFilteredMaterials(paginatedResults);
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

  const handleMaterialTypeFilterChange = (event) => {
    setMaterialTypeFilter(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewMaterial = (material) => {
    // Navigate to ViewRawMaterial component with the material data
    // FIXED: QR Code format should be {CONTRACT_ADDRESS},{component_id}
    navigate("/view-raw-material", {
      state: {
        qrData: `${CONTRACT_ADDRESS},${material.component_id}`,
        entityData: {
          componentId: material.component_id,
          materialType: material.material_type,
          origin: material.origin,
          image: material.image,
          location: material.location,
          timestamp: material.timestamp || material.created_at,
          supplier: material.supplier_address,
          used: material.used,
        },
      },
    });
  };

  const getStatusChip = (used) => {
    return (
      <Chip
        label={used ? "Used" : "Available"}
        size="small"
        sx={{
          bgcolor: used ? "#f44336" : "#4caf50",
          color: "#fff",
          fontWeight: "bold",
        }}
      />
    );
  };

  const searchByComponentId = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/raw-material/${searchQuery.trim()}`);
      if (response.data && response.data.length > 0) {
        setRawMaterials(response.data);
        setError("");
      } else {
        setError(`No raw material found with Component ID: ${searchQuery}`);
      }
    } catch (error) {
      setError("Error searching for Component ID. Please try again.");
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Statistics data for cards
  const stats = [
    {
      icon: InventoryIcon,
      value: rawMaterials.length,
      label: "Total Materials",
      color: roleConfig.primaryColor,
      progress: 100,
    },
    {
      icon: TrendingUpIcon,
      value: rawMaterials.filter((m) => !m.used).length,
      label: "Available",
      color: "#4caf50",
      progress:
        rawMaterials.length > 0
          ? (rawMaterials.filter((m) => !m.used).length / rawMaterials.length) *
            100
          : 0,
    },
    {
      icon: LocalShippingIcon,
      value: rawMaterials.filter((m) => m.used).length,
      label: "Used",
      color: "#f44336",
      progress:
        rawMaterials.length > 0
          ? (rawMaterials.filter((m) => m.used).length / rawMaterials.length) *
            100
          : 0,
    },
    {
      icon: AssignmentIcon,
      value: materialTypes.length,
      label: "Material Types",
      color: "#ff9800",
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
            Raw Materials Inventory
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(169, 169, 169, 0.8)" }}>
            Complete listing of all registered raw materials
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
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search by Component ID, Material Type, Origin, Location..."
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
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="used">Used</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "rgba(169, 169, 169, 0.7)" }}>
                    Type
                  </InputLabel>
                  <Select
                    value={materialTypeFilter}
                    label="Type"
                    onChange={handleMaterialTypeFilterChange}
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
                    {materialTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={1}>
                <IconButton
                  onClick={fetchRawMaterials}
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

        {/* Raw Materials Table */}
        <DashboardCard>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", color: roleConfig.primaryColor }}
            >
              Raw Materials ({pagination.total} total)
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
                        <TableCell>Material Type</TableCell>
                        <TableCell>Origin</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMaterials.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography
                              variant="body1"
                              sx={{ color: "rgba(169, 169, 169, 0.6)" }}
                            >
                              {searchQuery ||
                              statusFilter !== "all" ||
                              materialTypeFilter !== "all"
                                ? "No materials match your search criteria"
                                : "No raw materials found"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMaterials.map((material) => (
                          <TableRow
                            key={material.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(169, 169, 169, 0.05)",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {material.component_id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={material.material_type}
                                variant="outlined"
                                size="small"
                                sx={{
                                  color: roleConfig.primaryColor,
                                  borderColor: roleConfig.primaryColor,
                                }}
                              />
                            </TableCell>
                            <TableCell>{material.origin}</TableCell>
                            <TableCell>
                              {getStatusChip(material.used)}
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  material.location || "No location specified"
                                }
                              >
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    maxWidth: 150,
                                    color: material.location
                                      ? "rgba(255, 255, 255, 0.8)"
                                      : "rgba(169, 169, 169, 0.5)",
                                  }}
                                >
                                  {material.location || "N/A"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: "rgba(169, 169, 169, 0.8)" }}
                              >
                                {material.created_at
                                  ? dayjs(material.created_at).format(
                                      "MMM DD, YYYY"
                                    )
                                  : "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewMaterial(material)}
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

export default ListRaw;
