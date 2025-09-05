import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/doctors`)
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch(() => setDoctors([]));
  }, []);

  return (
    <div className="container">
      <h2>Listed Doctors</h2>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.name}</strong> - {doc.specialization} ({doc.city})
            {doc.phone && (
              <a href={`https://wa.me/${doc.phone}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;
