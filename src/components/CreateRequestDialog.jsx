// src/components/CreateRequestDialog.jsx
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
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Campaign";
import CircularProgress from "@mui/material/CircularProgress";

function SmallInput({ label, name, value, setValue, type = "text", placeholder = "", startAdornment = null, autoFocus = false }) {
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
      InputProps={
        startAdornment
          ? {
              startAdornment: <InputAdornment position="start">{startAdornment}</InputAdornment>,
            }
          : undefined
      }
      autoFocus={autoFocus}
    />
  );
}

export default function CreateRequestDialog({
  open,
  onClose,
  payloadFields,
  setPayloadFields,
  onCreate,
  creating,
  msg,
  openModal,
}) {
  const countRef = useRef(null);
  const [localError, setLocalError] = useState("");
  const [touched, setTouched] = useState(false);

  // Autofocus the count field when dialog opens
  useEffect(() => {
    if (open && countRef.current) {
      // small timeout ensures dialog is mounted
      setTimeout(() => countRef.current?.focus?.(), 80);
    } else {
      setTouched(false);
      setLocalError("");
    }
  }, [open]);

  // Validation: if count provided, must be positive integer
  function validate() {
    const c = payloadFields.count === undefined || payloadFields.count === null || payloadFields.count === "" ? null : Number(payloadFields.count);
    if (c !== null && (!Number.isFinite(c) || Number.isNaN(c) || c <= 0 || !Number.isInteger(c))) {
      return "Count must be a positive whole number.";
    }
    if (payloadFields.offered_salary && String(payloadFields.offered_salary).length > 100) {
      return "Offered salary text is too long.";
    }
    return "";
  }

  useEffect(() => {
    if (touched) setLocalError(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadFields, touched]);

  const titleText =
    openModal === "pros" ? "Request Public Relations Officers" : openModal === "staff" ? "Request Staff" : openModal === "doctor" ? "Request Doctor" : "Create Request";

  const Subtitle = () => {
    if (openModal === "pros") return "Need communications / PR resources";
    if (openModal === "staff") return "Request permanent or temporary staff";
    if (openModal === "doctor") return "Request visiting or full-time doctors";
    return "Create a new request";
  };

  const HeaderIcon = () => {
    if (openModal === "pros") return <CampaignIcon fontSize="small" />;
    if (openModal === "staff") return <GroupsIcon fontSize="small" />;
    if (openModal === "doctor") return <PersonIcon fontSize="small" />;
    return <GroupsIcon fontSize="small" />;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setTouched(true);
    const v = validate();
    if (v) {
      setLocalError(v);
      return;
    }
    // call parent's onCreate (which already expects event or not)
    try {
      await onCreate(e);
    } catch (err) {
      // parent handles errors; keep UI responsive
      console.error(err);
    }
  };

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="create-request-title">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 1 }}>
              <HeaderIcon />
            </Box>
            <Box>
              <Typography id="create-request-title" variant="subtitle1" sx={{ fontWeight: 700 }}>
                {titleText}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <Subtitle />
              </Typography>
            </Box>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose} aria-label="close dialog">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <SmallInput
            label="Count"
            name="count"
            type="number"
            value={payloadFields.count}
            setValue={(v) => setPayloadFields((p) => ({ ...p, count: v }))}
            placeholder="Number of persons / doctors"
            startAdornment="#"
            autoFocus
          />
          {/* keep a ref to first input for programmatic focus if needed */}
          <TextField
            inputRef={countRef}
            sx={{ display: "none" }}
            aria-hidden
          />

          <SmallInput
            label="Location"
            name="location"
            value={payloadFields.location}
            setValue={(v) => setPayloadFields((p) => ({ ...p, location: v }))}
            placeholder="City / area"
          />
          <SmallInput
            label="Offered Salary (optional)"
            name="offered_salary"
            value={payloadFields.offered_salary}
            setValue={(v) => setPayloadFields((p) => ({ ...p, offered_salary: v }))}
            placeholder="e.g. 15000/month"
          />

          <TextField
            label="Notes"
            name="notes"
            value={payloadFields.notes}
            onChange={(e) => setPayloadFields((p) => ({ ...p, notes: e.target.value }))}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            size="small"
            placeholder="Any additional context for the request (responsibilities, shift, start date...)"
            inputProps={{ maxLength: 1000 }}
            helperText={`${payloadFields.notes ? payloadFields.notes.length : 0}/1000`}
          />

          {/* show validation or server message */}
          {(localError || msg) && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {localError || msg}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={onClose} variant="text" disabled={creating}>
              Cancel
            </Button>

            <Tooltip title={localError ? localError : ""} arrow>
              <span>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={creating || Boolean(validate())}
                  startIcon={creating ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {creating ? "Creating..." : "Create Request"}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
