// src/pages/Login.jsx
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

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("hospitalToken", data.access_token);
        localStorage.setItem("hospitalId", data.hospital_id);

        // Optionally fetch hospital details
        try {
          const token = data.access_token;
          let detailRes = await fetch(`${API_BASE_URL}/hospital/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!detailRes.ok) {
            detailRes = await fetch(`${API_BASE_URL}/hospital/${data.hospital_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            const name =
              detailJson.name || detailJson.hospital?.name || detailJson.hospital_name;
            const email =
              detailJson.email || detailJson.hospital?.email || detailJson.hospital_email;
            if (name) localStorage.setItem("hospitalName", name);
            if (email) localStorage.setItem("hospitalEmail", email);
          }
        } catch (err) {
          // ignore detail fetch errors
          console.warn("Failed to fetch hospital details:", err);
        }

        // redirect to dashboard
        navigate("/dashboard");
      } else {
        setMsg({ type: "error", text: data.detail || "Login failed" });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Server error — please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              src={logo}
              alt="Raksha360"
              variant="square"
              sx={{
                width: 150,
                height: 96,
                mx: "auto",
                mb: 1,
                boxShadow: 3,
                borderRadius: 2,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Hospital Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to manage hospital requests and staff
            </Typography>
          </Box>

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
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(90deg,#1976d2,#dc004e)"
                    : undefined,
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Login"}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
            </Typography>

            <Button
              component={RouterLink}
              to="/signup"
              variant="text"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Create a hospital account (Signup)
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
