// src/components/HeaderBar.jsx
import React from "react";
import { Avatar, Box, Button, Stack, Typography, useTheme } from "@mui/material";

export default function HeaderBar({ logo, hospitalName, hospitalEmail, onRefreshCounts, onRefreshTickets }) {
  const theme = useTheme();

  return (
    <Box
      mb={4}
      sx={{
        borderRadius: 2,
        p: 3,
        background: `linear-gradient(90deg, ${theme.palette.primary.light}11, ${theme.palette.primary.main}05)`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={3}
        sx={{
          flexWrap: "wrap",
        }}
      >
        {/* ✅ Proper logo display */}
        <Box
          sx={{
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Raksha Logo"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* ✅ Hospital Info */}
        <Box sx={{ minWidth: 220 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {hospitalName || "Hospital Portal"}
          </Typography>

          {hospitalEmail && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {hospitalEmail}
            </Typography>
          )}

          <Box
            sx={{
              height: 2,
              width: "100%",
              mt: 1.5,
              borderRadius: 1,
              background:
                "linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)",
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button variant="outlined" onClick={onRefreshCounts}>
          Refresh Counts
        </Button>
        <Button
          sx={{
            ml: 1,
            bgcolor: `${theme.palette.primary.main}10`,
            "&:hover": { bgcolor: `${theme.palette.primary.main}20` },
          }}
          onClick={onRefreshTickets}
        >
          Refresh Tickets
        </Button>
      </Stack>
    </Box>
  );
}
