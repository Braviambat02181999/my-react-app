export type AppointmentStatus = "pending" | "approved" | "rejected";

export interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  status: AppointmentStatus;
}

const KEY = "appointments";

// Kosongkan defaultData supaya pasien baru yang login jadi data pertama
const defaultData: Appointment[] = [];

// Ambil semua appointment
export function getAppointments(): Appointment[] {
  const data = localStorage.getItem(KEY);
  if (!data) {
    localStorage.setItem(KEY, JSON.stringify(defaultData));
    return [];
  }
  return JSON.parse(data);
}

// Update status appointment (untuk admin)
export function updateStatus(id: number, status: AppointmentStatus) {
  const data = getAppointments().map(a => a.id === id ? { ...a, status } : a);
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ================== UNTUK PASIEN ==================

// Ambil janji temu khusus pasien
export function getAppointmentsForPatient(patientName: string): Appointment[] {
  return getAppointments().filter(a => a.patient === patientName);
}

// Tambah janji temu baru (booking)
export function addAppointment(patient: string, doctor: string, date: string) {
  const data = getAppointments();
  const newAppointment: Appointment = {
    id: data.length > 0 ? Math.max(...data.map(a => a.id)) + 1 : 1,
    patient,
    doctor,
    date,
    status: "pending",
  };
  data.push(newAppointment);
  localStorage.setItem(KEY, JSON.stringify(data));
}
