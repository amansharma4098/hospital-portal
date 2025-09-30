// src/components/HeaderBar.jsx
import React from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";

export default function HeaderBar({ logo, hospitalName, hospitalEmail, onRefreshCounts, onRefreshTickets }) {
  return (
    <Box mb={4}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3, borderRadius: 2 }}>
        <Avatar src={logo} variant="square" sx={{ width: 84, height: 36 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {hospitalName || "Hospital"}
          </Typography>
          {hospitalEmail && <Typography variant="body2" color="text.secondary">{hospitalEmail}</Typography>}
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={onRefreshCounts}>Refresh Counts</Button>
        <Button sx={{ ml: 1 }} onClick={onRefreshTickets}>Refresh Tickets</Button>
      </Stack>
    </Box>
  );
}
