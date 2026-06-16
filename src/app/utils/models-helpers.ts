import { Doctor } from '../models/doctor';
import { Patient } from '../models/patient';

export function enrichDoctor(d: Doctor): Doctor {
  const fullName = `Dr. ${d.firstName} ${d.lastName}`.trim();
  const initials = `${d.firstName?.[0] ?? ''}${d.lastName?.[0] ?? ''}`.toUpperCase();
  return { ...d, fullName, initials };
}

export function enrichPatient(p: Patient): Patient {
  const fullName = `${p.firstName} ${p.lastName}`.trim();
  const initials = `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase();
  return { ...p, fullName, initials };
}