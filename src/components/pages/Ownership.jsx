import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Enable plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const Ownership = ({
  watchData,
  formatTimestamp,
  formatFullAddress,
  formatDatabaseTimestamp,
}) => {
  // CRITICAL FIX: Enhanced function to extract distributor timestamp from shipping trail
  const getDistributorTimestamp = () => {
    if (!watchData.shippingTrail || watchData.shippingTrail.length === 0) {
      return null;
    }

    // Look for "SHIPPED" status in shipping trail (first shipping event)
    const shippedEntry = watchData.shippingTrail.find(
      (entry) => entry && entry.includes("SHIPPED")
    );

    if (shippedEntry) {
      console.log("Found SHIPPED entry:", shippedEntry);

      // ENHANCED FORMAT: Handle multiple timestamp formats
      // New format: "SHIPPED at location on 8/26/2025, 10:29:42 PM (ISO: 2025-08-26T22:29:42.123Z)"
      // Old format: "SHIPPED at location on 8/26/2025, 10:29:42 PM"

      // First try to extract ISO timestamp (most reliable)
      const isoMatch = shippedEntry.match(/\(ISO:\s*([^)]+)\)/);
      if (isoMatch) {
        const isoTimestamp = isoMatch[1].trim();
        console.log("Found ISO timestamp in distributor entry:", isoTimestamp);
        return isoTimestamp;
      }

      // Fallback to locale string extraction
      const match = shippedEntry.match(
        /^SHIPPED\s+at\s+.*?\s+on\s+(.+?)(?:\s+\(ISO:|$)/
      );
      if (match) {
        const timestampStr = match[1].trim();
        console.log("Extracted distributor timestamp string:", timestampStr);
        return timestampStr;
      }
    }

    return null;
  };

  // CRITICAL FIX: Universal timestamp formatter with comprehensive format support
  const formatOwnershipTimestamp = (
    timestamp,
    timestampType = "auto",
    contextRole = ""
  ) => {
    if (
      !timestamp ||
      timestamp === "0" ||
      timestamp === null ||
      timestamp === undefined ||
      timestamp === ""
    ) {
      return {
        date: "Unknown Date",
        time: "Unknown Time",
      };
    }

    try {
      let date;

      console.log("Formatting timestamp:", {
        timestamp,
        type: timestampType,
        role: contextRole,
        typeOf: typeof timestamp,
      });

      // Auto-detect timestamp type if not specified
      if (timestampType === "auto") {
        const timestampStr = timestamp.toString().trim();

        // Check for Unix timestamp (numeric only, reasonable range)
        const timestampNum = parseInt(timestampStr);
        if (
          !isNaN(timestampNum) &&
          timestampNum.toString() === timestampStr &&
          timestampNum > 1000000000 && // After 2001
          timestampNum < 9999999999 // Before 2286
        ) {
          timestampType = "unix";
        }
        // Check for ISO format (contains T and Z or +/-)
        else if (
          timestampStr.includes("T") &&
          (timestampStr.includes("Z") ||
            timestampStr.includes("+") ||
            timestampStr.match(/-\d{2}:\d{2}$/))
        ) {
          timestampType = "iso";
        }
        // Check for database timestamp format (YYYY-MM-DD HH:mm:ss)
        else if (timestampStr.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/)) {
          timestampType = "database";
        }
        // Default to locale format
        else {
          timestampType = "locale";
        }

        console.log("Auto-detected timestamp type:", timestampType);
      }

      // Parse based on detected/specified type
      switch (timestampType) {
        case "unix":
          // For Unix timestamps (assembler)
          const timestampMs =
            timestamp.toString().length === 10
              ? parseInt(timestamp) * 1000
              : parseInt(timestamp);
          date = dayjs(timestampMs);
          console.log(
            "Unix timestamp parsed:",
            date.isValid() ? date.format() : "invalid"
          );
          break;

        case "iso":
          // For ISO timestamps (retailer, consumer, transfers)
          date = dayjs(timestamp);
          console.log(
            "ISO timestamp parsed:",
            date.isValid() ? date.format() : "invalid"
          );
          break;

        case "database":
          // For database timestamp format (YYYY-MM-DD HH:mm:ss.sss)
          date = dayjs(timestamp);
          console.log(
            "Database timestamp parsed:",
            date.isValid() ? date.format() : "invalid"
          );
          break;

        case "locale":
          // For locale string timestamps (distributor from shipping trail)
          // Enhanced format support with multiple patterns
          const formats = [
            // US formats
            "M/D/YYYY, h:mm:ss A", // 8/26/2025, 10:29:42 PM
            "MM/DD/YYYY, h:mm:ss A", // 08/26/2025, 10:29:42 PM
            "M/D/YYYY, h:mm A", // 8/26/2025, 10:29 PM
            "MM/DD/YYYY, h:mm A", // 08/26/2025, 10:29 PM
            "M/D/YYYY h:mm:ss A", // Without comma
            "MM/DD/YYYY h:mm:ss A",

            // European formats
            "D/M/YYYY, h:mm:ss A", // 26/8/2025, 10:29:42 PM
            "DD/MM/YYYY, h:mm:ss A", // 26/08/2025, 10:29:42 PM
            "D/M/YYYY, h:mm A",
            "DD/MM/YYYY, h:mm A",
            "D/M/YYYY h:mm:ss A",
            "DD/MM/YYYY h:mm:ss A",

            // ISO-like formats
            "YYYY-MM-DD HH:mm:ss", // Database format
            "YYYY-MM-DDTHH:mm:ss.SSSZ", // ISO with milliseconds
            "YYYY-MM-DDTHH:mm:ssZ", // ISO without milliseconds
            "YYYY-MM-DDTHH:mm:ss", // ISO without timezone
          ];

          // Try strict parsing with each format
          for (const format of formats) {
            date = dayjs(timestamp, format, true); // strict mode
            if (date.isValid()) {
              console.log("Locale timestamp parsed with format:", format);
              break;
            }
          }

          // If strict parsing failed, try flexible parsing
          if (!date || !date.isValid()) {
            date = dayjs(timestamp);
            console.log(
              "Locale timestamp flexible parsing result:",
              date.isValid() ? date.format() : "invalid"
            );
          }
          break;

        default:
          // Fallback to dayjs default parsing
          date = dayjs(timestamp);
          console.log(
            "Default timestamp parsing:",
            date.isValid() ? date.format() : "invalid"
          );
      }

      // Final validation and formatting
      if (date && date.isValid()) {
        const result = {
          date: date.format("DD/MM/YYYY"),
          time: date.format("h:mm A"),
          fullDate: date.format("DD/MM/YYYY h:mm A"),
          iso: date.toISOString(),
        };
        console.log(`Final formatted result for ${contextRole}:`, result);
        return result;
      } else {
        console.warn(
          "All parsing failed for timestamp:",
          timestamp,
          "role:",
          contextRole
        );
        return {
          date: "Parse Error",
          time: "Parse Error",
          fullDate: "Parse Error",
          iso: null,
        };
      }
    } catch (error) {
      console.error(
        "Error formatting ownership timestamp:",
        error,
        "timestamp:",
        timestamp,
        "role:",
        contextRole
      );
      return {
        date: "Error",
        time: "Error",
        fullDate: "Error",
        iso: null,
      };
    }
  };

  // SIMPLIFIED: Determine the role based on position in ownership history
  const getRoleForAddress = (address, index) => {
    console.log("Analyzing role for address:", address, "at index:", index);

    // Simple role assignment based on position
    switch (index) {
      case 0:
        return { role: "Assembler", icon: BusinessIcon, color: "primary" };
      case 1:
        return { role: "Distributor", icon: LocalShippingIcon, color: "info" };
      case 2:
        return { role: "Retailer", icon: StorefrontIcon, color: "success" };
      default:
        // Consumer numbering starts from 1
        const consumerNumber = index - 2;
        return {
          role: `Consumer ${consumerNumber}`,
          icon: PersonIcon,
          color: "secondary",
        };
    }
  };

  // ENHANCED: Check if datetime should be hidden for this role
  const shouldHideDatetime = (roleInfo) => {
    if (roleInfo.role.startsWith("Consumer")) {
      const consumerNumber = parseInt(roleInfo.role.split(" ")[1]);
      return consumerNumber >= 2; // Hide datetime for Consumer 2 and onwards
    }
    return false; // Show datetime for all other roles
  };

  // SIMPLIFIED: Get ownership timeline with straightforward role assignment
  const getOwnershipTimeline = () => {
    if (
      !watchData.ownershipHistory ||
      watchData.ownershipHistory.length === 0
    ) {
      return [];
    }

    return watchData.ownershipHistory
      .filter((owner) => owner !== null && owner !== undefined)
      .map((address, index) => {
        const roleInfo = getRoleForAddress(address, index);

        console.log("Processing owner:", {
          address,
          index,
          role: roleInfo.role,
        });

        // Get timestamp based on role
        let displayDate = "Unknown Date";
        let displayTime = "Unknown Time";
        let fullDate = "Unknown Date & Time";

        if (roleInfo.role === "Assembler") {
          // Use assembler timestamp (Unix format)
          if (watchData.timestamp) {
            console.log("Processing Assembler timestamp:", watchData.timestamp);
            const formatted = formatOwnershipTimestamp(
              watchData.timestamp,
              "unix",
              "Assembler"
            );
            displayDate = formatted.date;
            displayTime = formatted.time;
            fullDate = formatted.fullDate;
          }
        } else if (roleInfo.role === "Distributor") {
          // Extract timestamp from shipping trail (locale or ISO format)
          const distributorTimestamp = getDistributorTimestamp();
          if (distributorTimestamp) {
            console.log(
              "Processing Distributor timestamp:",
              distributorTimestamp
            );
            const formatted = formatOwnershipTimestamp(
              distributorTimestamp,
              "auto", // Auto-detect format
              "Distributor"
            );
            displayDate = formatted.date;
            displayTime = formatted.time;
            fullDate = formatted.fullDate;
          }
        } else if (roleInfo.role === "Retailer") {
          // Use retailer timestamp (ISO format from database)
          if (watchData.retailerTimestamp) {
            console.log(
              "Processing Retailer timestamp:",
              watchData.retailerTimestamp
            );
            const formatted = formatOwnershipTimestamp(
              watchData.retailerTimestamp,
              "auto", // Auto-detect format (likely ISO or database)
              "Retailer"
            );
            displayDate = formatted.date;
            displayTime = formatted.time;
            fullDate = formatted.fullDate;
          }
        } else if (roleInfo.role.startsWith("Consumer")) {
          // Use consumer timestamp (ISO format from database)
          if (watchData.consumerTimestamp) {
            console.log(
              "Processing Consumer timestamp:",
              watchData.consumerTimestamp
            );
            const formatted = formatOwnershipTimestamp(
              watchData.consumerTimestamp,
              "auto", // Auto-detect format (likely ISO or database)
              "Consumer"
            );
            displayDate = formatted.date;
            displayTime = formatted.time;
            fullDate = formatted.fullDate;
          }
        }

        // FALLBACK: If no timestamp found for this role, use current time
        if (displayDate === "Unknown Date" && displayTime === "Unknown Time") {
          console.warn(
            `No timestamp found for ${roleInfo.role} at index ${index}`
          );

          const fallbackFormatted = formatOwnershipTimestamp(
            new Date().toISOString(),
            "iso",
            `${roleInfo.role}_fallback`
          );
          displayDate = fallbackFormatted.date;
          displayTime = fallbackFormatted.time;
          fullDate = fallbackFormatted.fullDate;
          console.log(
            `Using fallback timestamp for ${roleInfo.role}:`,
            fullDate
          );
        }

        console.log("Final timestamp result:", {
          role: roleInfo.role,
          displayDate,
          displayTime,
          fullDate,
        });

        return {
          address,
          roleInfo,
          displayDate,
          displayTime,
          fullDate,
          hideDatetime: shouldHideDatetime(roleInfo), // Add flag for datetime visibility
        };
      });
  };

  const ownershipTimeline = getOwnershipTimeline();

  console.log("Generated simplified ownership timeline:", ownershipTimeline);

  if (!watchData.ownershipHistory || watchData.ownershipHistory.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "primary.main",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AccountCircleIcon sx={{ mr: 1 }} />
          Ownership History
          <Chip
            label={`${ownershipTimeline.length} Owners`}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
            variant="outlined"
          />
        </Typography>

        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.3,
            },
          }}
        >
          {ownershipTimeline.map((owner, index) => {
            const IconComponent = owner.roleInfo.icon;

            return (
              <TimelineItem key={`${owner.address}-${index}`}>
                <TimelineOppositeContent
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {/* Enhanced datetime display logic */}
                  {!owner.hideDatetime ? (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          lineHeight: 1.2,
                        }}
                      >
                        {owner.displayDate}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        {owner.displayTime}
                      </Typography>

                      {/* Show warning for invalid timestamps */}
                      {(owner.displayDate.includes("Error") ||
                        owner.displayDate.includes("Unknown")) && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "error.main",
                            display: "block",
                            mt: 0.5,
                            fontSize: "0.7rem",
                          }}
                        >
                          ⚠ Timestamp Issue
                        </Typography>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot
                    color={owner.roleInfo.color}
                    sx={{
                      width: 56,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      border: "2px solid currentColor",
                    }}
                  >
                    <IconComponent sx={{ fontSize: "1.5rem" }} />
                  </TimelineDot>
                  {index < ownershipTimeline.length - 1 && (
                    <TimelineConnector
                      sx={{
                        backgroundColor: "primary.main",
                        width: 3,
                        boxShadow: "0 0 6px rgba(63, 81, 181, 0.3)",
                      }}
                    />
                  )}
                </TimelineSeparator>

                <TimelineContent>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        {owner.roleInfo.role}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        wordBreak: "break-all",
                        color: "text.secondary",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        p: 1,
                        borderRadius: 1,
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        mb: 1,
                      }}
                    >
                      {formatFullAddress(owner.address)}
                    </Typography>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>

        {/* Transfer Information (if applicable) */}
        {watchData.lastTransferTimestamp && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "rgba(255, 152, 0, 0.05)",
              borderRadius: 1,
              border: "1px solid rgba(255, 152, 0, 0.2)",
            }}
          >
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Transfer Information
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last Transfer:{" "}
              {
                formatOwnershipTimestamp(
                  watchData.lastTransferTimestamp,
                  "auto",
                  "LastTransfer"
                ).fullDate
              }
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Ownership;
