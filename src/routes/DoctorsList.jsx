import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/doctors`)
      .then((res) => res.json())
      .then(setDoctors)
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Available Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors available</p>
      ) : (
        <div className="grid gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="border p-4 rounded-lg bg-white shadow">
              <p className="font-bold">{doc.name}</p>
              <p>{doc.specialization} - {doc.city}</p>
              <p>
                WhatsApp:{" "}
                <a
                  href={`https://wa.me/91${doc.contact}?text=Hello%20Dr.%20${encodeURIComponent(
                    doc.name
                  )},%20our%20hospital%20would%20like%20to%20onboard%20you.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline"
                >
                  +91-{doc.contact}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}