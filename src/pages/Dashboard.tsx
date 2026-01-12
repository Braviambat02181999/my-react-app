// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { logout, getRole } from "../utils/auth";
import {
  getAppointments,
  updateStatus,
  type Appointment,
  type AppointmentStatus
} from "../utils/appointments";
import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  type Doctor
} from "../utils/doctors";

export default function Dashboard() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<"dashboard" | "doctors">("dashboard");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [schedule, setSchedule] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // State untuk expand pasien
  const [expandedPatients, setExpandedPatients] = useState<string[]>([]);

  if (getRole() !== "admin") {
    return <Navigate to="/book" replace />;
  }

  useEffect(() => {
    setAppointments(getAppointments());
    setDoctors(getDoctors());
  }, []);

  const totalAppointments = appointments.length;
  const pending = appointments.filter(a => a.status === "pending").length;
  const approved = appointments.filter(a => a.status === "approved").length;
  const rejected = appointments.filter(a => a.status === "rejected").length;

  const handleStatusChange = (id: number, status: AppointmentStatus) => {
    updateStatus(id, status);
    setAppointments(getAppointments());
  };

  const handleAddOrUpdate = () => {
    if (!name || !specialty || !schedule) return alert("Isi semua field dulu!");
    if (editId !== null) {
      updateDoctor(editId, name, specialty, schedule);
      setEditId(null);
    } else {
      addDoctor(name, specialty, schedule);
    }
    setName("");
    setSpecialty("");
    setSchedule("");
    setDoctors(getDoctors());
  };

  const handleEdit = (d: Doctor) => {
    setEditId(d.id);
    setName(d.name);
    setSpecialty(d.specialization);
    setSchedule(d.schedule);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus dokter ini?")) {
      deleteDoctor(id);
      setDoctors(getDoctors());
    }
  };

  const togglePatient = (patient: string) => {
    setExpandedPatients(prev =>
      prev.includes(patient)
        ? prev.filter(p => p !== patient)
        : [...prev, patient]
    );
  };

  const patients = Array.from(new Set(appointments.map(a => a.patient)));

  const maxCount = Math.max(totalAppointments, 1);
  const getBarHeight = (count: number) => `${(count / maxCount) * 100}%`;

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Admin Dashboard</h2>
          <nav style={styles.nav}>
            <span
              style={menu === "dashboard" ? styles.navItemActive : styles.navItem}
              onClick={() => setMenu("dashboard")}
            >
              Dashboard
            </span>
            <span
              style={menu === "doctors" ? styles.navItemActive : styles.navItem}
              onClick={() => setMenu("doctors")}
            >
              Doctors
            </span>
          </nav>
        </div>
        <button style={styles.logout} onClick={() => { logout(); navigate("/", { replace: true }); }}>Logout</button>
      </aside>

      <main style={styles.main}>
        {menu === "dashboard" && (
          <>
            <h1 style={styles.title}>Doctor Booking Dashboard</h1>
            <p style={styles.subtitle}>Monitor appointments & schedules 🏥</p>

            <div style={styles.grid}>
              <div style={styles.card}>
                <p style={styles.cardTitle}>Total Appointments</p>
                <h2 style={styles.cardNumber}>{totalAppointments}</h2>
              </div>
              <div style={styles.card}>
                <p style={styles.cardTitle}>Pending</p>
                <h2 style={{ ...styles.cardNumber, color: "#dc2626" }}>{pending}</h2>
              </div>
              <div style={styles.card}>
                <p style={styles.cardTitle}>Approved</p>
                <h2 style={{ ...styles.cardNumber, color: "#16a34a" }}>{approved}</h2>
              </div>
              <div style={styles.card}>
                <p style={styles.cardTitle}>Rejected</p>
                <h2 style={{ ...styles.cardNumber, color: "#f59e0b" }}>{rejected}</h2>
              </div>
            </div>

            <h2 style={styles.sectionTitle}>Patients</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient}>
                      <td style={styles.td}>{patient}</td>
                      <td style={styles.td}>
                        <button
                          style={{ ...styles.actionBtn, background: "#2563eb" }}
                          onClick={() => togglePatient(patient)}
                        >
                          {expandedPatients.includes(patient) ? "Hide" : "View"} Appointments
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {expandedPatients.map(patient => (
              <div key={patient}>
                <h3 style={{ marginTop: 20 }}>{patient}'s Appointments</h3>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Doctor</th>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a => a.patient === patient)
                        .map(a => (
                          <tr key={a.id}>
                            <td style={styles.td}>{a.doctor}</td>
                            <td style={styles.td}>{a.date}</td>
                            <td style={{ ...styles.td, color: a.status === "approved" ? "#16a34a" : a.status === "rejected" ? "#f59e0b" : "#dc2626" }}>
                              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                            </td>
                            <td style={styles.td}>
                              {a.status === "pending" && (
                                <>
                                  <button onClick={() => handleStatusChange(a.id, "approved")} style={{ ...styles.actionBtn, background: "#16a34a" }}>Approve</button>
                                  <button onClick={() => handleStatusChange(a.id, "rejected")} style={{ ...styles.actionBtn, background: "#dc2626" }}>Reject</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </>
        )}

        {menu === "doctors" && (
          <>
            <h1 style={styles.title}>Doctor Management</h1>
            <div style={styles.formCard}>
              <h2>{editId !== null ? "Edit Doctor" : "Add Doctor"}</h2>
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={styles.input} />
              <input placeholder="Specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} style={styles.input} />
              <input type="date" placeholder="Schedule" value={schedule} onChange={e => setSchedule(e.target.value)} style={styles.input} />
              <button onClick={handleAddOrUpdate} style={styles.button}>
                {editId !== null ? "Update Doctor" : "Add Doctor"}
              </button>
            </div>

            <h2 style={styles.sectionTitle}>Doctors List</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Specialty</th>
                    <th style={styles.th}>Schedule</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id}>
                      <td style={styles.td}>{d.name}</td>
                      <td style={styles.td}>{d.specialization}</td>
                      <td style={styles.td}>{d.schedule}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleEdit(d)} style={{ ...styles.actionBtn, background: "#16a34a" }}>Edit</button>
                        <button onClick={() => handleDelete(d.id)} style={{ ...styles.actionBtn, background: "#dc2626" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#f8fafc" },
  sidebar: { width: 240, background: "#1e40af", color: "#fff", padding: 24, display: "flex", flexDirection: "column" as const, justifyContent: "space-between" },
  logo: { fontSize: 22, fontWeight: "bold" as const, marginBottom: 30 },
  nav: { display: "flex", flexDirection: "column" as const, gap: 14 },
  navItem: { cursor: "pointer", opacity: 0.85 },
  navItemActive: { fontWeight: "bold" as const, borderLeft: "4px solid #fff", paddingLeft: 8 },
  logout: { padding: 10, borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" },
  main: { flex: 1, padding: "24px 32px" },
  title: { fontSize: 26, marginBottom: 6, color: "#1e293b" },
  subtitle: { marginBottom: 24, color: "#64748b" },
  sectionTitle: { marginTop: 40, marginBottom: 16, color: "#1e293b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 },
  card: { background: "#ffffff", borderRadius: 12, padding: 20, boxShadow: "0 6px 18px rgba(30,64,175,0.1)" },
  cardTitle: { fontSize: 14, color: "#64748b" },
  cardNumber: { marginTop: 10, fontSize: 32, fontWeight: "bold" as const, color: "#1e40af" },
  chart: { display: "flex", alignItems: "flex-end", gap: 16, height: 220, padding: 20, background: "#ffffff", borderRadius: 12, boxShadow: "0 6px 18px rgba(30,64,175,0.1)" },
  bar: { flex: 1, color: "#fff", textAlign: "center" as const, borderRadius: 8, fontSize: 14, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 },
  formCard: { background: "#fff", padding: 20, borderRadius: 12, marginBottom: 32, boxShadow: "0 6px 18px rgba(30,64,175,0.1)" },
  input: { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #cbd5e1" },
  button: { padding: 10, width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  tableWrapper: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 18px rgba(30,64,175,0.1)", overflowX: "auto" as const },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: 12, background: "#eff6ff", color: "#1e40af", fontSize: 14 },
  td: { padding: 12, borderBottom: "1px solid #e5e7eb", fontSize: 14 },
  actionBtn: { padding: "4px 8px", marginRight: 6, border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
