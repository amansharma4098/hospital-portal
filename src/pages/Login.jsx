// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

        // try to fetch hospital name (optional)
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
            const name = detailJson.name || detailJson.hospital?.name || detailJson.hospital_name;
            if (name) localStorage.setItem("hospitalName", name);
          }
        } catch (err) {
          // ignore
        }

        navigate("/dashboard");
      } else {
        setMsg(data.detail || "Login failed");
      }
    } catch {
      setMsg("Server error");
    }
  };

  const styles = {
    container: {
      minHeight: "80vh",
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
      maxWidth: 420,
      boxSizing: "border-box",
      textAlign: "center",
    },
    title: {
      marginBottom: 20,
      fontSize: 28,
      color: "#2c3e50",
      fontWeight: 700,
    },
    input: {
      padding: "12px 15px",
      borderRadius: 6,
      border: "1.5px solid #ccc",
      fontSize: 16,
      marginBottom: 12,
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
      width: "100%",
    },
    smallLink: { display: "block", marginTop: 14, color: "#2c3e50", textDecoration: "none" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Hospital Portal Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" style={styles.button}>Login</button>
        </form>

        {msg && <p style={{ color: "red", marginTop: 12 }}>{msg}</p>}

        <div style={{ marginTop: 14 }}>
          <small>Don't have an account?</small>
          <Link to="/signup" style={styles.smallLink}>Create a hospital account (Signup)</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
