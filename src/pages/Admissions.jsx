import React, { useState } from "react";
import API_BASE_URL from "../config";

function Admissions() {
  const hospitalId = localStorage.getItem("hospitalId");
  const [form, setForm] = useState({ name: "", age: "", admission_date: "", discharge_date: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/admissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital_id: hospitalId, ...form }),
      });
      const data = await res.json();
      if (res.ok) setMsg("Admission recorded!");
      else setMsg(data.detail || "Failed");
    } catch {
      setMsg("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Patient Admission</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Patient Name" onChange={handleChange} required /><br /><br />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required /><br /><br />
        <input type="date" name="admission_date" onChange={handleChange} required /><br /><br />
        <input type="date" name="discharge_date" onChange={handleChange} /><br /><br />
        <button type="submit">Add Admission</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default Admissions;
