// src/components/TicketDetailsCard.jsx
import React from "react";
import { Box, Button, Card, CardContent, Chip, Divider, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CopyAllIcon from "@mui/icons-material/CopyAll";

export default function TicketDetailsCard({ ticket, onClose, onCloseTicket, onEdit, onCopy }) {
  if (!ticket) return null;

  const payloadExists = ticket.payload && Object.keys(ticket.payload || {}).length > 0;
  const description = ticket.description || ticket.details || "";

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{ticket.type || ticket.request_type || `Ticket #${ticket.id}`}</Typography>
            <Chip label={ticket.type || ticket.request_type || "GENERAL"} size="small" />
            <Chip label={ticket.status ? ticket.status.toUpperCase() : "OPEN"} size="small" sx={{ ml: 1 }} color={ticket.status === "closed" ? "default" : "primary"} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            #{ticket.id} • {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ""}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" onClick={() => onEdit(ticket)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => onCopy(ticket.payload)}><CopyAllIcon fontSize="small" /></IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Description</Typography>

        {description && String(description).trim().length ? (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>{description}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 2 }}>No description provided.</Typography>
        )}

        {ticket.count !== undefined && ticket.count !== null && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Count</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{ticket.count}</Typography>
          </Box>
        )}

        {payloadExists && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Payload</Typography>
            <Box sx={{ bgcolor: "#fafafa", p: 1, borderRadius: 1, mb: 1 }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(ticket.payload, null, 2)}</pre>
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button size="small" onClick={onClose}>Close</Button>
          <Button size="small" color="error" onClick={() => onCloseTicket(ticket)}>Close Ticket</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
