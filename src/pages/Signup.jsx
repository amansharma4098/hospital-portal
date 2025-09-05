import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", city: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      name: form.name,
      email: form.email,
      city: form.city,
      password: form.password,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/hospital/register?` + params.toString(), {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("Hospital registered! Please login.");
        setTimeout(() => navigate("/"), 1500); // redirect after 1.5s delay to show message
      } else {
        setMsg(data.detail || "Signup failed");
      }
    } catch {
      setMsg("Server error");
    }
  };

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
        <h2 style={styles.title}>Hospital Signup</h2>
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
            type="text"
            name="name"
            placeholder="Hospital Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
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
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3a539b")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4b6cb7")}
          >
            Signup
          </button>
        </form>
        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

export default Signup;
