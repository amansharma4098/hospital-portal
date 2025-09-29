// src/components/Signup.jsx
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

  const saveAuth = ({ token, name, email }) => {
    try {
      if (token) localStorage.setItem("token", token);
      if (name) localStorage.setItem("hospitalName", name);
      if (email) localStorage.setItem("hospitalEmail", email);
    } catch (err) {
      console.warn("localStorage error:", err);
    }
  };

  const attemptLogin = async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    const res = await fetch(`${API_BASE_URL}/auth/hospital/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `Login failed (${res.status})`);
    }
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

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

      // Save immediate hospital info
      localStorage.setItem("hospitalName", form.name);
      localStorage.setItem("hospitalEmail", form.email);

      if (data.token) {
        saveAuth({
          token: data.token,
          name: data.hospital?.name || form.name,
          email: data.hospital?.email || form.email,
        });
        navigate("/dashboard", { replace: true });
        return;
      }

      try {
        const loginResp = await attemptLogin(form.email, form.password);
        const token = loginResp.token || loginResp.access_token || loginResp.data?.token;
        if (token) {
          saveAuth({
            token,
            name: loginResp.hospital?.name || form.name,
            email: form.email,
          });
          navigate("/dashboard", { replace: true });
        } else {
          setMsg({ type: "success", text: "Registered — please login." });
          navigate("/login", { replace: true });
        }
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr);
        setMsg({
          type: "success",
          text: "Registered — auto-login failed, please login manually.",
        });
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMsg({ type: "error", text: "Server error" });
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
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              src={logo}
              alt="Raksha360"
              variant="square"
              sx={{
                width: 115,
                height: 96,
                mx: "auto",
                mb: 1,
                boxShadow: 3,
                borderRadius: 2,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Hospital Signup
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Create your hospital account to access the portal
            </Typography>
          </Box>

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
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(90deg,#1976d2,#dc004e)"
                    : undefined,
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Signup"}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: "block", textAlign: "center" }}
          >
            By signing up you’ll be redirected to the dashboard automatically if possible.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
