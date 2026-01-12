import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, getRole } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi login sederhana
    if (
      (email === "admin@mail.com" && password === "123456") || 
      (email !== "admin@mail.com" && password === "123456") // semua pasien pakai password 123456
    ) {
      // simpan role dan status login
      login(email);

      // ambil role user yang baru login
      const role = getRole();

      // redirect sesuai role
      if (role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/patient", { replace: true }); // <<< pasien langsung ke dashboard
      }
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={styles.hint}>
          Admin: admin@mail.com | 123456<br/>
          Pasien: any email | 123456
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    width: 300,
    padding: 20,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    marginTop: 10,
    color: "#666",
  },
};
