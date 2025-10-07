// src/components/OpenTicketsPanel.jsx
import React from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Tooltip,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d);
  }
}

export default function OpenTicketsPanel({ logo, tickets = [], loading = false, onRefresh, onSelect, onEdit, onCopy }) {
  const visible = Array.isArray(tickets) ? tickets.slice(0, 6) : [];

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Avatar src={logo} variant="square" sx={{ width: 56, height: 28 }} />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Open Tickets
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? "Refreshing…" : `${tickets?.length ?? 0} total`}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Refresh list">
          <IconButton size="small" onClick={onRefresh} aria-label="refresh open tickets">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Body */}
      <Box>
        {loading ? (
          // simple skeleton list while loading
          <List>
            {[1, 2, 3].map((i) => (
              <ListItem key={i} sx={{ py: 1 }}>
                <Box sx={{ width: "100%" }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" height={18} />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : !visible.length ? (
          <Box sx={{ py: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No open tickets
            </Typography>
            <Button size="small" sx={{ mt: 1 }} onClick={onRefresh}>
              Reload
            </Button>
          </Box>
        ) : (
          <List dense>
            {visible.map((t) => {
              const title = `${t.type || t.request_type || "REQ"} — #${t.id}`;
              const subtitle = t.count ? `Count: ${t.count}` : t.description || t.details || "No details";
              const date = t.created_at || t.createdAt || t.time || t.timestamp;
              const status = (t.status || t.state || "").toString().toLowerCase();

              return (
                <ListItem
                  key={t.id}
                  disableGutters
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "transform 160ms, box-shadow 160ms",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                  onClick={() => onSelect && onSelect(t)}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {title}
                      </Typography>

                      {status && (
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            ml: 1,
                          }}
                          color={status === "open" ? "primary" : status === "closed" ? "default" : "warning"}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {subtitle}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      {formatDate(date)}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ml: 1 }}>
                    <Tooltip title="Edit ticket" arrow>
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

                    <Tooltip title="Copy payload" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCopy && onCopy(t.payload || t);
                        }}
                        aria-label={`copy-${t.id}`}
                      >
                        <CopyAllIcon fontSize="small" />
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
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Showing {visible.length} of {tickets?.length ?? 0}
        </Typography>

        <Button
          size="small"
          endIcon={<OpenInNewIcon />}
          onClick={() => {
            // keep existing behavior: selecting nothing could be used to open a full list route
            // we call onRefresh and rely on parent to navigate if needed
            if (onRefresh) onRefresh();
          }}
        >
          View all
        </Button>
      </Box>
    </Paper>
  );
}
