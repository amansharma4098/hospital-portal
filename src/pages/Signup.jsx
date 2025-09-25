// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", city: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Persist auth and hospital info to localStorage (safe-guarded)
  const saveAuth = ({ token, name, email }) => {
    try {
      if (token) localStorage.setItem("token", token);
      if (name) localStorage.setItem("hospitalName", name);
      if (email) localStorage.setItem("hospitalEmail", email);
    } catch (err) {
      console.warn("localStorage error:", err);
    }
  };

  // Fallback login call if signup didn't return a token
  // Backend expects OAuth2 form (username & password) at /auth/hospital/login
  const attemptLogin = async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email); // OAuth2PasswordRequestForm expects 'username'
    body.append("password", password);

    const res = await fetch(`${API_BASE_URL}/auth/hospital/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
    setMsg("");
    setLoading(true);

    try {
      // Send JSON body to match HospitalRegisterRequest Pydantic model
      const res = await fetch(`${API_BASE_URL}/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          city: form.city,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // surface validation messages if present (422) or other details
        if (res.status === 422 && data.detail) {
          const validationMessages = Array.isArray(data.detail)
            ? data.detail.map((d) => {
                const loc = Array.isArray(d.loc) ? d.loc.slice(1).join(".") : d.loc;
                return `${loc}: ${d.msg}`;
              }).join(" | ")
            : data.detail;
          setMsg(`Validation error: ${validationMessages}`);
        } else {
          setMsg(data.detail || `Signup failed (${res.status})`);
        }
        setLoading(false);
        return;
      }

      // Save hospital basic info immediately for UI
      try {
        localStorage.setItem("hospitalName", form.name);
        localStorage.setItem("hospitalEmail", form.email);
      } catch (err) {
        console.warn("localStorage error:", err);
      }

      // If signup returned a token, use it
      if (data.token) {
        saveAuth({ token: data.token, name: data.hospital?.name || form.name, email: data.hospital?.email || form.email });
        navigate("/dashboard", { replace: true });
        return;
      }

      // Fallback: attempt to login immediately using same credentials
      try {
        const loginResp = await attemptLogin(form.email, form.password);
        // backend returns { token: ... } for hospital login in your router
        const token = loginResp.token || loginResp.access_token || loginResp.data?.token;
        if (token) {
          saveAuth({
            token,
            name: loginResp.hospital?.name || form.name,
            email: form.email,
          });
          navigate("/dashboard", { replace: true });
          return;
        } else {
          setMsg("Registered — please login. (No token returned.)");
          navigate("/login", { replace: true });
        }
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr);
        setMsg("Registered — but auto-login failed. Please login manually.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMsg("Server error");
    } finally {
      setLoading(false);
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
      opacity: loading ? 0.7 : 1,
      pointerEvents: loading ? "none" : "auto",
    },
    msg: {
      marginTop: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#e74c3c",
      fontWeight: 600,
    },
    small: {
      fontSize: 13,
      color: "#666",
      marginTop: 8,
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
            disabled={loading}
          >
            {loading ? "Please wait..." : "Signup"}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}
        <p style={styles.small}>
          By signing up you will be redirected to the dashboard automatically if possible.
        </p>
      </div>
    </div>
  );
}

export default Signup;
