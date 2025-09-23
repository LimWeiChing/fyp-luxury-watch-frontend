import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled, alpha, keyframes } from "@mui/material/styles";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart as ChartIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Analytics as AnalyticsIcon,
  Psychology as AiIcon,
  MonetizationOn as PriceIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  consumerColors,
  consumerTypography,
  consumerUtils,
} from "./ConsumerTheme";

// Enhanced animations
const chartGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Artistic styled components
const ArtisticChartContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(30, 41, 59, 0.98) 50%, 
    rgba(15, 23, 42, 0.95) 100%
  )`,
  backdropFilter: "blur(20px)",
  border: `2px solid ${alpha("#3b82f6", 0.3)}`,
  borderRadius: "20px",
  position: "relative",
  overflow: "hidden",
  animation: `${chartGlow} 4s infinite ease-in-out`,

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, #a855f7)",
    animation: `${shimmer} 3s infinite`,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 50% 50%, 
      ${alpha("#3b82f6", 0.1)} 0%, 
      transparent 70%
    )`,
    pointerEvents: "none",
  },
}));

const StatsCard = styled(Card)(({ trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "#10b981";
      case "down":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return {
    background: `linear-gradient(135deg, 
      ${alpha(getTrendColor(), 0.1)} 0%, 
      ${alpha(getTrendColor(), 0.05)} 100%
    )`,
    border: `2px solid ${alpha(getTrendColor(), 0.3)}`,
    borderRadius: "16px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: `${slideUp} 0.6s ease-out`,

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 40px ${alpha(getTrendColor(), 0.4)}`,
      borderColor: getTrendColor(),
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "4px",
      height: "100%",
      background: `linear-gradient(180deg, ${getTrendColor()}, ${alpha(
        getTrendColor(),
        0.6
      )})`,
    },
  };
});

const ChartTypeButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: "12px",
  padding: "8px 16px",
  fontWeight: 600,
  textTransform: "none",
  border: `2px solid ${alpha("#3b82f6", 0.3)}`,
  color: "#ffffff",
  transition: "all 0.3s ease",

  "&.Mui-selected": {
    background: "linear-gradient(45deg, #3b82f6, #6366f1)",
    color: "#ffffff",
    boxShadow: `0 4px 20px ${alpha("#3b82f6", 0.4)}`,
    "&:hover": {
      background: "linear-gradient(45deg, #2563eb, #4f46e5)",
    },
  },

  "&:hover": {
    background: alpha("#3b82f6", 0.1),
    borderColor: "#3b82f6",
    transform: "translateY(-2px)",
  },
}));

const AnalysisChip = styled(Chip)(({ analysis }) => {
  const getAnalysisColor = () => {
    switch (analysis) {
      case "bullish":
        return "#10b981";
      case "bearish":
        return "#ef4444";
      case "neutral":
        return "#6b7280";
      case "volatile":
        return "#f59e0b";
      default:
        return "#6366f1";
    }
  };

  return {
    background: `linear-gradient(45deg, ${getAnalysisColor()}, ${alpha(
      getAnalysisColor(),
      0.8
    )})`,
    color: "#ffffff",
    fontWeight: 700,
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontFamily: consumerTypography.accent,
    animation: `${pulseGlow} 3s infinite ease-in-out`,
  };
});

const PriceChart = ({ data, watch, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [chartType, setChartType] = useState("area");
  const [showGrid, setShowGrid] = useState(true);
  const [showTrend, setShowTrend] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  // Enhanced data processing
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      ...item,
      index,
      change: index > 0 ? item.price - data[index - 1].price : 0,
      changePercent:
        index > 0
          ? ((item.price - data[index - 1].price) / data[index - 1].price) * 100
          : 0,
      movingAverage:
        index >= 2
          ? data
              .slice(Math.max(0, index - 2), index + 1)
              .reduce((sum, d) => sum + d.price, 0) / Math.min(3, index + 1)
          : item.price,
    }));
  }, [data]);

  // Enhanced statistics calculation
  const statistics = useMemo(() => {
    if (!processedData.length) return null;

    const prices = processedData.map((d) => d.price);
    const changes = processedData.slice(1).map((d) => d.change);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const currentPrice = prices[prices.length - 1];
    const avgPrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const totalChange = currentPrice - prices[0];
    const totalChangePercent = (totalChange / prices[0]) * 100;

    // Volatility (standard deviation)
    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) /
      prices.length;
    const volatility = Math.sqrt(variance);

    // Trend analysis
    const recentChanges = changes.slice(-3);
    const trend =
      recentChanges.length > 0
        ? recentChanges.reduce((sum, change) => sum + change, 0) > 0
          ? "up"
          : recentChanges.reduce((sum, change) => sum + change, 0) < 0
          ? "down"
          : "flat"
        : "flat";

    // Market analysis
    const positiveChanges = changes.filter((c) => c > 0).length;
    const negativeChanges = changes.filter((c) => c < 0).length;
    const analysis =
      positiveChanges > negativeChanges
        ? "bullish"
        : negativeChanges > positiveChanges
        ? "bearish"
        : "neutral";

    return {
      minPrice,
      maxPrice,
      currentPrice,
      avgPrice,
      totalChange,
      totalChangePercent,
      volatility,
      trend,
      analysis,
      support: minPrice * 1.02, // Support level
      resistance: maxPrice * 0.98, // Resistance level
    };
  }, [processedData]);

  // Chart type handlers
  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${alpha("#3b82f6", 0.5)}`,
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#3b82f6", fontWeight: 700, mb: 1 }}
          >
            {label}
          </Typography>
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
            {consumerUtils.formatPrice(payload[0].value)}
          </Typography>
          {data.change !== 0 && (
            <Typography
              variant="caption"
              sx={{
                color: data.change > 0 ? "#10b981" : "#ef4444",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              {data.change > 0 ? (
                <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, mr: 0.5 }} />
              )}
              {data.change > 0 ? "+" : ""}
              {consumerUtils.formatPrice(data.change)}(
              {data.changePercent > 0 ? "+" : ""}
              {data.changePercent.toFixed(1)}%)
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha("#3b82f6", 0.2)}
                strokeWidth={1}
              />
            )}
            <XAxis
              dataKey="month"
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              fontFamily={consumerTypography.secondary}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              fontFamily={consumerTypography.mono}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            {showTrend && statistics && (
              <>
                <ReferenceLine
                  y={statistics.avgPrice}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: "Average", position: "right" }}
                />
                <ReferenceLine
                  y={statistics.support}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{ value: "Support", position: "right" }}
                />
              </>
            )}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
              activeDot={{
                r: 8,
                stroke: "#3b82f6",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
            {showTrend && (
              <Line
                type="monotone"
                dataKey="movingAverage"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha("#3b82f6", 0.2)}
              />
            )}
            <XAxis
              dataKey="month"
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              fontFamily={consumerTypography.secondary}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              fontFamily={consumerTypography.mono}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            {showTrend && statistics && (
              <ReferenceLine
                y={statistics.avgPrice}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#priceGradient)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha("#3b82f6", 0.2)}
              />
            )}
            <XAxis
              dataKey="month"
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              fontFamily={consumerTypography.secondary}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              fontFamily={consumerTypography.mono}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      default:
        return renderChart();
    }
  };

  if (!data || data.length === 0) {
    return (
      <ArtisticChartContainer sx={{ p: 6, textAlign: "center" }}>
        <Zoom in timeout={600}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              background: "linear-gradient(45deg, #6b7280, #4b5563)",
            }}
          >
            <WarningIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Zoom>
        <Typography
          variant="h5"
          sx={{
            color: "#ffffff",
            fontFamily: consumerTypography.luxury,
            mb: 2,
          }}
        >
          No Price Data Available
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: consumerTypography.secondary,
          }}
        >
          Please run AI analysis first to generate comprehensive price history
          and market insights.
        </Typography>
      </ArtisticChartContainer>
    );
  }

  return (
    <Box>
      {/* Enhanced Statistics Grid */}
      {statistics && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <StatsCard
              trend={statistics.totalChangePercent >= 0 ? "up" : "down"}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background:
                        statistics.totalChangePercent >= 0
                          ? "linear-gradient(45deg, #10b981, #059669)"
                          : "linear-gradient(45deg, #ef4444, #dc2626)",
                    }}
                  >
                    {statistics.totalChangePercent >= 0 ? (
                      <TrendingUp sx={{ fontSize: 18 }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 18 }} />
                    )}
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}
                  >
                    Current Price
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontFamily: consumerTypography.mono,
                  }}
                >
                  {consumerUtils.formatPrice(statistics.currentPrice)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      statistics.totalChangePercent >= 0
                        ? "#10b981"
                        : "#ef4444",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {statistics.totalChangePercent >= 0 ? "+" : ""}
                  {statistics.totalChangePercent.toFixed(1)}%
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={6} md={3}>
            <StatsCard trend="up">
              <CardContent sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: "linear-gradient(45deg, #f59e0b, #d97706)",
                    }}
                  >
                    <SpeedIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}
                  >
                    Volatility
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontFamily: consumerTypography.mono,
                  }}
                >
                  {(
                    (statistics.volatility / statistics.avgPrice) *
                    100
                  ).toFixed(1)}
                  %
                </Typography>
                <AnalysisChip
                  label={
                    statistics.volatility / statistics.avgPrice > 0.1
                      ? "High"
                      : statistics.volatility / statistics.avgPrice > 0.05
                      ? "Medium"
                      : "Low"
                  }
                  size="small"
                  analysis="volatile"
                />
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={6} md={3}>
            <StatsCard trend="flat">
              <CardContent sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: "linear-gradient(45deg, #6366f1, #4f46e5)",
                    }}
                  >
                    <StarIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}
                  >
                    Average Price
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontFamily: consumerTypography.mono,
                  }}
                >
                  {consumerUtils.formatPrice(statistics.avgPrice)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.6)", fontWeight: 500 }}
                >
                  12-month avg
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={6} md={3}>
            <StatsCard
              trend={
                statistics.analysis === "bullish"
                  ? "up"
                  : statistics.analysis === "bearish"
                  ? "down"
                  : "flat"
              }
            >
              <CardContent sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}
                  >
                    Market Outlook
                  </Typography>
                </Stack>
                <AnalysisChip
                  label={statistics.analysis.toUpperCase()}
                  size="small"
                  analysis={statistics.analysis}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {statistics.trend} trend
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>
      )}

      {/* Chart Controls */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ChartTypeButton value="area">
            <AnalyticsIcon sx={{ mr: 1, fontSize: 18 }} />
            Area
          </ChartTypeButton>
          <ChartTypeButton value="line">
            <TimelineIcon sx={{ mr: 1, fontSize: 18 }} />
            Line
          </ChartTypeButton>
          <ChartTypeButton value="bar">
            <BarChartIcon sx={{ mr: 1, fontSize: 18 }} />
            Bar
          </ChartTypeButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Toggle Grid">
            <IconButton
              onClick={() => setShowGrid(!showGrid)}
              sx={{
                color: showGrid ? "#3b82f6" : "rgba(255, 255, 255, 0.5)",
                background: showGrid ? alpha("#3b82f6", 0.2) : "transparent",
              }}
            >
              <ChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Trend Lines">
            <IconButton
              onClick={() => setShowTrend(!showTrend)}
              sx={{
                color: showTrend ? "#f59e0b" : "rgba(255, 255, 255, 0.5)",
                background: showTrend ? alpha("#f59e0b", 0.2) : "transparent",
              }}
            >
              <TrendingUp />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Enhanced Chart Container */}
      <ArtisticChartContainer sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: "#ffffff",
            fontWeight: 700,
            fontFamily: consumerTypography.luxury,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 2,
              background: "linear-gradient(45deg, #3b82f6, #6366f1)",
            }}
          >
            <ChartIcon sx={{ fontSize: 18 }} />
          </Avatar>
          12-Month Price Evolution
          {statistics && (
            <Chip
              label={`${statistics.analysis} Market`}
              size="small"
              sx={{
                ml: 2,
                background:
                  statistics.analysis === "bullish"
                    ? "#10b981"
                    : statistics.analysis === "bearish"
                    ? "#ef4444"
                    : "#6b7280",
                color: "#ffffff",
                fontWeight: 700,
              }}
            />
          )}
        </Typography>

        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          {renderChart()}
        </ResponsiveContainer>
      </ArtisticChartContainer>

      {/* AI Analysis Sections */}
      {watch?.trendAnalysis && (
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%)",
            border: `2px solid ${alpha("#3b82f6", 0.3)}`,
            borderRadius: "16px",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                background: "linear-gradient(45deg, #3b82f6, #6366f1)",
                width: 40,
                height: 40,
              }}
            >
              <AiIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 700,
                  fontFamily: consumerTypography.accent,
                }}
              >
                AI Market Analysis
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Machine learning insights and trend predictions
              </Typography>
            </Box>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.95)",
              lineHeight: 1.6,
              fontFamily: consumerTypography.secondary,
            }}
          >
            {watch.trendAnalysis}
          </Typography>
        </Paper>
      )}

      {watch?.recommendations && (
        <Paper
          elevation={4}
          sx={{
            p: 3,
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.15) 100%)",
            border: `2px solid ${alpha("#f59e0b", 0.3)}`,
            borderRadius: "16px",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                background: "linear-gradient(45deg, #f59e0b, #d97706)",
                width: 40,
                height: 40,
              }}
            >
              <TrophyIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#f59e0b",
                  fontWeight: 700,
                  fontFamily: consumerTypography.accent,
                }}
              >
                Investment Recommendations
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Strategic insights for luxury timepiece investments
              </Typography>
            </Box>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.95)",
              lineHeight: 1.6,
              fontFamily: consumerTypography.secondary,
            }}
          >
            {watch.recommendations}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PriceChart;
