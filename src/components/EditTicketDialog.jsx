// src/components/EditTicketDialog.jsx
import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function SmallInput({ label, name, value, setValue, type = "text", placeholder = "" }) {
  return (
    <TextField label={label} name={name} type={type} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} fullWidth margin="normal" size="small" />
  );
}

export default function EditTicketDialog({ open, onClose, editDetails, setEditDetails, editCount, setEditCount, editPayloadText, setEditPayloadText, onSave, saving, error, selectedTicket }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Edit Ticket {selectedTicket ? `#${selectedTicket.id}` : ""}</span>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField label="Description" value={editDetails} onChange={(e) => setEditDetails(e.target.value)} fullWidth multiline rows={3} margin="normal" />
          <SmallInput label="Count" name="edit_count" type="number" value={editCount} setValue={(v) => setEditCount(v)} placeholder="Number requested" />
          <Typography variant="body2" sx={{ mb: 1 }}>Payload (JSON)</Typography>
          <TextField value={editPayloadText} onChange={(e) => setEditPayloadText(e.target.value)} fullWidth multiline rows={10} margin="normal" inputProps={{ style: { fontFamily: "monospace", fontSize: 13 } }} />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
