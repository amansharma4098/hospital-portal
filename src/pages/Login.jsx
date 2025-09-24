// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", form.email);
    formData.append("password", form.password);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/hospital/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("hospitalToken", data.access_token);
        localStorage.setItem("hospitalId", data.hospital_id);

        // Try to fetch hospital details (name). If your backend provides a detail route like /hospital/{id} or /hospital/me, adjust accordingly.
        try {
          const token = data.access_token;
          // try /hospital/me first (common pattern), fallback to /hospital/{id}
          let name;
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
            // common fields: name or hospital.name
            name = detailJson.name || detailJson.hospital?.name || detailJson.hospital_name;
            if (name) localStorage.setItem("hospitalName", name);
          }
        } catch (err) {
          // ignore fetch errors; rely on signup-stored name if any
        }

        navigate("/dashboard");
      } else {
        setMsg(data.detail || "Login failed");
      }
    } catch {
      setMsg("Server error");
    }
  };

  // Inline style objects
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #4b6cb7, #182848)",
      padding: 20,
      boxSizing: "border-box",
    },
    box: {
      background: "white",
      padding: "40px 30px",
      borderRadius: 10,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      width: "100%",
      maxWidth: 400,
      boxSizing: "border-box",
      textAlign: "center",
    },
    title: {
      marginBottom: 30,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: 28,
      color: "#2c3e50",
      fontWeight: 700,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    input: {
      padding: "12px 15px",
      borderRadius: 6,
      border: "1.5px solid #ccc",
      fontSize: 16,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    button: {
      backgroundColor: "#4b6cb7",
      color: "white",
      fontSize: 18,
      padding: "12px 0",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600,
      transition: "background-color 0.3s ease",
    },
    msg: {
      marginTop: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#e74c3c",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Hospital Portal Login</h2>
        <form
          style={styles.form}
          onSubmit={handleSubmit}
          onFocus={(e) => {
            if (e.target.tagName === "INPUT") e.target.style.borderColor = "#4b6cb7";
          }}
          onBlur={(e) => {
            if (e.target.tagName === "INPUT") e.target.style.borderColor = "#ccc";
          }}
        >
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#3a539b")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#4b6cb7")}
          >
            Login
          </button>
        </form>
        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

export default Login;
