// src/components/RecentTicketsList.jsx
import React from "react";
import {
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Skeleton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function formatDateTime(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

export default function RecentTicketsList({ tickets = [], loading = false, onEdit, onClose, onSelect }) {
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ py: 1 }}>
          <LinearProgress />
        </Box>
        <Box sx={{ mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
              <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="40%" />
                <Skeleton width="70%" />
              </Box>
              <Skeleton width={120} />
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          Loading tickets...
        </Typography>
      </Paper>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
        <Typography color="text.secondary">No tickets yet</Typography>
        <Button size="small" sx={{ mt: 1 }} onClick={() => onSelect && onSelect(null)}>
          Create first ticket
        </Button>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 0 }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Recent Tickets
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {tickets.length} total
        </Typography>
      </Box>

      <Divider />

      <List dense>
        {tickets.map((t) => {
          const title = `${t.type || t.request_type || "REQ"} — #${t.id}`;
          const parts = [];
          if (t.count) parts.push(`Count: ${t.count}`);
          if (t.description || t.details) parts.push(t.description || t.details);
          const subtitle = parts.join(" • ") || "No details";
          const ts = t.created_at || t.createdAt || t.time || t.timestamp;

          const status = (t.status || t.state || "").toString().toLowerCase();

          return (
            <ListItem
              key={t.id}
              disableGutters
              button
              onClick={() => onSelect && onSelect(t)}
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: 1,
                mx: 2,
                my: 1,
                transition: "transform 140ms ease, box-shadow 140ms ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                alignItems: "flex-start",
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                    {!!status && (
                      <Chip
                        label={status}
                        size="small"
                        sx={{ textTransform: "capitalize", ml: 0.5 }}
                        color={status === "open" ? "primary" : status === "closed" ? "default" : "warning"}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {subtitle}
                  </Typography>
                }
              />

              <Box sx={{ ml: 1, textAlign: "right", display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  {formatDateTime(ts)}
                </Typography>

                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit(t);
                      }}
                      aria-label={`edit-${t.id}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Close ticket" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose && onClose(t);
                      }}
                      aria-label={`close-${t.id}`}
                    >
                      <DoneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Open details" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect && onSelect(t);
                      }}
                      aria-label={`open-${t.id}`}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
