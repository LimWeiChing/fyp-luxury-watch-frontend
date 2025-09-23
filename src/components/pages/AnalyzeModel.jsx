import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stack,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Watch as WatchIcon,
  Psychology as AiIcon,
  SmartToy as RobotIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ShowChart as ChartIcon,
  TrendingUp,
  TrendingDown,
  Assessment as AssessmentIcon,
  MonetizationOn as PriceIcon,
  Timeline as TimelineIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import api from "../../api/axios";
import {
  consumerColors,
  consumerTypography,
  consumerUtils,
} from "./ConsumerTheme";

// PERFORMANCE OPTIMIZED: Simplified styled components
const SimpleAnalysisCard = styled(Paper)(({ theme }) => ({
  background: consumerColors.alpha.primary10,
  border: `1px solid ${consumerColors.alpha.primary20}`,
  borderRadius: "12px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  color: "#ffffff",
  // Removed heavy effects for performance
}));

const SimpleInfoCard = styled(Paper)(({ theme }) => ({
  background: consumerColors.alpha.primary15,
  border: `1px solid ${consumerColors.alpha.primary30}`,
  borderRadius: "8px",
  padding: theme.spacing(2),
  color: "#ffffff",
  // Removed heavy effects for performance
}));

const SimpleButton = styled(Button)(({ theme, luxury }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.9rem",
  fontFamily: consumerTypography.accent,
  ...(luxury === "true" && {
    background: consumerColors.gradients.gold,
    color: "#000000",
    "&:hover": {
      background: consumerColors.gradients.accent,
    },
  }),
}));

// Generate dynamic month range for the last 12 months
const generateMonthRange = () => {
  const currentDate = new Date();
  const months = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Start from 11 months ago to current month
  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    months.push(`${monthName} ${year}`);
  }

  return months;
};

const AnalyzeModel = ({ watch, onAnalysisComplete, buttonType = "icon" }) => {
  // AI Analysis states
  const [aiAnalysisDialogOpen, setAiAnalysisDialogOpen] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisError, setAiAnalysisError] = useState("");
  const [aiAnalysisSuccess, setAiAnalysisSuccess] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  // Price chart states
  const [priceChartData, setPriceChartData] = useState([]);
  const [showPriceChart, setShowPriceChart] = useState(false);

  // Prepare price chart data from monthly prices with dynamic months
  const preparePriceChartData = (monthlyPrices) => {
    if (!monthlyPrices || monthlyPrices.length !== 12) {
      return [];
    }

    // Generate current month labels dynamically
    const monthLabels = generateMonthRange();

    return monthlyPrices.map((price, index) => ({
      month: monthLabels[index],
      price: parseFloat(price) || 0,
      monthIndex: index,
    }));
  };

  // PERFORMANCE OPTIMIZED: Simplified Price Chart Component
  const PriceChartComponent = ({ data, analysisResult }) => {
    if (!data || data.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <ChartIcon
            sx={{ fontSize: 60, color: consumerColors.alpha.primary50, mb: 2 }}
          />
          <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            No price data available
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Run AI analysis to generate 12-month price history
          </Typography>
        </Box>
      );
    }

    const minPrice = Math.min(...data.map((d) => d.price));
    const maxPrice = Math.max(...data.map((d) => d.price));
    const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;
    const currentPrice = data[data.length - 1]?.price || 0;
    const priceChange =
      data.length > 1
        ? ((currentPrice - data[0].price) / data[0].price) * 100
        : 0;

    return (
      <Box>
        {/* SIMPLIFIED: Price Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                background: consumerColors.alpha.primary10,
                border: `1px solid ${consumerColors.alpha.primary20}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
              >
                Current Price
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: consumerColors.primary }}
              >
                ${currentPrice.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                background: consumerColors.alpha.primary10,
                border: `1px solid ${consumerColors.alpha.primary20}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
              >
                12M Change
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color:
                    priceChange >= 0
                      ? consumerColors.success
                      : consumerColors.error,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                {priceChange >= 0 ? (
                  <TrendingUp sx={{ fontSize: 20 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 20 }} />
                )}
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                background: consumerColors.alpha.primary10,
                border: `1px solid ${consumerColors.alpha.primary20}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
              >
                12M High
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: consumerColors.success }}
              >
                ${maxPrice.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                background: consumerColors.alpha.primary10,
                border: `1px solid ${consumerColors.alpha.primary20}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
              >
                12M Low
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: consumerColors.error }}
              >
                ${minPrice.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SIMPLIFIED: Price Chart */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            background: consumerColors.alpha.primary10,
            border: `1px solid ${consumerColors.alpha.primary20}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                background: consumerColors.gradients.primary,
                width: 32,
                height: 32,
                mr: 2,
              }}
            >
              <TimelineIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: consumerTypography.accent,
              }}
            >
              12-Month Price History
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={consumerColors.alpha.primary30}
              />
              <XAxis
                dataKey="month"
                stroke="rgba(255, 255, 255, 0.7)"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.7)"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 30, 30, 0.95)",
                  border: `1px solid ${consumerColors.alpha.primary30}`,
                  borderRadius: "8px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  color: "#ffffff",
                }}
                formatter={(value) => [
                  `$${value.toLocaleString()}`,
                  "Market Price",
                ]}
                labelStyle={{ color: consumerColors.primary, fontWeight: 700 }}
                cursor={{
                  stroke: consumerColors.primary,
                  strokeWidth: 2,
                  strokeDasharray: "3 3",
                }}
              />
              <ReferenceLine
                y={avgPrice}
                stroke={consumerColors.accent}
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Avg: $${avgPrice.toLocaleString()}`,
                  position: "topRight",
                  style: {
                    fill: consumerColors.accent,
                    fontWeight: 600,
                    fontSize: "12px",
                  },
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={consumerColors.primary}
                strokeWidth={3}
                dot={{ fill: consumerColors.primary, strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: consumerColors.primary,
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* SIMPLIFIED: AI Trend Analysis */}
        {analysisResult?.trendAnalysis && (
          <SimpleAnalysisCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  background: consumerColors.gradients.primary,
                  width: 32,
                  height: 32,
                  mr: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: consumerColors.primary,
                  fontFamily: consumerTypography.accent,
                }}
              >
                AI Trend Analysis
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.6,
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              {analysisResult.trendAnalysis}
            </Typography>
          </SimpleAnalysisCard>
        )}

        {/* SIMPLIFIED: AI Recommendations */}
        {analysisResult?.recommendations && (
          <SimpleAnalysisCard
            sx={{
              background: `linear-gradient(135deg, ${consumerColors.alpha.accent10} 0%, ${consumerColors.alpha.gold10} 100%)`,
              border: `1px solid ${consumerColors.accent}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  background: consumerColors.gradients.accent,
                  width: 32,
                  height: 32,
                  mr: 2,
                }}
              >
                <AssessmentIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: consumerColors.accent,
                  fontFamily: consumerTypography.accent,
                }}
              >
                Investment Recommendations
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.6,
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              {analysisResult.recommendations}
            </Typography>
          </SimpleAnalysisCard>
        )}
      </Box>
    );
  };

  // Handle analyze watch click
  const handleAnalyzeWatch = () => {
    console.log("🤖 Initiating AI analysis for watch:", watch.watch_id);
    setAiAnalysisDialogOpen(true);
    setAiAnalysisError("");
    setAiAnalysisSuccess("");
    setAiAnalysisResult(null);
    setPriceChartData([]);
    setShowPriceChart(false);
  };

  // Perform AI analysis with enhanced monthly price tracking
  const performAiAnalysis = async () => {
    if (!watch) return;

    console.log("🤖 Starting enhanced AI analysis for:", watch.watch_id);

    setAiAnalysisLoading(true);
    setAiAnalysisError("");
    setAiAnalysisSuccess("");
    setAiAnalysisResult(null);
    setPriceChartData([]);
    setShowPriceChart(false);

    try {
      // Check if watch has an image
      if (!watch.image) {
        setAiAnalysisError(
          "This watch does not have an image for AI analysis."
        );
        return;
      }

      // Make AI analysis request
      const response = await api.post(
        "/analyze-watch",
        {
          watchId: watch.watch_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 90000, // 90 seconds for enhanced AI analysis
        }
      );
      if (response.data && response.data.success) {
        console.log("🤖 Enhanced AI Analysis successful:", response.data.data);

        const analysisData = response.data.data;
        setAiAnalysisResult(analysisData);

        // Prepare price chart data with dynamic months
        if (
          analysisData.monthlyPrices &&
          analysisData.monthlyPrices.length === 12
        ) {
          const chartData = preparePriceChartData(analysisData.monthlyPrices);
          setPriceChartData(chartData);
          setShowPriceChart(true);
          console.log("📊 Price chart data prepared:", chartData);
        }

        // Generate dynamic month range for success message
        const monthRange = generateMonthRange();
        const startMonth = monthRange[0];
        const endMonth = monthRange[11];

        // Improved success message handling
        const isReanalysis = analysisData.isReanalysis || watch.ai_analyzed;
        setAiAnalysisSuccess(
          isReanalysis
            ? `AI re-analysis completed successfully! Updated with latest 12-month price data (${startMonth} to ${endMonth}) and trend analysis.`
            : `AI analysis completed successfully! Generated 12-month price history (${startMonth} to ${endMonth}) and market insights.`
        );

        // Call the callback to update parent component with enhanced data
        if (onAnalysisComplete) {
          onAnalysisComplete(watch.watch_id, {
            ai_analyzed: true,
            ai_watch_model: analysisData.aiWatchModel,
            ai_market_price: analysisData.aiMarketPrice,
            ai_confidence_score: analysisData.confidence,
            ai_analysis_date: analysisData.analysisDate,
            monthlyPrices: analysisData.monthlyPrices,
            trendAnalysis: analysisData.trendAnalysis,
            recommendations: analysisData.recommendations,
          });
        }

        console.log("✅ Enhanced AI analysis data sent to parent component");
      } else {
        throw new Error(response.data.message || "AI analysis failed");
      }
    } catch (error) {
      console.error("❌ Enhanced AI Analysis error:", error);
      if (error.code === "ECONNABORTED") {
        setAiAnalysisError(
          "AI analysis timeout. The enhanced analysis with price tracking takes longer. Please try again."
        );
      } else {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Enhanced AI analysis failed";
        setAiAnalysisError(`AI analysis failed: ${errorMsg}`);
      }
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    if (!aiAnalysisLoading) {
      setAiAnalysisDialogOpen(false);
      setPriceChartData([]);
      setShowPriceChart(false);
    }
  };

  // PERFORMANCE OPTIMIZED: Render analyze button based on type
  const renderAnalyzeButton = () => {
    if (buttonType === "button") {
      return (
        <SimpleButton
          size="medium"
          startIcon={watch.ai_analyzed ? <AnalyticsIcon /> : <AiIcon />}
          onClick={handleAnalyzeWatch}
          sx={{
            background: watch.ai_analyzed
              ? consumerColors.gradients.accent
              : consumerColors.gradients.primary,
            color: watch.ai_analyzed ? "#000000" : "#ffffff",
            "&:hover": {
              background: watch.ai_analyzed
                ? consumerColors.gradients.gold
                : consumerColors.gradients.secondary,
            },
          }}
        >
          {watch.ai_analyzed ? "Re-analyze" : "AI Analyze"}
        </SimpleButton>
      );
    }

    // Default to icon button
    return (
      <Tooltip
        title={
          watch.ai_analyzed
            ? "View/Re-analyze with Enhanced AI"
            : "Analyze with Enhanced AI"
        }
      >
        <IconButton
          size="medium"
          onClick={handleAnalyzeWatch}
          sx={{
            background: watch.ai_analyzed
              ? consumerColors.gradients.accent
              : consumerColors.gradients.primary,
            color: watch.ai_analyzed ? "#000000" : "#ffffff",
            width: 40,
            height: 40,
            "&:hover": {
              background: watch.ai_analyzed
                ? consumerColors.gradients.gold
                : consumerColors.gradients.secondary,
            },
          }}
        >
          {watch.ai_analyzed ? (
            <AnalyticsIcon sx={{ fontSize: 18 }} />
          ) : (
            <AiIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Tooltip>
    );
  };

  // Get current month range for display
  const getCurrentMonthRange = () => {
    const monthLabels = generateMonthRange();
    return {
      start: monthLabels[0],
      end: monthLabels[11],
    };
  };

  const monthRange = getCurrentMonthRange();

  return (
    <>
      {renderAnalyzeButton()}

      {/* PERFORMANCE OPTIMIZED: Simplified AI Analysis Dialog */}
      <Dialog
        open={aiAnalysisDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md" // Reduced from lg for performance
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3, // Reduced radius
            background: consumerColors.alpha.white95,
            border: `1px solid ${consumerColors.alpha.white20}`,
            minHeight: "70vh", // Reduced height
          },
        }}
      >
        <DialogTitle
          sx={{
            background: consumerColors.gradients.gold,
            color: "#000000",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
            <Avatar
              sx={{
                mr: 2,
                background: consumerColors.gradients.primary,
                width: 48,
                height: 48,
              }}
            >
              <AiIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "700",
                  color: "#000000",
                  fontFamily: consumerTypography.luxury,
                }}
              >
                AI Watch Analysis
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.7)" }}>
                Complete market analysis with 12-month price tracking (
                {monthRange.start} to {monthRange.end}) and trend insights
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 2,
            background: consumerColors.gradients.card,
            color: "#ffffff",
          }}
        >
          {watch && (
            <Box>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "rgba(255, 255, 255, 0.9)" }}
              >
                {watch.ai_analyzed ? "Re-analyze" : "Analyze"}{" "}
                <strong style={{ color: consumerColors.primary }}>
                  {watch.watch_id}
                </strong>{" "}
                using Google Gemini AI to identify the watch model, estimate
                current market price, generate 12-month price history (
                {monthRange.start} to {monthRange.end}), and provide investment
                insights.
              </Typography>

              {/* SIMPLIFIED: Watch Information Card */}
              <SimpleInfoCard sx={{ mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    {watch.image ? (
                      <Box
                        component="img"
                        src={`${api.defaults.baseURL}/file/watch/${watch.image}`}
                        alt={`Watch ${watch.watch_id}`}
                        sx={{
                          width: "100%",
                          height: 150, // Reduced height
                          objectFit: "cover",
                          borderRadius: 2,
                          border: `2px solid ${consumerColors.primary}`,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: 150,
                          background: consumerColors.gradients.card,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          border: `2px solid ${consumerColors.primary}`,
                        }}
                      >
                        <WatchIcon
                          sx={{ fontSize: 40, color: consumerColors.primary }}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack spacing={1.5}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "700",
                          color: "#ffffff",
                          fontFamily: consumerTypography.accent,
                        }}
                      >
                        Watch Information
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        Watch ID:{" "}
                        <span style={{ color: consumerColors.primary }}>
                          {watch.watch_id}
                        </span>
                      </Typography>
                      {watch.retail_price > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "600",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Retail Price:{" "}
                          <span style={{ color: consumerColors.accent }}>
                            {consumerUtils.formatPrice(watch.retail_price)}
                          </span>
                        </Typography>
                      )}
                      {watch.ai_analyzed ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "600",
                              color: "rgba(255, 255, 255, 0.9)",
                              mb: 1,
                            }}
                          >
                            Current AI Analysis:
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="AI Analysis Complete"
                              size="small"
                              sx={{
                                background: consumerColors.gradients.accent,
                                color: "#000000",
                                fontWeight: "600",
                                "& .MuiChip-icon": { color: "#000000" },
                              }}
                            />
                            <Chip
                              icon={<ChartIcon />}
                              label="Price History Available"
                              size="small"
                              sx={{
                                background: consumerColors.gradients.primary,
                                color: "#ffffff",
                                fontWeight: "600",
                                "& .MuiChip-icon": { color: "#ffffff" },
                              }}
                            />
                          </Stack>
                          {watch.ai_watch_model && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: consumerColors.success,
                                fontWeight: "500",
                                mb: 1,
                              }}
                            >
                              Model: {watch.ai_watch_model}
                            </Typography>
                          )}
                          {watch.ai_market_price > 0 && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: consumerColors.success,
                                fontWeight: "500",
                              }}
                            >
                              AI Market Price:{" "}
                              {consumerUtils.formatPrice(watch.ai_market_price)}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontStyle: "italic",
                          }}
                        >
                          This watch has not been analyzed yet. Enhanced AI
                          analysis will provide model identification, current
                          market price, 12-month price history (
                          {monthRange.start} to {monthRange.end}), and
                          investment insights.
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </SimpleInfoCard>

              {/* SIMPLIFIED: AI Analysis Results Display with Price Chart */}
              {aiAnalysisResult && (
                <SimpleAnalysisCard
                  sx={{
                    background: consumerColors.alpha.primary15,
                    border: `1px solid ${consumerColors.primary}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: consumerColors.gradients.primary,
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      <RobotIcon />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "700",
                        color: consumerColors.primary,
                        fontFamily: consumerTypography.luxury,
                      }}
                    >
                      🤖 Enhanced AI Analysis Results
                    </Typography>
                  </Box>

                  {/* Basic Analysis Results */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "700",
                            color: consumerColors.primary,
                            mb: 1,
                          }}
                        >
                          Identified Model:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "#ffffff", fontWeight: "600" }}
                        >
                          {aiAnalysisResult.aiWatchModel}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "700",
                            color: consumerColors.primary,
                            mb: 1,
                          }}
                        >
                          Current Market Price:
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: consumerColors.accent,
                            fontWeight: "800",
                          }}
                        >
                          {consumerUtils.formatPrice(
                            aiAnalysisResult.aiMarketPrice
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider
                    sx={{ my: 2, borderColor: consumerColors.alpha.primary30 }}
                  />

                  {/* Price Chart and Analysis */}
                  {showPriceChart && (
                    <PriceChartComponent
                      data={priceChartData}
                      analysisResult={aiAnalysisResult}
                    />
                  )}
                </SimpleAnalysisCard>
              )}

              {/* SIMPLIFIED: Loading State */}
              {aiAnalysisLoading && (
                <Box sx={{ mt: 3, mb: 2, textAlign: "center" }}>
                  <CircularProgress
                    size={60}
                    sx={{
                      color: consumerColors.primary,
                      mb: 3,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "700",
                      color: "#ffffff",
                      mb: 1,
                      fontFamily: consumerTypography.accent,
                    }}
                  >
                    🤖 Enhanced AI Analysis in Progress...
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2 }}
                  >
                    Generating comprehensive market analysis with 12-month price
                    tracking ({monthRange.start} to {monthRange.end})
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontStyle: "italic",
                    }}
                  >
                    This enhanced analysis may take up to 90 seconds
                  </Typography>

                  {/* SIMPLIFIED: Progress indicators */}
                  <Box
                    sx={{ mt: 3, textAlign: "left", maxWidth: 400, mx: "auto" }}
                  >
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress
                          size={16}
                          sx={{ mr: 2, color: consumerColors.success }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Analyzing watch image and identifying model...
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress
                          size={16}
                          sx={{ mr: 2, color: consumerColors.accent }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Generating 12-month price history ({monthRange.start}{" "}
                          to {monthRange.end})...
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress
                          size={16}
                          sx={{ mr: 2, color: consumerColors.primary }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Performing trend analysis and generating
                          recommendations...
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              )}

              {/* Error State */}
              {aiAnalysisError && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                    color: "#ffffff",
                  }}
                >
                  {aiAnalysisError}
                </Alert>
              )}

              {/* Success State */}
              {aiAnalysisSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: consumerColors.alpha.accent10,
                    border: `1px solid ${consumerColors.accent}`,
                    color: "#ffffff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <RobotIcon sx={{ mr: 1, color: consumerColors.accent }} />
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      {aiAnalysisSuccess}
                    </Typography>
                  </Box>
                </Alert>
              )}

              {/* No Image Warning */}
              {!aiAnalysisLoading && !watch.image && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: consumerColors.alpha.primary10,
                    border: `1px solid ${consumerColors.warning}`,
                    color: "#ffffff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InfoIcon sx={{ mr: 1, color: consumerColors.warning }} />
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      This watch does not have an image. Please upload an image
                      first to enable AI analysis.
                    </Typography>
                  </Box>
                </Alert>
              )}

              {/* SIMPLIFIED: Feature Information */}
              {!aiAnalysisLoading && !aiAnalysisResult && watch.image && (
                <SimpleInfoCard sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: consumerColors.primary,
                      fontFamily: consumerTypography.accent,
                    }}
                  >
                    Enhanced AI Analysis Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon
                            sx={{
                              color: consumerColors.success,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                          >
                            Watch model identification
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon
                            sx={{
                              color: consumerColors.success,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                          >
                            Current market price estimation
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon
                            sx={{
                              color: consumerColors.success,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                          >
                            12-month price history ({monthRange.start} to{" "}
                            {monthRange.end})
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon
                            sx={{
                              color: consumerColors.success,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                          >
                            Interactive price chart visualization
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon
                            sx={{
                              color: consumerColors.success,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                          >
                            AI-powered trend analysis
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon
                            sx={{
                              color: consumerColors.success,
                              mr: 1,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                          >
                            Investment recommendations
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </SimpleInfoCard>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{ p: 3, pt: 2, background: consumerColors.gradients.card }}
        >
          <SimpleButton
            onClick={handleCloseDialog}
            disabled={aiAnalysisLoading}
            variant="outlined"
            sx={{
              color: "#ffffff",
              borderColor: consumerColors.alpha.primary50,
              "&:hover": {
                borderColor: consumerColors.primary,
                background: consumerColors.alpha.primary10,
              },
            }}
          >
            Close
          </SimpleButton>
          {watch && watch.image && (
            <SimpleButton
              onClick={performAiAnalysis}
              variant="contained"
              luxury="true"
              disabled={aiAnalysisLoading}
              startIcon={
                aiAnalysisLoading ? (
                  <CircularProgress size={18} sx={{ color: "#000000" }} />
                ) : watch.ai_analyzed ? (
                  <RefreshIcon />
                ) : (
                  <AiIcon />
                )
              }
            >
              {aiAnalysisLoading
                ? "Analyzing..."
                : watch.ai_analyzed
                ? "Re-analyze with Enhanced AI"
                : "Start Enhanced AI Analysis"}
            </SimpleButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnalyzeModel;
