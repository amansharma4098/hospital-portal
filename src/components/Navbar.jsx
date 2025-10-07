import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LoginIcon from "@mui/icons-material/Login";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem("hospitalToken");
  const hospitalName = localStorage.getItem("hospitalName");
  const hospitalEmail = localStorage.getItem("hospitalEmail");

  const handleLogout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("hospitalName");
    localStorage.removeItem("hospitalEmail");
    navigate("/");
  };

  const linkActive = (path) => location.pathname === path;

  const NavButton = ({ to, label, icon }) => (
    <Button
      component={Link}
      to={to}
      startIcon={icon}
      sx={{
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        opacity: linkActive(to) ? 1 : 0.85,
        borderBottom: linkActive(to)
          ? "2px solid rgba(255,255,255,0.9)"
          : "2px solid transparent",
        "&:hover": {
          opacity: 1,
          borderBottom: "2px solid white",
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={3}
        sx={{
          background: "linear-gradient(90deg, #0077b6, #0096c7)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left section: logo / name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalHospitalIcon sx={{ color: "white", fontSize: 26 }} />
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 700, letterSpacing: 0.5 }}
            >
              Raksha360
            </Typography>
          </Box>

          {/* Center nav (hidden on mobile) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <NavButton to="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
            <NavButton to="/doctors" label="Doctors" icon={<LocalHospitalIcon />} />
          </Box>

          {/* Right side (auth info + logout or login/signup) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!token ? (
              <>
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": { background: "rgba(255,255,255,0.2)" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  startIcon={<PersonAddAlt1Icon />}
                  sx={{
                    bgcolor: "white",
                    color: "#0077b6",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#e6f4fa" },
                  }}
                >
                  Signup
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 700, color: "white" }}
                  >
                    {hospitalName}
                  </Typography>
                  {hospitalEmail && (
                    <Typography
                      variant="caption"
                      color="rgba(255,255,255,0.8)"
                      sx={{ fontSize: 12 }}
                    >
                      {hospitalEmail}
                    </Typography>
                  )}
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "white",
                    color: "#0077b6",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {hospitalName ? hospitalName[0]?.toUpperCase() : "H"}
                </Avatar>
                <Tooltip title="Logout">
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.3)",
                      ml: 1,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                    }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {/* Mobile Menu Icon */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#0077b6",
            }}
          >
            <LocalHospitalIcon /> Raksha360
          </Typography>
          <Divider />

          <List>
            <ListItem
              button
              onClick={() => {
                navigate("/dashboard");
                setDrawerOpen(false);
              }}
            >
              <DashboardIcon sx={{ mr: 1 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate("/doctors");
                setDrawerOpen(false);
              }}
            >
              <LocalHospitalIcon sx={{ mr: 1 }} />
              <ListItemText primary="Doctors" />
            </ListItem>
          </List>

          <Divider sx={{ my: 1 }} />

          {!token ? (
            <List>
              <ListItem
                button
                onClick={() => {
                  navigate("/");
                  setDrawerOpen(false);
                }}
              >
                <LoginIcon sx={{ mr: 1 }} />
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/signup");
                  setDrawerOpen(false);
                }}
              >
                <PersonAddAlt1Icon sx={{ mr: 1 }} />
                <ListItemText primary="Signup" />
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem button onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}
