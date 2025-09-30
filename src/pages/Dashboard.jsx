// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import API_BASE_URL from "../config";
import logo from "../assets/logo.png";

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

function normalizeFrontType(openModal) {
  if (!openModal) return "OTHER";
  const s = String(openModal).toLowerCase();
  if (s === "pros" || s === "pro") return "PRO";
  if (s === "staff") return "STAFF";
  if (s === "doctor") return "DOCTOR";
  return openModal.toUpperCase();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  const hospitalId = localStorage.getItem("hospitalId");
  const hospitalName = localStorage.getItem("hospitalName");
  const hospitalEmail = localStorage.getItem("hospitalEmail");
  const token = localStorage.getItem("hospitalToken");

  const [counts, setCounts] = useState({ staff_count: 0, doctor_count: 0, pro_count: 0, request_count: 0 });
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openModal, setOpenModal] = useState(null); // for create
  const [payloadFields, setPayloadFields] = useState({ count: "", location: "", offered_salary: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editDetails, setEditDetails] = useState("");
  const [editCount, setEditCount] = useState("");
  const [editPayloadText, setEditPayloadText] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!token) {
      console.warn("No hospital token found, redirecting to login");
      navigate("/login", { replace: true });
    } else {
      fetchDashboardCounts();
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDashboardCounts() {
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/dashboard`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const d = await res.json();
        setCounts(d);
      } else {
        console.warn("Failed to fetch dashboard counts:", res.status);
      }
    } catch (err) {
      console.error("fetchDashboardCounts error:", err);
    }
  }

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const d = await res.json();
        setTickets(Array.isArray(d) ? d : []);
      } else {
        setTickets([]);
      }
    } catch (err) {
      setTickets([]);
      console.error("fetchTickets error:", err);
    } finally {
      setLoadingTickets(false);
    }
  }

  function openCardModal(type) {
    setPayloadFields({ count: "", location: "", offered_salary: "", notes: "" });
    setOpenModal(type);
    setMsg("");
  }

  const createTicket = async (e) => {
    e.preventDefault();
    if (!openModal) return;

    // map to normalized type (server will also normalize)
    const type = normalizeFrontType(openModal);

    // prefer explicit count + description fields (no payload wrapper)
    const count = payloadFields.count ? Number(payloadFields.count) : undefined;
    // build a short description from location/offered_salary/notes
    const descriptionPieces = [];
    if (payloadFields.location) descriptionPieces.push(`Location: ${payloadFields.location}`);
    if (payloadFields.offered_salary) descriptionPieces.push(`Offered salary: ${payloadFields.offered_salary}`);
    if (payloadFields.notes) descriptionPieces.push(`${payloadFields.notes}`);
    const description = descriptionPieces.join(" | ") || undefined;

    const body = { type, count, description };

    try {
      setCreating(true);
      setMsg("");
      const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg("Request created successfully!");
        setOpenModal(null);
        await fetchTickets();
        await fetchDashboardCounts();
      } else {
        // show backend validation messages
        if (data?.detail) {
          if (Array.isArray(data.detail)) setMsg(data.detail.map(d => d.msg || JSON.stringify(d)).join(" • "));
          else setMsg(data.detail || `Failed (${res.status})`);
        } else {
          setMsg(data.error || `Failed to create request (${res.status})`);
        }
      }
    } catch (err) {
      console.error("createTicket error:", err);
      setMsg("Server error");
    } finally {
      setCreating(false);
    }
  };

  // --- Edit ticket handlers (inline modal) ---
  function openEditModal(ticket) {
    setSelectedTicket(ticket);
    setEditDetails(ticket.description || ticket.details || "");
    setEditCount(ticket.count !== undefined && ticket.count !== null ? String(ticket.count) : "");
    setEditPayloadText(ticket.payload ? JSON.stringify(ticket.payload, null, 2) : "");
    setEditError("");
    setEditOpen(true);
  }

  async function handleSaveEdit() {
    if (!selectedTicket) return;
    setEditError("");
    let payloadObj = null;
    if (editPayloadText && editPayloadText.trim()) {
      try {
        payloadObj = JSON.parse(editPayloadText);
      } catch (e) {
        setEditError("Payload must be valid JSON.");
        return;
      }
    }
    const body = {
      details: editDetails,
      description: editDetails,
      payload: payloadObj,
      count: editCount ? Number(editCount) : null
    };
    setEditSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${selectedTicket.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Save failed (${res.status})`);
      }
      await fetchTickets();
      await fetchDashboardCounts();
      setEditOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error("handleSaveEdit error:", err);
      setEditError(err.message || "Save failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleCloseTicket(ticket) {
    if (!ticket) return;
    const ok = window.confirm(`Close ticket #${ticket.id}? This action cannot be undone.`);
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticket.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          status: "closed",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Close failed (${res.status})`);
      }
      await fetchTickets();
      await fetchDashboardCounts();
      setSelectedTicket(null);
    } catch (err) {
      console.error("handleCloseTicket error:", err);
      alert(err.message || "Failed to close ticket");
    }
  }

  const copyPayloadToClipboard = async (payload) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload || {}, null, 2));
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  // Helper to render count (hide zeroes)
  const renderCount = (n) => {
    if (n === null || n === undefined || Number(n) === 0) return "—";
    return n;
  };

  // brand accent color (use theme primary / accent)
  const accent = theme.palette.primary?.main || "#1976d2";
  const headerBg = `linear-gradient(90deg, ${accent}15, ${accent}06)`; // subtle gradient using alpha hex suffix not supported everywhere => using rgba fallback
  const headerBgFallback = `linear-gradient(90deg, rgba(25,118,210,0.06), rgba(25,118,210,0.02))`;

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 4,
            background:
              headerBgFallback,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={logo} variant="square" sx={{ width: 84, height: 36 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {hospitalName || `Hospital: ${hospitalName}`}
              </Typography>
              {hospitalEmail && <Typography variant="body2" color="text.secondary">{hospitalEmail}</Typography>}
            </Box>
            <Box sx={{ flex: 1 }} />
            <Button variant="outlined" onClick={fetchDashboardCounts}>
              Refresh Counts
            </Button>
            <Button sx={{ ml: 1 }} onClick={fetchTickets}>
              Refresh Tickets
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Cards: show titles but hide numeric zeros as '—' */}
              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() => openCardModal("pros")}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    "&:hover": { boxShadow: 6 },
                    borderLeft: `6px solid ${accent}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Public Relations Officers
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {renderCount(counts.pro_count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Request PR / Communications staff
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() => openCardModal("staff")}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    "&:hover": { boxShadow: 6 },
                    borderLeft: `6px solid ${accent}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Staff
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {renderCount(counts.staff_count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Request permanent/temporary staff
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() => openCardModal("doctor")}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    "&:hover": { boxShadow: 6 },
                    borderLeft: `6px solid ${accent}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Doctors
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {renderCount(counts.doctor_count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Request visiting or full-time doctors
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() => openCardModal("other")}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    "&:hover": { boxShadow: 6 },
                    borderLeft: `6px solid ${accent}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Other Requests
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {renderCount(counts.request_count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Procurement, onboarding and other requests
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Recent Tickets
              </Typography>

              <Paper variant="outlined" sx={{ p: 2 }}>
                {loadingTickets ? (
                  <Box sx={{ py: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading tickets...
                    </Typography>
                  </Box>
                ) : tickets.length === 0 ? (
                  <Typography color="text.secondary">No tickets yet</Typography>
                ) : (
                  <List dense>
                    {tickets.map((t) => (
                      <ListItem
                        key={t.id}
                        sx={{
                          borderRadius: 1,
                          my: 0.5,
                          bgcolor: t.status === "open" ? "background.paper" : "grey.50",
                          display: "flex",
                          alignItems: "center",
                        }}
                        secondaryAction={
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Tooltip title="Edit">
                              <IconButton edge="end" size="small" onClick={() => openEditModal(t)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Close">
                              <IconButton edge="end" size="small" onClick={() => handleCloseTicket(t)}>
                                <DoneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={`${t.type || t.request_type} — #${t.id}`}
                          secondary={
                            <span>
                              {t.count ? `Count: ${t.count}` : null}
                              {t.count && (t.description || t.details) ? " • " : ""}
                              {t.description || t.details || "No details"}
                            </span>
                          }
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, minWidth: 130, textAlign: "right" }}>
                          {t.created_at ? new Date(t.created_at).toLocaleString() : ""}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar src={logo} variant="square" sx={{ width: 56, height: 28, mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Open Tickets
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Button size="small" onClick={fetchTickets}>
                  Refresh
                </Button>
              </Box>

              <Box sx={{ mt: 1 }}>
                {loadingTickets ? (
                  <LinearProgress />
                ) : tickets.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No open tickets
                  </Typography>
                ) : (
                  <List dense>
                    {tickets.slice(0, 6).map((t) => (
                      <ListItem
                        key={t.id}
                        button
                        onClick={() => setSelectedTicket(t)}
                        sx={{ borderRadius: 1, my: 0.5 }}
                      >
                        <ListItemText
                          primary={`${t.type || t.request_type} — #${t.id}`}
                          secondary={
                            t.count
                              ? `Count: ${t.count}`
                              : t.description || t.details || "No details"
                          }
                        />
                        <Typography variant="caption" color="text.secondary">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {selectedTicket && (
                <Box sx={{ mt: 2 }}>
                  <Paper variant="outlined" sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Ticket #{selectedTicket.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTicket.type || selectedTicket.request_type} • {selectedTicket.status}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEditModal(selectedTicket)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy payload">
                          <IconButton size="small" onClick={() => copyPayloadToClipboard(selectedTicket.payload)}>
                            <CopyAllIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 1, bgcolor: "#fafafa", p: 1, borderRadius: 1 }}>
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>
                        {JSON.stringify(
                          selectedTicket.count ? { count: selectedTicket.count, description: selectedTicket.description || selectedTicket.details } : (selectedTicket.payload || selectedTicket.details || {}),
                          null,
                          2
                        )}
                      </pre>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button size="small" onClick={() => setSelectedTicket(null)}>
                        Close
                      </Button>
                      <Button size="small" color="error" onClick={() => handleCloseTicket(selectedTicket)}>
                        Close Ticket
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Create Request Dialog */}
      <Dialog open={Boolean(openModal)} onClose={() => setOpenModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>
            {openModal === "pros"
              ? "Request Public Relations Officers"
              : openModal === "staff"
              ? "Request Staff"
              : openModal === "doctor"
              ? "Request Doctor"
              : "Create Request"}
          </span>
          <IconButton size="small" onClick={() => setOpenModal(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box component="form" onSubmit={createTicket}>
            <SmallInput
              label="Count"
              name="count"
              type="number"
              value={payloadFields.count}
              setValue={(v) => setPayloadFields((p) => ({ ...p, count: v }))}
              placeholder="Number of persons / doctors"
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
            />

            {msg && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {msg}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              <Button onClick={() => setOpenModal(null)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={creating}>
                {creating ? "Creating..." : "Create Request"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog (inline editor) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Edit Ticket {selectedTicket ? `#${selectedTicket.id}` : ""}</span>
          <IconButton size="small" onClick={() => setEditOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Description"
              value={editDetails}
              onChange={(e) => setEditDetails(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />

            <SmallInput
              label="Count"
              name="edit_count"
              type="number"
              value={editCount}
              setValue={(v) => setEditCount(v)}
              placeholder="Number requested"
            />

            <Typography variant="body2" sx={{ mb: 1 }}>
              Payload (JSON)
            </Typography>
            <TextField
              value={editPayloadText}
              onChange={(e) => setEditPayloadText(e.target.value)}
              fullWidth
              multiline
              rows={10}
              margin="normal"
              inputProps={{ style: { fontFamily: "monospace", fontSize: 13 } }}
            />
            {editError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {editError}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveEdit} disabled={editSaving}>
                {editSaving ? "Saving..." : "Save changes"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
