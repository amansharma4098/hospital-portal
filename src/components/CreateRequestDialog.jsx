// src/components/CreateRequestDialog.jsx
import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function SmallInput({ label, name, value, setValue, type = "text", placeholder = "" }) {
  return (
    <TextField label={label} name={name} type={type} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} fullWidth margin="normal" size="small" />
  );
}

export default function CreateRequestDialog({ open, onClose, payloadFields, setPayloadFields, onCreate, creating, msg, openModal }) {
  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>
          {openModal === "pros" ? "Request Public Relations Officers" : openModal === "staff" ? "Request Staff" : openModal === "doctor" ? "Request Doctor" : "Create Request"}
        </span>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={onCreate}>
          <SmallInput label="Count" name="count" type="number" value={payloadFields.count} setValue={(v) => setPayloadFields((p) => ({ ...p, count: v }))} placeholder="Number of persons / doctors" />
          <SmallInput label="Location" name="location" value={payloadFields.location} setValue={(v) => setPayloadFields((p) => ({ ...p, location: v }))} placeholder="City / area" />
          <SmallInput label="Offered Salary (optional)" name="offered_salary" value={payloadFields.offered_salary} setValue={(v) => setPayloadFields((p) => ({ ...p, offered_salary: v }))} placeholder="e.g. 15000/month" />
          <TextField label="Notes" name="notes" value={payloadFields.notes} onChange={(e) => setPayloadFields((p) => ({ ...p, notes: e.target.value }))} fullWidth multiline rows={4} margin="normal" size="small" />

          {msg && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{msg}</Typography>}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={creating}>{creating ? "Creating..." : "Create Request"}</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
