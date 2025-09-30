// src/components/RecentTicketsList.jsx
import React from "react";
import { Box, LinearProgress, List, ListItem, ListItemText, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

export default function RecentTicketsList({ tickets, loading, onEdit, onClose, onSelect }) {
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ py: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>Loading tickets...</Typography>
        </Box>
      </Paper>
    );
  }

  if (!tickets || tickets.length === 0) {
    return <Typography color="text.secondary">No tickets yet</Typography>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <List dense>
        {tickets.map((t) => (
          <ListItem key={t.id} sx={{ borderRadius: 1, my: 0.5 }} secondaryAction={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Tooltip title="Edit">
                <IconButton edge="end" size="small" onClick={() => onEdit(t)}><EditIcon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton edge="end" size="small" onClick={() => onClose(t)}><DoneIcon fontSize="small" /></IconButton>
              </Tooltip>
            </Box>
          } button onClick={() => onSelect(t)}>
            <ListItemText
              primary={`${t.type || t.request_type} — #${t.id}`}
              secondary={<span>{t.count ? `Count: ${t.count}` : null}{t.count && (t.description || t.details) ? " • " : ""}{t.description || t.details || "No details"}</span>}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, minWidth: 130, textAlign: "right" }}>
              {t.created_at ? new Date(t.created_at).toLocaleString() : ""}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
