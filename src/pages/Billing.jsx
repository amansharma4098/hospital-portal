import React, { useState } from "react";
import API_BASE_URL from "../config";

function Billing() {
  const hospitalId = localStorage.getItem("hospitalId");
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [msg, setMsg] = useState("");

  const handleChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: "", amount: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/billing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital_id: hospitalId, items, total }),
      });
      const data = await res.json();
      if (res.ok) setMsg(`Billing recorded! Total: ₹${total}`);
      else setMsg(data.detail || "Failed");
    } catch {
      setMsg("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Billing System</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, i) => (
          <div key={i}>
            <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleChange(i, e)} required />
            <input type="number" name="amount" placeholder="Amount" value={item.amount} onChange={(e) => handleChange(i, e)} required />
          </div>
        ))}
        <button type="button" onClick={addItem}>Add Item</button><br /><br />
        <button type="submit">Submit Bill</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default Billing;
