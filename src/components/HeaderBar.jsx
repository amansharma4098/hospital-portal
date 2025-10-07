// src/components/HeaderBar.jsx
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function HeaderBar({
  logo,
  hospitalName,
  hospitalEmail,
  onRefreshCounts,
  onRefreshTickets,
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        boxShadow: 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.background.paper})`,
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <Stack
        direction={isSmall ? "column" : "row"}
        alignItems={isSmall ? "flex-start" : "center"}
        spacing={isSmall ? 2 : 3}
      >
        {/* Logo & identity */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={logo}
            variant="rounded"
            alt="Raksha logo"
            sx={{
              width: 90,
              height: 90,
              boxShadow: 2,
              border: `2px solid ${theme.palette.primary.main}`,
              bgcolor: "background.paper",
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {hospitalName || "Hospital Portal"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {hospitalEmail || "admin@hospital.com"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Action buttons */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Refresh dashboard counts">
            <IconButton
              color="primary"
              onClick={onRefreshCounts}
              sx={{
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
              }}
            >
              <SyncIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh recent tickets">
            <IconButton
              color="primary"
              onClick={onRefreshTickets}
              sx={{
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* Optional logout / profile button placeholder */}
          {/* <Tooltip title="Logout">
            <IconButton color="error">
              <LogoutIcon />
            </IconButton>
          </Tooltip> */}
        </Stack>
      </Stack>

      {/* Bottom accent line */}
      <Box
        sx={{
          mt: 2,
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      />
    </Box>
  );
}
