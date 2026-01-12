import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getRole, getAppointments } from "../utils/auth";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);

  // ===== CEK ROLE PATIENT =====
  useEffect(() => {
    if (getRole() !== "patient") {
      navigate("/", { replace: true });
    } else {
      setAppointments(getAppointments()); // ambil data appointment pasien
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Patient Dashboard</h2>
        <nav style={styles.nav}>
          <span style={styles.navItemActive}>My Appointments</span>
          <span
            style={styles.navItem}
            onClick={() => navigate("/book")}
          >
            Book Doctor
          </span>
        </nav>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <h1 style={styles.title}>My Appointments</h1>

        {appointments.length === 0 ? (
          <p>You have no appointments yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.doctor}</td>
                  <td>{a.date}</td>
                  <td
                    style={{
                      color:
                        a.status === "approved"
                          ? "#16a34a"
                          : a.status === "rejected"
                          ? "#dc2626"
                          : "#f59e0b",
                    }}
                  >
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#f8fafc" },
  sidebar: {
    width: 220,
    background: "#1e40af",
    color: "#fff",
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  logo: { fontSize: 22, fontWeight: "bold" as const, marginBottom: 30 },
  nav: { display: "flex", flexDirection: "column" as const, gap: 14 },
  navItem: { cursor: "pointer", opacity: 0.85 },
  navItemActive: { fontWeight: "bold" as const, borderLeft: "4px solid #fff", paddingLeft: 8 },
  logout: { padding: 10, borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" },
  main: { flex: 1, padding: "24px 32px" },
  title: { fontSize: 26, marginBottom: 24, color: "#1e293b" },
  table: { width: "100%", borderCollapse: "collapse" as const },
};
