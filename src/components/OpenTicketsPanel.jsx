// src/components/OpenTicketsPanel.jsx
import React from "react";
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemText, Paper, Typography, Tooltip } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import EditIcon from "@mui/icons-material/Edit";

export default function OpenTicketsPanel({ logo, tickets, loading, onRefresh, onSelect, onEdit, onCopy }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar src={logo} variant="square" sx={{ width: 56, height: 28, mr: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Open Tickets</Typography>
        <Box sx={{ flex: 1 }} />
        <Button size="small" onClick={onRefresh}>Refresh</Button>
      </Box>

      <Box sx={{ mt: 1 }}>
        {loading ? (
          <Typography variant="body2">Loading…</Typography>
        ) : tickets.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No open tickets</Typography>
        ) : (
          <List dense>
            {tickets.slice(0, 6).map((t) => (
              <ListItem key={t.id} button onClick={() => onSelect(t)} sx={{ borderRadius: 1, my: 0.5 }}>
                <ListItemText
                  primary={`${t.type || t.request_type} — #${t.id}`}
                  secondary={t.count ? `Count: ${t.count}` : t.description || t.details || "No details"}
                />
                <Typography variant="caption" color="text.secondary">{t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}
