// src/components/EditTicketDialog.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";

function SmallInput({ label, name, value, setValue, type = "text", placeholder = "" }) {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
      margin="normal"
      size="small"
    />
  );
}

export default function EditTicketDialog({
  open,
  onClose,
  editDetails,
  setEditDetails,
  editCount,
  setEditCount,
  editPayloadText,
  setEditPayloadText,
  onSave,
  saving,
  error,
  selectedTicket,
}) {
  const [localError, setLocalError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const payloadRef = useRef(null);

  // Reset internal state when dialog opens/closes or selectedTicket changes
  useEffect(() => {
    if (open) {
      setLocalError("");
      setIsDirty(false);
    }
  }, [open, selectedTicket]);

  // Validate JSON payload
  function validatePayload(text) {
    if (!text || !text.trim()) return "";
    try {
      JSON.parse(text);
      return "";
    } catch (e) {
      return "Payload contains invalid JSON: " + e.message;
    }
  }

  useEffect(() => {
    // whenever payload text changes, validate and mark dirty
    setLocalError(validatePayload(editPayloadText));
    // don't mark dirty on initial mount of dialog (handled above)
    // but mark dirty when user actually types
    // (we approximate with isDirty toggled elsewhere)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPayloadText]);

  // helpers
  const handleFormatJson = () => {
    const txt = editPayloadText;
    if (!txt || !txt.trim()) return;
    try {
      const obj = JSON.parse(txt);
      const pretty = JSON.stringify(obj, null, 2);
      setEditPayloadText(pretty);
      setLocalError("");
      setIsDirty(true);
      // focus payload editor
      setTimeout(() => payloadRef.current?.focus?.(), 80);
    } catch (e) {
      setLocalError("Cannot format: invalid JSON");
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(editPayloadText || "");
      // small visual feedback would be nice; but keep it simple
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      const ok = window.confirm("You have unsaved changes. Close without saving?");
      if (!ok) return;
    }
    onClose();
  };

  const handleSave = async () => {
    // local validation before calling parent's onSave
    const v = validatePayload(editPayloadText);
    if (v) {
      setLocalError(v);
      return;
    }
    try {
      await onSave();
      setIsDirty(false);
    } catch (e) {
      // parent handles errors; keep local UI updated
      console.error(e);
    }
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleCloseAttempt}
      maxWidth="md"
      fullWidth
      aria-labelledby="edit-ticket-dialog-title"
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}
        id="edit-ticket-dialog-title"
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Edit Ticket {selectedTicket ? `#${selectedTicket.id}` : ""}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Update description, count or payload for this ticket
          </Typography>
        </Box>

        <IconButton size="small" onClick={handleCloseAttempt} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Description"
            value={editDetails}
            onChange={(e) => {
              setEditDetails(e.target.value);
              setIsDirty(true);
            }}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            placeholder="Short description / details"
          />

          <SmallInput
            label="Count"
            name="edit_count"
            type="number"
            value={editCount}
            setValue={(v) => {
              setEditCount(v);
              setIsDirty(true);
            }}
            placeholder="Number requested"
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Payload (JSON)
            </Typography>

            <Box>
              <Tooltip title="Format JSON" arrow>
                <Button
                  size="small"
                  startIcon={<FormatAlignLeftIcon />}
                  onClick={handleFormatJson}
                  sx={{ textTransform: "none", mr: 1 }}
                >
                  Format
                </Button>
              </Tooltip>

              <Tooltip title="Copy payload to clipboard" arrow>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyPayload}
                  sx={{ textTransform: "none" }}
                >
                  Copy
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <TextField
            inputRef={payloadRef}
            value={editPayloadText}
            onChange={(e) => {
              setEditPayloadText(e.target.value);
              setIsDirty(true);
            }}
            fullWidth
            multiline
            rows={10}
            margin="normal"
            inputProps={{ style: { fontFamily: "monospace", fontSize: 13 } }}
            placeholder='e.g. {"shift":"night","experience":"2 years"}'
          />

          {(localError || error) && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {localError || error}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={handleCloseAttempt} variant="text" disabled={saving}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || Boolean(localError)}
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
