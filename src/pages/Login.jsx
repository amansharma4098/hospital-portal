import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null); // { type: "error"|"success", text }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", form.email);
      formData.append("password", form.password);

      const res = await fetch(`${API_BASE_URL}/auth/hospital/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Login response:", data, "status:", res.status);

      if (res.ok) {
        // backend returns { token: "...", hospital_id: N } (in your code)
        const token = data.token || data.access_token;
        if (token) {
          localStorage.setItem("hospitalToken", token);
        }
        if (data.hospital_id) {
          localStorage.setItem("hospitalId", String(data.hospital_id));
        }

        // if backend returned hospital object
        if (data.hospital) {
          if (data.hospital.name) localStorage.setItem("hospitalName", data.hospital.name);
          if (data.hospital.email) localStorage.setItem("hospitalEmail", data.hospital.email);
        }

        // Attempt to fetch /hospital/me to fill missing info
        try {
          const tokenToUse = token || localStorage.getItem("hospitalToken");
          if (tokenToUse) {
            const detailRes = await fetch(`${API_BASE_URL}/hospital/me`, {
              headers: { Authorization: `Bearer ${tokenToUse}` },
            });
            if (detailRes.ok) {
              const detailJson = await detailRes.json();
              if (detailJson.name) localStorage.setItem("hospitalName", detailJson.name);
              if (detailJson.email) localStorage.setItem("hospitalEmail", detailJson.email);
              if (detailJson.id) localStorage.setItem("hospitalId", String(detailJson.id));
            }
          }
        } catch (err) {
          console.warn("Failed to fetch hospital/me after login:", err);
        }

        navigate("/dashboard");
      } else {
        setMsg({ type: "error", text: data.detail || "Login failed" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg({ type: "error", text: "Server error — please try again later." });
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
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          <Grid container>
            {/* Left column */}
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
                Raksha360 Hospital Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
                Sign in to manage hospital requests, staff and equipment. Secure, fast and easy to use.
              </Typography>

              <Box sx={{ mt: 3, width: "60%", display: { xs: "none", md: "block" } }}>
                <Divider />
              </Box>
            </Grid>

            {/* Right column */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                p: { xs: 4, sm: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ maxWidth: 480, width: "100%", mx: "auto" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Enter your credentials to access the dashboard
                </Typography>

                {msg && (
                  <Alert severity={msg.type === "error" ? "error" : "success"} sx={{ mb: 2 }}>
                    {msg.text}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
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
                    {loading ? <CircularProgress size={20} color="inherit" /> : "LOGIN"}
                  </Button>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, gap: 1, flexWrap: "wrap" }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?
                  </Typography>

                  <Button component={RouterLink} to="/signup" variant="text" size="small" sx={{ textTransform: "none" }}>
                    Create a hospital account (Signup)
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
