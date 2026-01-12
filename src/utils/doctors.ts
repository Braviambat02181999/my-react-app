export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  schedule: string;
}

const KEY = "doctors";

const defaultDoctors: Doctor[] = [
  { id: 1, name: "Dr. Sarah", specialization: "Cardiology", schedule: "Mon-Fri" },
  { id: 2, name: "Dr. Michael", specialization: "Dermatology", schedule: "Tue-Thu" },
];

// GET ALL
export function getDoctors(): Doctor[] {
  const data = localStorage.getItem(KEY);
  if (!data) {
    localStorage.setItem(KEY, JSON.stringify(defaultDoctors));
    return defaultDoctors;
  }
  return JSON.parse(data);
}

// ADD DOCTOR
export function addDoctor(name: string, specialization: string, schedule: string) {
  const data = getDoctors();
  const newDoctor: Doctor = {
    id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
    name,
    specialization,
    schedule,
  };
  data.push(newDoctor);
  localStorage.setItem(KEY, JSON.stringify(data));
}

// UPDATE DOCTOR
export function updateDoctor(id: number, name: string, specialization: string, schedule: string) {
  const data = getDoctors().map(d => d.id === id ? { id, name, specialization, schedule } : d);
  localStorage.setItem(KEY, JSON.stringify(data));
}

// DELETE DOCTOR
export function deleteDoctor(id: number) {
  const data = getDoctors().filter(d => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(data));
}
