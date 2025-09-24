import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

function SmallInput({ label, name, value, setValue, type = "text", placeholder = "" }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ padding: "8px 10px", width: "100%", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </div>
  );
}

export default function Dashboard() {
  const hospitalId = localStorage.getItem("hospitalId");
  const hospitalName = localStorage.getItem("hospitalName");
  const hospitalEmail = localStorage.getItem("hospitalEmail");
  const token = localStorage.getItem("hospitalToken");

  // counts for cards
  const [counts, setCounts] = useState({
    staff_count: 0,
    doctor_count: 0,
    pro_count: 0,
    request_count: 0,
  });

  // modal state
  const [openModal, setOpenModal] = useState(null); // "pros" | "staff" | "doctor" | "other" | null

  // form values (flexible payload)
  const [payloadFields, setPayloadFields] = useState({ count: "", location: "", offered_salary: "", notes: "" });

  // tickets list
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // selected ticket to view details
  const [selectedTicket, setSelectedTicket] = useState(null);

  // messages
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchDashboardCounts();
    fetchTickets();
    // eslint-disable-next-line
  }, []);

  async function fetchDashboardCounts() {
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/dashboard`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const d = await res.json();
        setCounts(d);
      } else {
        console.warn("Failed to fetch dashboard counts");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const d = await res.json();
        setTickets(d);
      } else {
        setTickets([]);
      }
    } catch (e) {
      setTickets([]);
      console.error(e);
    } finally {
      setLoadingTickets(false);
    }
  }

  function openCardModal(type) {
    setPayloadFields({ count: "", location: "", offered_salary: "", notes: "" });
    setOpenModal(type);
    setMsg("");
  }

  async function createTicket(e) {
    e.preventDefault();
    if (!openModal) return;

    const request_type = openModal === "pros" ? "get_pro" :
                         openModal === "staff" ? "get_staff" :
                         openModal === "doctor" ? "get_doctor" : "other_request";

    const payload = {
      count: payloadFields.count || undefined,
      location: payloadFields.location || undefined,
      offered_salary: payloadFields.offered_salary || undefined,
      notes: payloadFields.notes || undefined
    };

    try {
      const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ request_type, payload }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("Request created successfully!");
        setOpenModal(null);
        // refresh
        fetchTickets();
        fetchDashboardCounts();
      } else {
        setMsg(data.detail || "Failed to create request");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  }

  const cardStyle = {
    background: "white",
    borderRadius: 10,
    padding: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Hospital Dashboard</h2>
          <p style={{ color: "#666" }}>
            {hospitalName ? hospitalName : `Hospital ID: ${hospitalId}`}
            {hospitalEmail && <span style={{ marginLeft: 12, fontSize: 13, color: "#444" }}>{hospitalEmail}</span>}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          <div style={cardStyle} onClick={() => openCardModal("pros")}>
            <h3>Public Relations Officers</h3>
            <p style={{ margin: "8px 0" }}>{counts.pro_count} existing</p>
            <small>Request public relations officers (PR / communications)</small>
          </div>

          <div style={cardStyle} onClick={() => openCardModal("staff")}>
            <h3>Get Staff</h3>
            <p style={{ margin: "8px 0" }}>{counts.staff_count} existing</p>
            <small>Request permanent/temporary staff</small>
          </div>

          <div style={cardStyle} onClick={() => openCardModal("doctor")}>
            <h3>Get Doctor</h3>
            <p style={{ margin: "8px 0" }}>{counts.doctor_count} existing</p>
            <small>Request visiting or full-time doctors</small>
          </div>

          <div style={cardStyle} onClick={() => openCardModal("other")}>
            <h3>Other Requests</h3>
            <p style={{ margin: "8px 0" }}>{counts.request_count} total</p>
            <small>Any other requests (onboard, procurement)</small>
          </div>
        </div>

        {/* Modal */}
        {openModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setOpenModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ width: 520, background: "white", padding: 20, borderRadius: 10 }}
            >
              <h3 style={{ marginTop: 0 }}>
                {openModal === "pros" ? "Request Public Relations Officers" :
                 openModal === "staff" ? "Request Staff" :
                 openModal === "doctor" ? "Request Doctor" : "Create Request"}
              </h3>

              <form onSubmit={createTicket}>
                <SmallInput label="Count" name="count" value={payloadFields.count} setValue={(v) => setPayloadFields(p => ({...p, count: v}))} type="number" placeholder="Number of persons / doctors" />
                <SmallInput label="Location" name="location" value={payloadFields.location} setValue={(v) => setPayloadFields(p => ({...p, location: v}))} placeholder="City / area" />
                <SmallInput label="Offered Salary (optional)" name="offered_salary" value={payloadFields.offered_salary} setValue={(v) => setPayloadFields(p => ({...p, offered_salary: v}))} placeholder="e.g. 15000/month" />
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Notes</label>
                  <textarea
                    value={payloadFields.notes}
                    onChange={(e) => setPayloadFields(p => ({...p, notes: e.target.value}))}
                    placeholder="Any other details..."
                    style={{ width: "100%", minHeight: 80, borderRadius: 6, padding: 8, border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setOpenModal(null)} style={{ padding: "8px 12px", borderRadius: 6 }}>Cancel</button>
                  <button type="submit" style={{ padding: "8px 12px", background: "#4b6cb7", color: "white", borderRadius: 6 }}>
                    Create Request
                  </button>
                </div>

                {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Right side: tickets */}
      <div style={{ width: 420 }}>
        <div style={{ background: "white", padding: 16, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
          <h3 style={{ marginTop: 0 }}>Open Tickets</h3>
          <div style={{ marginBottom: 10 }}>
            <button onClick={fetchTickets} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#f1f1f1" }}>
              Refresh
            </button>
          </div>

          {loadingTickets ? (
            <p>Loading...</p>
          ) : tickets.length === 0 ? (
            <p style={{ color: "#666" }}>No tickets yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tickets.map((t) => (
                <div key={t.id} onClick={() => setSelectedTicket(t)} style={{ padding: 10, borderRadius: 8, border: "1px solid #eee", cursor: "pointer", background: t.status === "open" ? "#fff" : "#fafafa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{t.request_type}</strong>
                    <small>{new Date(t.created_at).toLocaleString()}</small>
                  </div>
                  <div style={{ color: "#444", marginTop: 6 }}>
                    {t.payload && Object.keys(t.payload).length ? Object.entries(t.payload).slice(0,2).map(([k,v]) => <div key={k}><small>{k}: {String(v)}</small></div>) : <small>No details</small>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* selected ticket details */}
          {selectedTicket && (
            <div style={{ marginTop: 12, padding: 10, borderTop: "1px dashed #eee" }}>
              <h4 style={{ margin: "6px 0" }}>Ticket #{selectedTicket.id}</h4>
              <p style={{ margin: "6px 0" }}><strong>Type:</strong> {selectedTicket.request_type}</p>
              <p style={{ margin: "6px 0" }}><strong>Status:</strong> {selectedTicket.status}</p>
              <p style={{ margin: "6px 0" }}><strong>Created:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
              <div style={{ background: "#f9f9f9", padding: 8, borderRadius: 6 }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 13 }}>{JSON.stringify(selectedTicket.payload, null, 2)}</pre>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(selectedTicket.payload || {})); }} style={{ padding: "6px 10px", borderRadius: 6 }}>
                  Copy Payload
                </button>
                <button onClick={() => setSelectedTicket(null)} style={{ padding: "6px 10px", borderRadius: 6 }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
