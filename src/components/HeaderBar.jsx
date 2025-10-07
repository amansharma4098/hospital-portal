// src/components/HeaderBar.jsx
import React from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";

export default function HeaderBar({ logo, hospitalName, hospitalEmail, onRefreshCounts, onRefreshTickets }) {
  return (
    <Box mb={4}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "transparent",
        }}
      >
        {/* Make logo bigger */}
        <Avatar src={logo} variant="square" sx={{ width: 120, height: 50 }} />

        <Box>
          {/* Use hospitalName instead of plain "Hospital" */}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {hospitalName ? hospitalName : "Hospital Portal"}
          </Typography>

          {hospitalEmail && (
            <Typography variant="body2" color="text.secondary">
              {hospitalEmail}
            </Typography>
          )}
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button variant="outlined" onClick={onRefreshCounts}>
          Refresh Counts
        </Button>
        <Button sx={{ ml: 1 }} onClick={onRefreshTickets}>
          Refresh Tickets
        </Button>
      </Stack>
    </Box>
  );
}
