// src/pages/PatientDashboard.tsx
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAppointmentsForPatient,
  addAppointment,
  type Appointment,
} from "../utils/appointments";
import { getPatientName, isAuthenticated, logout } from "../utils/auth";
import { getDoctors, type Doctor } from "../utils/doctors";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const patientName = getPatientName();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [menu, setMenu] = useState<"dashboard" | "book">("dashboard");

  // redirect kalau belum login
  useEffect(() => {
    if (!isAuthenticated() || !patientName) {
      navigate("/", { replace: true });
    } else {
      setAppointments(getAppointmentsForPatient(patientName));
      setDoctors(getDoctors());
    }
  }, [navigate, patientName]);

  // summary
  const totalAppointments = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const rejected = appointments.filter((a) => a.status === "rejected").length;

  // handle booking
  const handleBooking = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate) return alert("Pilih dokter dan tanggal");

    addAppointment(patientName, selectedDoctor, selectedDate);
    setAppointments(getAppointmentsForPatient(patientName));
    setSelectedDoctor("");
    setSelectedDate("");
    alert("Booking berhasil!");
  };

  // handle logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Patient Dashboard</h2>
          <p style={styles.userName}>{patientName}</p>
          <nav style={styles.nav}>
            <span
              style={menu === "dashboard" ? styles.navItemActive : styles.navItem}
              onClick={() => setMenu("dashboard")}
            >
              Dashboard
            </span>
            <span
              style={menu === "book" ? styles.navItemActive : styles.navItem}
              onClick={() => setMenu("book")}
            >
              Book Appointment
            </span>
          </nav>
        </div>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {menu === "dashboard" && (
          <>
            {/* SUMMARY CARDS */}
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

            {/* APPOINTMENTS TABLE */}
            <h2 style={styles.sectionTitle}>Your Appointments</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Doctor</th>
                    <th style={styles.th}>Specialization</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => {
                    const doctorInfo = doctors.find((d) => d.name === a.doctor);
                    return (
                      <tr key={a.id} style={styles.tableRow}>
                        <td style={styles.td}>{a.doctor}</td>
                        <td style={styles.td}>{doctorInfo?.specialization || "-"}</td>
                        <td style={styles.td}>{a.date}</td>
                        <td style={{ ...styles.td, color: a.status === "approved" ? "#16a34a" : a.status === "rejected" ? "#f59e0b" : "#dc2626" }}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {menu === "book" && (
          <>
            {/* BOOKING FORM */}
            <div style={styles.bookingCard}>
              <h2>Book a Doctor</h2>
              <form onSubmit={handleBooking}>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} - {d.specialization} ({d.schedule})
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={styles.input}
                />

                <button type="submit" style={styles.button}>Book</button>
              </form>
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
  sidebar: {
    width: 240,
    background: "#1e40af",
    color: "#fff",
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  logo: { fontSize: 22, fontWeight: "bold" as const, marginBottom: 6 },
  userName: { marginBottom: 24, fontSize: 16, opacity: 0.85 },
  nav: { display: "flex", flexDirection: "column" as const, gap: 14 },
  navItem: { cursor: "pointer", opacity: 0.85 },
  navItemActive: { fontWeight: "bold" as const, borderLeft: "4px solid #fff", paddingLeft: 8 },
  logout: { padding: 10, borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" },
  main: { flex: 1, padding: "24px 32px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 },
  card: { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 18px rgba(30,64,175,0.1)", textAlign: "center" as const },
  cardTitle: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  cardNumber: { fontSize: 28, fontWeight: "bold" as const, color: "#1e40af" },
  sectionTitle: { fontSize: 20, fontWeight: "bold" as const, marginBottom: 12, color: "#1e293b" },
  tableWrapper: { background: "#fefefe", borderRadius: 12, padding: 16, boxShadow: "0 6px 18px rgba(30,64,175,0.1)", overflowX: "auto" as const },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" },
  tableRow: { background: "#fff", borderRadius: 8, marginBottom: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" },
  th: { textAlign: "left" as const, padding: 12, background: "#eff6ff", color: "#1e40af", fontSize: 14, borderRadius: 8 },
  td: { padding: 12, fontSize: 14 },
  bookingCard: { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 18px rgba(30,64,175,0.1)" },
  input: { width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #cbd5e1" },
  button: { padding: 10, width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};
