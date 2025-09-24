// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored auth and hospital info
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("hospitalName");
    navigate("/");
  };

  const hospitalName = localStorage.getItem("hospitalName");

  return (
    <nav style={{ background: "#0077b6", padding: 10 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>Dashboard</Link>
          <Link to="/doctors" style={{ color: "white", textDecoration: "none" }}>Doctors</Link>
          <Link to="/admissions" style={{ color: "white", textDecoration: "none" }}>Admissions</Link>
          <Link to="/billing" style={{ color: "white", textDecoration: "none" }}>Billing</Link>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {hospitalName && (
            <div style={{ color: "white", fontWeight: 600, marginRight: 8 }}>
              {hospitalName}
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
