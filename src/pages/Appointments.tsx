import { useEffect, useState } from "react";
import {
  getAppointments,
  updateStatus,
  Appointment,
} from "../utils/appointments";

export default function Appointments() {
  const [data, setData] = useState<Appointment[]>([]);

  useEffect(() => {
    setData(getAppointments());
  }, []);

  const handleUpdate = (id: number, status: "approved" | "rejected") => {
    updateStatus(id, status);
    setData(getAppointments());
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Appointments</h1>

      <table style={table}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id}>
              <td>{a.patient}</td>
              <td>{a.doctor}</td>
              <td>{a.date}</td>
              <td>{a.status}</td>
              <td>
                {a.status === "pending" && (
                  <>
                    <button onClick={() => handleUpdate(a.id, "approved")}>
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(a.id, "rejected")}
                      style={{ marginLeft: 8 }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
};
