// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import logo from "../assets/logo.png";
import HeaderBar from "../components/HeaderBar";
import StatsCards from "../components/StatsCards";
import RecentTicketsList from "../components/RecentTicketsList";
import OpenTicketsPanel from "../components/OpenTicketsPanel";
import TicketDetailsCard from "../components/TicketDetailsCard";
import CreateRequestDialog from "../components/CreateRequestDialog";
import EditTicketDialog from "../components/EditTicketDialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const hospitalName = localStorage.getItem("hospitalName");
  const hospitalEmail = localStorage.getItem("hospitalEmail");
  const token = localStorage.getItem("hospitalToken");

  const [counts, setCounts] = useState({ staff_count: 0, doctor_count: 0, pro_count: 0, request_count: 0 });
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openModal, setOpenModal] = useState(null);
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
      navigate("/login", { replace: true });
    } else {
      fetchDashboardCounts();
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDashboardCounts() {
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/dashboard`, { headers: { Authorization: token ? `Bearer ${token}` : "" }});
      if (res.ok) setCounts(await res.json());
    } catch (err) { console.error(err); }
  }

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/requests`, { headers: { Authorization: token ? `Bearer ${token}` : "" }});
      if (res.ok) setTickets(await res.json());
      else setTickets([]);
    } catch (err) { console.error(err); setTickets([]); }
    finally { setLoadingTickets(false); }
  }

  function openCardModal(type) {
    setPayloadFields({ count: "", location: "", offered_salary: "", notes: "" });
    setOpenModal(type);
    setMsg("");
  }

  function normalizeFrontType(openModal) {
    if (!openModal) return "OTHER";
    const s = String(openModal).toLowerCase();
    if (s === "pros" || s === "pro") return "PRO";
    if (s === "staff") return "STAFF";
    if (s === "doctor") return "DOCTOR";
    return openModal.toUpperCase();
  }

  const createTicket = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!openModal) return;
    const type = normalizeFrontType(openModal);
    const count = payloadFields.count ? Number(payloadFields.count) : undefined;
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
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOpenModal(null);
        await fetchTickets();
        await fetchDashboardCounts();
      } else {
        setMsg(data?.detail || data?.error || `Failed (${res.status})`);
      }
    } catch (err) {
      console.error(err); setMsg("Server error");
    } finally { setCreating(false); }
  };

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
      try { payloadObj = JSON.parse(editPayloadText); } catch (e) { setEditError("Payload must be valid JSON."); return; }
    }
    const body = { details: editDetails, description: editDetails, payload: payloadObj, count: editCount ? Number(editCount) : null };
    setEditSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${selectedTicket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.detail || `Save failed (${res.status})`);
      }
      await fetchTickets();
      await fetchDashboardCounts();
      setEditOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error(err); setEditError(err.message || "Save failed");
    } finally { setEditSaving(false); }
  }

  async function handleCloseTicket(ticket) {
    if (!ticket) return;
    const ok = window.confirm(`Close ticket #${ticket.id}? This action cannot be undone.`);
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.detail || `Close failed (${res.status})`);
      }
      await fetchTickets(); await fetchDashboardCounts(); setSelectedTicket(null);
    } catch (err) { console.error(err); alert(err.message || "Failed to close ticket"); }
  }

  const copyPayloadToClipboard = async (payload) => {
    try { await navigator.clipboard.writeText(JSON.stringify(payload || {}, null, 2)); } catch (e) { console.error("copy failed", e); }
  };

  const accent = "#1976d2";

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg">

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StatsCards counts={counts} onCardClick={openCardModal} accent={accent} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Recent Tickets</Typography>
              <RecentTicketsList tickets={tickets} loading={loadingTickets} onEdit={openEditModal} onClose={handleCloseTicket} onSelect={(t) => setSelectedTicket(t)} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <OpenTicketsPanel logo={logo} tickets={tickets} loading={loadingTickets} onRefresh={fetchTickets} onSelect={(t) => setSelectedTicket(t)} onEdit={openEditModal} onCopy={copyPayloadToClipboard} />

            {selectedTicket && (
              <Box sx={{ mt: 2 }}>
                <TicketDetailsCard ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onCloseTicket={handleCloseTicket} onEdit={openEditModal} onCopy={copyPayloadToClipboard} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <CreateRequestDialog open={Boolean(openModal)} onClose={() => setOpenModal(null)} payloadFields={payloadFields} setPayloadFields={setPayloadFields} onCreate={createTicket} creating={creating} msg={msg} openModal={openModal} />
      <EditTicketDialog open={editOpen} onClose={() => setEditOpen(false)} editDetails={editDetails} setEditDetails={setEditDetails} editCount={editCount} setEditCount={setEditCount} editPayloadText={editPayloadText} setEditPayloadText={setEditPayloadText} onSave={handleSaveEdit} saving={editSaving} error={editError} selectedTicket={selectedTicket} />
    </Box>
  );
}
