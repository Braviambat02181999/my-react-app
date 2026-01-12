import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../utils/doctors";

export default function BookingDoctor() {
  const navigate = useNavigate();
  const doctors = getDoctors();
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!doctor || !date) return alert("Pilih dokter dan tanggal dulu!");
    alert(`Booking submitted for ${doctor} on ${date}`);
    // setelah booking, kembali ke dashboard pasien
    navigate("/patient");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Book Doctor</h1>

      <select
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        style={{ padding: 8, width: 200, marginBottom: 16 }}
      >
        <option value="">Select Doctor</option>
        {doctors.map((d) => (
          <option key={d.id}>{d.name}</option>
        ))}
      </select>

      <br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: 8, marginBottom: 16 }}
      />

      <br />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginRight: 10,
        }}
      >
        Book
      </button>

      <button
        onClick={() => navigate("/patient")}
        style={{
          padding: "10px 20px",
          background: "#6b7280",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}
