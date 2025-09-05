import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", city: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/register?` + new URLSearchParams(form), { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMsg("Hospital registered! Please login.");
        navigate("/");
      } else {
        setMsg(data.detail || "Signup failed");
      }
    } catch {
      setMsg("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Hospital Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Hospital Name" onChange={handleChange} required /><br /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br /><br />
        <input type="text" name="city" placeholder="City" onChange={handleChange} required /><br /><br />
        <button type="submit">Signup</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default Signup;
