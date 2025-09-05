import React from "react";

function Dashboard() {
  const hospitalId = localStorage.getItem("hospitalId");
  return (
    <div className="container">
      <h2>Welcome to Hospital Dashboard</h2>
      <p>Hospital ID: {hospitalId}</p>
      <p>Use the navigation above to manage Doctors, Admissions, and Billing.</p>
    </div>
  );
}

export default Dashboard;
