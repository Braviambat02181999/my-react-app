import { useState } from "react";
import { getDoctors } from "../utils/doctors";

export default function BookDoctor() {
  const doctors = getDoctors();
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    alert(`Booking submitted for ${doctor} on ${date}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Book Doctor</h1>

      <select onChange={(e) => setDoctor(e.target.value)}>
        <option>Select Doctor</option>
        {doctors.map((d) => (
          <option key={d.id}>{d.name}</option>
        ))}
      </select>

      <br /><br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <br /><br />

      <button onClick={handleSubmit}>Book</button>
    </div>
  );
}
