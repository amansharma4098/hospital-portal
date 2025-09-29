import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import API_BASE_URL from "../config";
import logo from "../assets/logo.png";

function SmallInput({ label, name, value, setValue, type = "text", placeholder = "" }) {
  return (
    <TextField label={label} name={name} type={type} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} fullWidth margin="normal" size="small" />
  );
}

export default function Dashboard() {
  const hospitalId = localStorage.getItem("hospitalId");
  const hospitalName = localStorage.getItem("hospitalName");
  const hospitalEmail = localStorage.getItem("hospitalEmail");
  const token = localStorage.getItem("hospitalToken");

  console.log("Token from localStorage:", token);

  const [counts, setCounts] = useState({ staff_count: 0, doctor_count: 0, pro_count: 0, request_count: 0 });
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [payloadFields, setPayloadFields] = useState({ count: "", location: "", offered_salary: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchDashboardCounts();
      fetchTickets();
    }
  }, []);

  async function fetchDashboardCounts() {
    const res = await fetch(`${API_BASE_URL}/hospital/dashboard`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
    if (res.ok) setCounts(await res.json());
  }

  async function fetchTickets() {
    setLoadingTickets(true);
    const res = await fetch(`${API_BASE_URL}/hospital/requests`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
    if (res.ok) setTickets(await res.json());
    setLoadingTickets(false);
  }

  const createTicket = async (e) => {
    e.preventDefault();
    if (!openModal) return;
    const request_type = openModal === "pros" ? "get_pro" : openModal === "staff" ? "get_staff" : openModal === "doctor" ? "get_doctor" : "other_request";
    const payload = { count: payloadFields.count, location: payloadFields.location, offered_salary: payloadFields.offered_salary, notes: payloadFields.notes };
    setCreating(true);
    const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      body: JSON.stringify({ request_type, payload }),
    });
    if (res.ok) {
      setMsg("Request created successfully!");
      setOpenModal(null);
      fetchTickets();
      fetchDashboardCounts();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.detail || "Failed to create request");
    }
    setCreating(false);
  };

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={logo} variant="square" sx={{ width: 84, height: 36 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {hospitalName || `Hospital ID: ${hospitalId}`}
              </Typography>
              {hospitalEmail && <Typography variant="body2" color="text.secondary">{hospitalEmail}</Typography>}
            </Box>
            <Box sx={{ flex: 1 }} />
            <Button onClick={fetchDashboardCounts}>Refresh Counts</Button>
            <Button sx={{ ml: 1 }} onClick={fetchTickets}>Refresh Tickets</Button>
          </Stack>
        </Paper>

        {/* cards + requests UI (unchanged from your version) */}
      </Container>
    </Box>
  );
}
