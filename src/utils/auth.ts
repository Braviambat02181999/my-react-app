// src/utils/auth.ts

export function login(email: string) {
  if (email === "admin@mail.com") {
    localStorage.setItem("role", "admin");
    localStorage.setItem("userName", "Admin"); // simpan nama admin
  } else {
    localStorage.setItem("role", "patient");
    // Ambil nama pasien dari email (sebelum "@") sebagai contoh
    const name = email.split("@")[0];
    localStorage.setItem("userName", name);
  }
  localStorage.setItem("isAuth", "true");
}

export function logout() {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
}

export function isAuthenticated() {
  return localStorage.getItem("isAuth") === "true";
}

export function getRole() {
  return localStorage.getItem("role");
}

// Fungsi baru untuk dapatkan nama pasien/admin
export function getPatientName(): string {
  return localStorage.getItem("userName") || "Unknown";
}
