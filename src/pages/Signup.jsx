// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  useTheme,
  Grid,
  Divider,
} from "@mui/material";
import API_BASE_URL from "../config";
import logo from "../assets/logo.png";

export default function Signup() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", city: "", password: "" });
  const [msg, setMsg] = useState(null); // { type: "error"|"success", text }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // NOTE: removed saveAuth & auto-login behavior intentionally.
  // After successful registration we redirect to /login and show a success message.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const payload = { name: form.name, email: form.email, city: form.city, password: form.password };
    console.log("Signup submitting:", payload);

    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API_BASE_URL}/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      console.log("Signup response status:", res.status);

      let data = {};
      try {
        data = await res.json();
        console.log("Signup response json:", data);
      } catch (parseErr) {
        console.warn("Signup response not JSON or empty:", parseErr);
      }

      if (!res.ok) {
        if (res.status === 422 && data.detail) {
          const validationMessages = Array.isArray(data.detail)
            ? data.detail
                .map((d) => {
                  const loc = Array.isArray(d.loc) ? d.loc.slice(1).join(".") : d.loc;
                  return `${loc}: ${d.msg}`;
                })
                .join(" | ")
            : data.detail;
          setMsg({ type: "error", text: `Validation error: ${validationMessages}` });
        } else {
          setMsg({ type: "error", text: data.detail || `Signup failed (${res.status})` });
        }
        return;
      }

      // IMPORTANT: do NOT auto-save any token here even if backend returns one.
      // Instead redirect user to /login with a success notice.
      setMsg({ type: "success", text: "Registered successfully — please log in." });
      navigate("/login", { replace: true, state: { fromSignup: true } });
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        setMsg({ type: "error", text: `Request timed out after ${timeoutMs / 1000}s` });
        console.error("Signup request aborted (timeout)");
      } else {
        console.error("Signup error:", err);
        setMsg({ type: "error", text: "Network or server error — check console/logs" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden", maxWidth: 980, mx: "auto" }}>
          <Grid container>
            {/* Left column: logo + info */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                bgcolor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 4, md: 6 },
                textAlign: "center",
                borderRight: { md: `1px solid ${theme.palette.divider}` },
              }}
            >
              <Avatar
                src={logo}
                alt="Raksha360"
                variant="square"
                sx={{
                  width: { xs: 180, sm: 200, md: 220 },
                  height: "auto",
                  mb: 2,
                  borderRadius: 1.5,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Create your Hospital Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
                Join Raksha360 and manage doctors, staff, and hospital resources with ease.
              </Typography>

              <Box sx={{ mt: 3, width: "60%", display: { xs: "none", md: "block" } }}>
                <Divider />
              </Box>
            </Grid>

            {/* Right column: form */}
            <Grid item xs={12} md={7} sx={{ p: { xs: 4, sm: 6 } }}>
              <Box sx={{ maxWidth: 480, width: "100%", mx: "auto" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Hospital Signup
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Fill in the details to create your account
                </Typography>

                {msg && (
                  <Alert severity={msg.type === "error" ? "error" : "success"} sx={{ mb: 2 }}>
                    {msg.text}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    label="Hospital Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />

                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />

                  <TextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />

                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      background:
                        theme.palette.mode === "light"
                          ? "linear-gradient(90deg,#1976d2,#dc004e)"
                          : undefined,
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "SIGNUP"}
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 3, display: "block", textAlign: "center" }}
                >
                  After signup you will be redirected to the login page to sign in.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
