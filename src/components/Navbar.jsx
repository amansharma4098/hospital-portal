// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("hospitalToken");
  const hospitalName = localStorage.getItem("hospitalName");

  const handleLogout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("hospitalName");
    navigate("/");
  };

  const linkStyle = { color: "white", textDecoration: "none", marginRight: 14 };

  return (
    <nav style={{ background: "#0077b6", padding: 10 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side navigation */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/dashboard" style={{ ...linkStyle, fontWeight: 600 }}>
            Dashboard
          </Link>
          <Link to="/doctors" style={linkStyle}>
            Doctors
          </Link>
          {/* Admissions and Billing temporarily removed */}
        </div>

        {/* Right side: auth actions */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!token ? (
            // Not logged in: show Login / Signup
            <>
              <Link
                to="/"
                style={{
                  ...linkStyle,
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "6px 10px",
                  borderRadius: 6,
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  ...linkStyle,
                  background: "white",
                  color: "#0077b6",
                  padding: "6px 10px",
                  borderRadius: 6,
                }}
              >
                Signup
              </Link>
            </>
          ) : (
            // Logged in: show hospital name + logout
            <>
              {hospitalName && (
                <div style={{ color: "white", fontWeight: 600 }}>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
