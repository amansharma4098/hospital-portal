// Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Fab,
  Modal,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard({
  logo = "/assets/logo.png",           // path to logo image
  hospitalName = "Raksha360 Hospital" // replace dynamically if you want
}) {
  // --- Mock / demo state: replace with API calls ---
  const [counts, setCounts] = useState({ pr: 3, staff: 12, doctors: 6, other: 2 });
  const [animatedCounts, setAnimatedCounts] = useState({ pr: 0, staff: 0, doctors: 0, other: 0 });
  const [tickets, setTickets] = useState([
    { id: 1, title: "PRO — #2", summary: "No details", time: "9/30/2025 7:51 PM", status: "open" },
    { id: 2, title: "STAFF — #41", summary: "Request for onboarding", time: "10/02/2025 10:20 AM", status: "inprogress" },
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // small count animation (simple)
  useEffect(() => {
    const duration = 700; // ms
    const steps = 20;
    const intervalMs = Math.max(10, duration / steps);
    let step = 0;
    const start = { pr: 0, staff: 0, doctors: 0, other: 0 };
    const deltas = {
      pr: counts.pr - start.pr,
      staff: counts.staff - start.staff,
      doctors: counts.doctors - start.doctors,
      other: counts.other - start.other,
    };
    const timer = setInterval(() => {
      step++;
      const factor = Math.min(1, step / steps);
      setAnimatedCounts({
        pr: Math.round(start.pr + deltas.pr * factor),
        staff: Math.round(start.staff + deltas.staff * factor),
        doctors: Math.round(start.doctors + deltas.doctors * factor),
        other: Math.round(start.other + deltas.other * factor),
      });
      if (factor === 1) clearInterval(timer);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [counts]);

  // handlers
  const handleRefreshCounts = () => {
    // TODO: replace with real API call to fetch counts
    // demo: randomize slightly
    setCounts({
      pr: Math.max(0, counts.pr + (Math.round(Math.random() * 3) - 1)),
      staff: Math.max(0, counts.staff + (Math.round(Math.random() * 5) - 2)),
      doctors: Math.max(0, counts.doctors + (Math.round(Math.random() * 3) - 1)),
      other: Math.max(0, counts.other + (Math.round(Math.random() * 2) - 1)),
    });
  };

  const handleRefreshTickets = () => {
    // TODO: replace with real API call
    setTickets((t) => [
      ...t,
      { id: Date.now(), title: "NEW — #" + (t.length + 1), summary: "Auto-added demo ticket", time: new Date().toLocaleString(), status: "open" },
    ]);
  };

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setOpenModal(true);
  };
  const closeTicket = () => {
    setSelectedTicket(null);
    setOpenModal(false);
  };

  // small card component
  const StatCard = ({ icon, title, subtitle, value }) => (
    <Card
      elevation={2}
      sx={{
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
        borderLeft: (theme) => `6px solid ${theme.palette.primary.main}`,
        minHeight: 110,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: 12 }} />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{subtitle}</Typography>
      </CardContent>
      <Box sx={{ pr: 2 }}>
        <Avatar variant="rounded" sx={{ bgcolor: "transparent" }}>
          {icon}
        </Avatar>
      </Box>
    </Card>
  );

  return (
    <Box>
      {/* Top bar */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={logo} alt="logo" sx={{ width: 46, height: 46 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{hospitalName}</Typography>
            <Chip label="Admin" size="small" sx={{ ml: 1 }} />
          </Box>

          <Box>
            <Tooltip title="Refresh counts">
              <IconButton color="inherit" onClick={handleRefreshCounts}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" color="inherit" sx={{ ml: 1 }} onClick={handleRefreshTickets}>
              Refresh Tickets
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main container */}
      <Box sx={{ maxWidth: 1180, mx: "auto", p: 3 }}>
        {/* Intro card with logo bigger on left */}
        <Paper elevation={1} sx={{ p: 3, display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar src={logo} alt="logo" sx={{ width: 84, height: 84 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{hospitalName}</Typography>
            <Typography variant="body2" color="text.secondary">Patient-first care & staff management portal</Typography>
          </Box>

          <Box>
            <Button variant="contained" startIcon={<LocalHospitalIcon />} sx={{ mr: 1 }}>
              Open Dashboard
            </Button>
            <Button variant="outlined" startIcon={<ReceiptLongIcon />} onClick={handleRefreshCounts}>
              Refresh
            </Button>
          </Box>
        </Paper>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<PeopleIcon />}
              title="Public Relations Officers"
              subtitle="Request PR / Communications staff"
              value={animatedCounts.pr}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<PersonIcon />}
              title="Staff"
              subtitle="Request permanent/temporary staff"
              value={animatedCounts.staff}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<LocalHospitalIcon />}
              title="Doctors"
              subtitle="Request visiting or full-time doctors"
              value={animatedCounts.doctors}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<ReceiptLongIcon />}
              title="Other Requests"
              subtitle="Procurement, onboarding and other requests"
              value={animatedCounts.other}
            />
          </Grid>
        </Grid>

        {/* Recent Tickets */}
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>Recent Tickets</Typography>
        <Box>
          <List>
            {tickets.map((t) => (
              <ListItem
                key={t.id}
                sx={{
                  my: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                  transition: "background 150ms, transform 120ms",
                  "&:hover": { transform: "translateY(-4px)", cursor: "pointer", background: "rgba(0,0,0,0.02)" },
                }}
                onClick={() => openTicket(t)}
                secondaryAction={
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">{t.time}</Typography>
                    <Box>{t.status === "open" ? <Chip label="Open" size="small" color="primary" /> : <Chip label={t.status} size="small" />}</Box>
                  </Box>
                }
              >
                <ListItemText
                  primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{t.title}</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary">{t.summary}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Small open tickets panel */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                <img src={logo} alt="logo-small" style={{ width: 28, height: 28 }} />
                Open Tickets <Button size="small" onClick={handleRefreshTickets} sx={{ ml: 1 }}>REFRESH</Button>
              </Typography>
              <Box sx={{ mt: 1 }}>
                {tickets.slice(0, 3).map(t => (
                  <Box key={t.id} sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.summary}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {/* placeholder for charts / analytics – recommended: insert charts here */}
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Analytics</Typography>
              <Typography variant="body2" color="text.secondary">Add charts for request trends, SLA breaches and response time here.</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Floating action button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", right: 28, bottom: 28 }}
        onClick={() => alert("Open ticket create modal (implement)") }
      >
        <AddIcon />
      </Fab>

      {/* Ticket modal */}
      <Modal open={openModal} onClose={closeTicket}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", md: 640 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedTicket?.title}</Typography>
            <IconButton onClick={closeTicket}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedTicket?.summary}</Typography>

          <Typography variant="body2"><strong>Time:</strong> {selectedTicket?.time}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}><strong>Status:</strong> {selectedTicket?.status}</Typography>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={closeTicket}>Close</Button>
            <Button variant="contained" color="primary">Mark Resolved</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}


