const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
const ws = require('ws');

const SUPABASE_URL              = 'https://zqxdqqjzowelpxgsldhq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeGRxcWp6b3dlbHB4Z3NsZGhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI4MzM3MCwiZXhwIjoyMDk2ODU5MzcwfQ.dBMWCLP6nIYMY-So0Km0c4D37aQ8i83M4d3ZhnsJc6Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth:     { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

const uuid = () => randomUUID();
const log  = (msg) => console.log(`✔  ${msg}`);

async function insert(table, rows) {
  if (!rows.length) { console.warn(`⚠  No rows for ${table}`); return; }
  const { error } = await supabase.from(table).insert(rows);
  if (error) { console.error(`✘  ${table}:`, error.message); process.exit(1); }
  log(`${table} — ${rows.length} row(s)`);
}

// ── IDs ──────────────────────────────────────────────────────────
const clinicId = uuid();

const U = {
  admin: uuid(), receptionist: uuid(),
  ud1: uuid(), ud2: uuid(), ud3: uuid(), ud4: uuid(), ud5: uuid(),
  ud6: uuid(), ud7: uuid(), ud8: uuid(), ud9: uuid(), ud10: uuid(),
  up1: uuid(), up2: uuid(), up3: uuid(), up4: uuid(), up5: uuid(),
  up6: uuid(), up7: uuid(), up8: uuid(), up9: uuid(), up10: uuid(),
};

const D = { d1: uuid(), d2: uuid(), d3: uuid(), d4: uuid(), d5: uuid(), d6: uuid(), d7: uuid(), d8: uuid(), d9: uuid(), d10: uuid() };
const P = { p1: uuid(), p2: uuid(), p3: uuid(), p4: uuid(), p5: uuid(), p6: uuid(), p7: uuid(), p8: uuid(), p9: uuid(), p10: uuid() };

const A = {}; for (let i = 1; i <= 22; i++) A[`a${i}`] = uuid();
const MR = {}; for (let i = 1; i <= 6; i++) MR[`mr${i}`] = uuid();
const PAY = {}; for (let i = 1; i <= 8; i++) PAY[`pay${i}`] = uuid();

async function seedClinic() {
  await insert('clinics', [{
    id: clinicId, name: 'HealthSync Demo Clinic', slug: 'healthsync-demo',
    phone: '+201090222247', address: 'Cairo, Egypt', plan: 'trial',
    trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
  }]);
}

async function seedUsers() {
  await insert('users', [
    { id: U.admin,        clinic_id: clinicId, email: 'kareem@healthsync.com',   password: 'admin123',  role: 'admin',        first_name: 'Kareem',   last_name: 'Khalifa',   phone: '+201090222247' },
    { id: U.receptionist, clinic_id: clinicId, email: 'lisa@healthsync.com',     password: 'recep123',  role: 'receptionist', first_name: 'Lisa',     last_name: 'Martinez',  phone: '+1-555-0110'  },
    { id: U.ud1,  clinic_id: clinicId, email: 'dr.kareem@healthsync.com',   password: 'doctor123', role: 'doctor', first_name: 'Kareem',   last_name: 'Khalifa',   phone: '+201111445265', doctor_id: D.d1  },
    { id: U.ud2,  clinic_id: clinicId, email: 'dr.james@healthsync.com',    password: 'doctor123', role: 'doctor', first_name: 'James',    last_name: 'Mitchell',  phone: '+1-555-0102',  doctor_id: D.d2  },
    { id: U.ud3,  clinic_id: clinicId, email: 'dr.priya@healthsync.com',    password: 'doctor123', role: 'doctor', first_name: 'Priya',    last_name: 'Sharma',    phone: '+1-555-0103',  doctor_id: D.d3  },
    { id: U.ud4,  clinic_id: clinicId, email: 'dr.ahmed@healthsync.com',    password: 'doctor123', role: 'doctor', first_name: 'Ahmed',    last_name: 'Hassan',    phone: '+1-555-0104',  doctor_id: D.d4  },
    { id: U.ud5,  clinic_id: clinicId, email: 'dr.elena@healthsync.com',    password: 'doctor123', role: 'doctor', first_name: 'Elena',    last_name: 'Vasquez',   phone: '+1-555-0105',  doctor_id: D.d5  },
    { id: U.ud6,  clinic_id: clinicId, email: 'dr.robert@healthsync.com',   password: 'doctor123', role: 'doctor', first_name: 'Robert',   last_name: 'Chen',      phone: '+1-555-0106',  doctor_id: D.d6  },
    { id: U.ud7,  clinic_id: clinicId, email: 'dr.fatima@healthsync.com',   password: 'doctor123', role: 'doctor', first_name: 'Fatima',   last_name: 'Al-Rashid', phone: '+1-555-0107',  doctor_id: D.d7  },
    { id: U.ud8,  clinic_id: clinicId, email: 'dr.anita@healthsync.com',    password: 'doctor123', role: 'doctor', first_name: 'Anita',    last_name: 'Patel',     phone: '+1-555-0111',  doctor_id: D.d8  },
    { id: U.ud9,  clinic_id: clinicId, email: 'dr.jennifer@healthsync.com', password: 'doctor123', role: 'doctor', first_name: 'Jennifer', last_name: 'Kim',       phone: '+1-555-0112',  doctor_id: D.d9  },
    { id: U.ud10, clinic_id: clinicId, email: 'dr.thomas@healthsync.com',   password: 'doctor123', role: 'doctor', first_name: 'Thomas',   last_name: 'Williams',  phone: '+1-555-0113',  doctor_id: D.d10 },
    { id: U.up1,  clinic_id: clinicId, email: 'john@patient.com',    password: 'patient123', role: 'patient', first_name: 'John',    last_name: 'Smith',   phone: '+1-555-0201', patient_id: P.p1  },
    { id: U.up2,  clinic_id: clinicId, email: 'emily@patient.com',   password: 'patient123', role: 'patient', first_name: 'Emily',   last_name: 'Davis',   phone: '+1-555-0202', patient_id: P.p2  },
    { id: U.up3,  clinic_id: clinicId, email: 'michael@patient.com', password: 'patient123', role: 'patient', first_name: 'Michael', last_name: 'Brown',   phone: '+1-555-0203', patient_id: P.p3  },
    { id: U.up4,  clinic_id: clinicId, email: 'sophia@patient.com',  password: 'patient123', role: 'patient', first_name: 'Sophia',  last_name: 'Chen',    phone: '+1-555-0204', patient_id: P.p4  },
    { id: U.up5,  clinic_id: clinicId, email: 'sarah@patient.com',   password: 'patient123', role: 'patient', first_name: 'Sarah',   last_name: 'Johnson', phone: '+1-555-0210', patient_id: P.p5  },
    { id: U.up6,  clinic_id: clinicId, email: 'david@patient.com',   password: 'patient123', role: 'patient', first_name: 'David',   last_name: 'Wilson',  phone: '+1-555-0211', patient_id: P.p6  },
    { id: U.up7,  clinic_id: clinicId, email: 'lisa@patient.com',    password: 'patient123', role: 'patient', first_name: 'Lisa',    last_name: 'Martin',  phone: '+1-555-0212', patient_id: P.p7  },
    { id: U.up8,  clinic_id: clinicId, email: 'kevin@patient.com',   password: 'patient123', role: 'patient', first_name: 'Kevin',   last_name: 'Moore',   phone: '+1-555-0213', patient_id: P.p8  },
    { id: U.up9,  clinic_id: clinicId, email: 'anna@patient.com',    password: 'patient123', role: 'patient', first_name: 'Anna',    last_name: 'Garcia',  phone: '+1-555-0214', patient_id: P.p9  },
    { id: U.up10, clinic_id: clinicId, email: 'brian@patient.com',   password: 'patient123', role: 'patient', first_name: 'Brian',   last_name: 'Thomas',  phone: '+1-555-0215', patient_id: P.p10 },
  ]);
}

async function seedDoctors() {
  await insert('doctors', [
    { id: D.d1,  clinic_id: clinicId, user_id: U.ud1,  first_name: 'Kareem',   last_name: 'Khalifa',   email: 'dr.kareem@healthsync.com',   phone: '+201111445265', specialty: 'Cardiology',       sub_specialty: 'Interventional Cardiology', department: 'Heart & Vascular',  consultation_fee: 750,  rating: 4.9, experience: 12, status: 'active', available_days: ['Monday','Tuesday','Wednesday','Thursday'], qualifications: ['MD','FACC'],     languages: ['English','Arabic']   },
    { id: D.d2,  clinic_id: clinicId, user_id: U.ud2,  first_name: 'James',    last_name: 'Mitchell',  email: 'dr.james@healthsync.com',    phone: '+1-555-0102',  specialty: 'Neurology',        sub_specialty: 'Stroke & Cerebrovascular',  department: 'Neurosciences',     consultation_fee: 900,  rating: 4.8, experience: 15, status: 'active', available_days: ['Monday','Wednesday','Friday'],             qualifications: ['MD','PhD'],      languages: ['English']            },
    { id: D.d3,  clinic_id: clinicId, user_id: U.ud3,  first_name: 'Priya',    last_name: 'Sharma',    email: 'dr.priya@healthsync.com',    phone: '+1-555-0103',  specialty: 'Pediatrics',       sub_specialty: 'Neonatology',               department: 'Pediatrics',        consultation_fee: 500,  rating: 4.7, experience: 8,  status: 'active', available_days: ['Tuesday','Thursday','Saturday'],           qualifications: ['MD','DCH'],      languages: ['English','Hindi']    },
    { id: D.d4,  clinic_id: clinicId, user_id: U.ud4,  first_name: 'Ahmed',    last_name: 'Hassan',    email: 'dr.ahmed@healthsync.com',    phone: '+1-555-0104',  specialty: 'Orthopedics',      sub_specialty: 'Sports Medicine',           department: 'Orthopedics',       consultation_fee: 1000, rating: 4.8, experience: 10, status: 'active', available_days: ['Monday','Tuesday','Thursday'],             qualifications: ['MD','FRCS'],     languages: ['English','Arabic']   },
    { id: D.d5,  clinic_id: clinicId, user_id: U.ud5,  first_name: 'Elena',    last_name: 'Vasquez',   email: 'dr.elena@healthsync.com',    phone: '+1-555-0105',  specialty: 'Dermatology',      sub_specialty: 'Cosmetic Dermatology',      department: 'Dermatology',       consultation_fee: 600,  rating: 4.6, experience: 7,  status: 'active', available_days: ['Wednesday','Friday'],                      qualifications: ['MD'],            languages: ['English','Spanish']  },
    { id: D.d6,  clinic_id: clinicId, user_id: U.ud6,  first_name: 'Robert',   last_name: 'Chen',      email: 'dr.robert@healthsync.com',   phone: '+1-555-0106',  specialty: 'Oncology',         sub_specialty: 'Medical Oncology',          department: 'Cancer Center',     consultation_fee: 1200, rating: 4.9, experience: 18, status: 'active', available_days: ['Monday','Wednesday','Friday'],             qualifications: ['MD','PhD'],      languages: ['English','Mandarin'] },
    { id: D.d7,  clinic_id: clinicId, user_id: U.ud7,  first_name: 'Fatima',   last_name: 'Al-Rashid', email: 'dr.fatima@healthsync.com',   phone: '+1-555-0107',  specialty: 'Ophthalmology',    sub_specialty: 'Retinal Surgery',           department: 'Eye Center',        consultation_fee: 800,  rating: 4.7, experience: 9,  status: 'active', available_days: ['Tuesday','Thursday'],                      qualifications: ['MD','FRCO'],     languages: ['English','Arabic']   },
    { id: D.d8,  clinic_id: clinicId, user_id: U.ud8,  first_name: 'Anita',    last_name: 'Patel',     email: 'dr.anita@healthsync.com',    phone: '+1-555-0111',  specialty: 'Psychiatry',       sub_specialty: 'Anxiety & Mood Disorders',  department: 'Mental Health',     consultation_fee: 700,  rating: 4.8, experience: 11, status: 'active', available_days: ['Monday','Tuesday','Wednesday'],            qualifications: ['MD','MRCPsych'], languages: ['English','Gujarati'] },
    { id: D.d9,  clinic_id: clinicId, user_id: U.ud9,  first_name: 'Jennifer', last_name: 'Kim',       email: 'dr.jennifer@healthsync.com', phone: '+1-555-0112',  specialty: 'Endocrinology',    sub_specialty: 'Diabetes & Thyroid',        department: 'Endocrinology',     consultation_fee: 800,  rating: 4.7, experience: 10, status: 'active', available_days: ['Wednesday','Thursday','Friday'],           qualifications: ['MD','FACE'],     languages: ['English','Korean']   },
    { id: D.d10, clinic_id: clinicId, user_id: U.ud10, first_name: 'Thomas',   last_name: 'Williams',  email: 'dr.thomas@healthsync.com',   phone: '+1-555-0113',  specialty: 'Gastroenterology', sub_specialty: 'IBD & Hepatology',          department: 'Gastroenterology',  consultation_fee: 850,  rating: 4.6, experience: 13, status: 'active', available_days: ['Monday','Thursday','Friday'],              qualifications: ['MD','FACG'],     languages: ['English']            },
  ]);
}

async function seedPatients() {
  await insert('patients', [
    { id: P.p1,  clinic_id: clinicId, user_id: U.up1,  first_name: 'John',    last_name: 'Smith',   email: 'john@patient.com',    phone: '+1-555-0201', date_of_birth: '1985-06-15', gender: 'male',   blood_group: 'O+',  address: '123 Main St, NY',    emergency_contact: { name: 'Jane Smith',    relationship: 'Spouse',  phone: '+1-555-0299' }, allergies: ['Penicillin'], chronic_conditions: ['Hypertension'],                      status: 'active', no_show_count: 0 },
    { id: P.p2,  clinic_id: clinicId, user_id: U.up2,  first_name: 'Emily',   last_name: 'Davis',   email: 'emily@patient.com',   phone: '+1-555-0202', date_of_birth: '1992-03-22', gender: 'female', blood_group: 'A+',  address: '456 Oak Ave, CA',    emergency_contact: { name: 'Mark Davis',    relationship: 'Brother', phone: '+1-555-0298' }, allergies: [],            chronic_conditions: [],                                    status: 'active', no_show_count: 0 },
    { id: P.p3,  clinic_id: clinicId, user_id: U.up3,  first_name: 'Michael', last_name: 'Brown',   email: 'michael@patient.com', phone: '+1-555-0203', date_of_birth: '1978-11-08', gender: 'male',   blood_group: 'B+',  address: '789 Pine Rd, TX',    emergency_contact: { name: 'Susan Brown',   relationship: 'Wife',    phone: '+1-555-0297' }, allergies: ['Sulfa'],     chronic_conditions: ['Type 2 Diabetes'],                   status: 'active', no_show_count: 0 },
    { id: P.p4,  clinic_id: clinicId, user_id: U.up4,  first_name: 'Sophia',  last_name: 'Chen',    email: 'sophia@patient.com',  phone: '+1-555-0204', date_of_birth: '1990-07-14', gender: 'female', blood_group: 'AB+', address: '321 Elm St, WA',     emergency_contact: { name: 'Wei Chen',      relationship: 'Father',  phone: '+1-555-0296' }, allergies: ['Aspirin'],   chronic_conditions: [],                                    status: 'active', no_show_count: 0 },
    { id: P.p5,  clinic_id: clinicId, user_id: U.up5,  first_name: 'Sarah',   last_name: 'Johnson', email: 'sarah@patient.com',   phone: '+1-555-0210', date_of_birth: '1988-09-12', gender: 'female', blood_group: 'A-',  address: '654 Maple Dr, IL',   emergency_contact: { name: 'Tom Johnson',   relationship: 'Husband', phone: '+1-555-0295' }, allergies: [],            chronic_conditions: ['Chronic Migraine'],                  status: 'active', no_show_count: 0 },
    { id: P.p6,  clinic_id: clinicId, user_id: U.up6,  first_name: 'David',   last_name: 'Wilson',  email: 'david@patient.com',   phone: '+1-555-0211', date_of_birth: '2020-05-20', gender: 'male',   blood_group: 'O-',  address: '987 Cedar Ln, FL',   emergency_contact: { name: 'Kate Wilson',   relationship: 'Mother',  phone: '+1-555-0294' }, allergies: [],            chronic_conditions: [],                                    status: 'active', no_show_count: 0 },
    { id: P.p7,  clinic_id: clinicId, user_id: U.up7,  first_name: 'Lisa',    last_name: 'Martin',  email: 'lisa@patient.com',    phone: '+1-555-0212', date_of_birth: '1965-12-03', gender: 'female', blood_group: 'B-',  address: '147 Birch Blvd, OH', emergency_contact: { name: 'Paul Martin',   relationship: 'Husband', phone: '+1-555-0293' }, allergies: ['Latex'],     chronic_conditions: ['Knee Osteoarthritis'],               status: 'active', no_show_count: 0 },
    { id: P.p8,  clinic_id: clinicId, user_id: U.up8,  first_name: 'Kevin',   last_name: 'Moore',   email: 'kevin@patient.com',   phone: '+1-555-0213', date_of_birth: '1995-02-28', gender: 'male',   blood_group: 'AB-', address: '258 Walnut St, CO',  emergency_contact: { name: 'Nancy Moore',   relationship: 'Mother',  phone: '+1-555-0292' }, allergies: [],            chronic_conditions: ['Generalized Anxiety'],               status: 'active', no_show_count: 0 },
    { id: P.p9,  clinic_id: clinicId, user_id: U.up9,  first_name: 'Anna',    last_name: 'Garcia',  email: 'anna@patient.com',    phone: '+1-555-0214', date_of_birth: '1972-08-17', gender: 'female', blood_group: 'A+',  address: '369 Spruce Ave, AZ', emergency_contact: { name: 'Carlos Garcia', relationship: 'Son',     phone: '+1-555-0291' }, allergies: ['Shellfish'], chronic_conditions: ['Type 2 Diabetes','Hypothyroidism'], status: 'active', no_show_count: 0 },
    { id: P.p10, clinic_id: clinicId, user_id: U.up10, first_name: 'Brian',   last_name: 'Thomas',  email: 'brian@patient.com',   phone: '+1-555-0215', date_of_birth: '1982-11-22', gender: 'male',   blood_group: 'O+',  address: '741 Ash Ct, GA',     emergency_contact: { name: 'Mary Thomas',   relationship: 'Wife',    phone: '+1-555-0290' }, allergies: [],            chronic_conditions: ['Acid Reflux'],                       status: 'active', no_show_count: 0 },
  ]);
}

async function seedAppointments() {
  await insert('appointments', [
    { id: A.a1,  clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d1,  appointment_date: '2026-03-18', appointment_time: '09:00', duration: 30, type: 'Checkup',        status: 'completed', reason: 'Routine cardiology checkup',         consultation_fee: 750,  fee: 750,  paid: true  },
    { id: A.a2,  clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d1,  appointment_date: '2026-03-19', appointment_time: '10:00', duration: 30, type: 'Follow-up',       status: 'completed', reason: 'Follow-up after ECG',                consultation_fee: 750,  fee: 750,  paid: true  },
    { id: A.a3,  clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d1,  appointment_date: '2026-02-12', appointment_time: '14:00', duration: 45, type: 'Annual Physical', status: 'completed', reason: 'Annual health screening',            consultation_fee: 750,  fee: 750,  paid: true  },
    { id: A.a4,  clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d2,  appointment_date: '2026-03-05', appointment_time: '10:00', duration: 30, type: 'Consultation',    status: 'completed', reason: 'Headache evaluation',                consultation_fee: 900,  fee: 900,  paid: false },
    { id: A.a5,  clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d1,  appointment_date: '2026-02-10', appointment_time: '14:30', duration: 30, type: 'Checkup',         status: 'completed', reason: 'Blood pressure monitoring',          consultation_fee: 750,  fee: 750,  paid: true  },
    { id: A.a6,  clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d1,  appointment_date: '2026-02-11', appointment_time: '09:30', duration: 30, type: 'Follow-up',       status: 'completed', reason: 'Medication adjustment',              consultation_fee: 750,  fee: 750,  paid: true  },
    { id: A.a7,  clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d1,  appointment_date: '2026-03-24', appointment_time: '16:30', duration: 30, type: 'Consultation',    status: 'completed', reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
    { id: A.a8,  clinic_id: clinicId, patient_id: P.p5,  doctor_id: D.d2,  appointment_date: '2026-04-10', appointment_time: '09:30', duration: 45, type: 'Consultation',    status: 'confirmed', reason: 'Severe headaches and vision changes', consultation_fee: 900,  fee: 900,  paid: true  },
    { id: A.a9,  clinic_id: clinicId, patient_id: P.p6,  doctor_id: D.d3,  appointment_date: '2026-04-12', appointment_time: '10:30', duration: 30, type: 'Checkup',         status: 'confirmed', reason: 'Annual well-child visit',            consultation_fee: 500,  fee: 500,  paid: false },
    { id: A.a10, clinic_id: clinicId, patient_id: P.p7,  doctor_id: D.d4,  appointment_date: '2026-04-08', appointment_time: '11:00', duration: 45, type: 'Follow-up',       status: 'confirmed', reason: 'Post-operative knee follow-up',      consultation_fee: 1000, fee: 1000, paid: true  },
    { id: A.a11, clinic_id: clinicId, patient_id: P.p8,  doctor_id: D.d8,  appointment_date: '2026-04-15', appointment_time: '14:00', duration: 60, type: 'Consultation',    status: 'confirmed', reason: 'Anxiety and stress management',      consultation_fee: 700,  fee: 700,  paid: true  },
    { id: A.a12, clinic_id: clinicId, patient_id: P.p9,  doctor_id: D.d9,  appointment_date: '2026-04-18', appointment_time: '09:00', duration: 30, type: 'Follow-up',       status: 'confirmed', reason: 'Diabetes management review',         consultation_fee: 800,  fee: 800,  paid: false },
    { id: A.a13, clinic_id: clinicId, patient_id: P.p10, doctor_id: D.d10, appointment_date: '2026-04-20', appointment_time: '15:30', duration: 30, type: 'Consultation',    status: 'confirmed', reason: 'Acid reflux symptoms',               consultation_fee: 850,  fee: 850,  paid: false },
    { id: A.a14, clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d1,  appointment_date: '2026-04-22', appointment_time: '10:00', duration: 30, type: 'Checkup',         status: 'completed', reason: 'Routine hypertension follow-up',     consultation_fee: 750,  fee: 750,  paid: false },
    { id: A.a15, clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d5,  appointment_date: '2026-04-05', appointment_time: '11:30', duration: 30, type: 'Consultation',    status: 'cancelled', reason: 'Skin rash evaluation',              consultation_fee: 600,  fee: 600,  paid: false },
    { id: A.a16, clinic_id: clinicId, patient_id: P.p4,  doctor_id: D.d6,  appointment_date: '2026-04-25', appointment_time: '14:00', duration: 60, type: 'Consultation',    status: 'confirmed', reason: 'Breast cancer screening follow-up',  consultation_fee: 1200, fee: 1200, paid: false },
    { id: A.a17, clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d4,  appointment_date: '2026-04-06', appointment_time: '14:00', duration: 30, type: 'Consultation',    status: 'confirmed', reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
    { id: A.a18, clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d4,  appointment_date: '2026-04-05', appointment_time: '17:00', duration: 30, type: 'Consultation',    status: 'confirmed', reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
    { id: A.a19, clinic_id: clinicId, patient_id: P.p8,  doctor_id: D.d1,  appointment_date: '2026-05-09', appointment_time: '15:30', duration: 30, type: 'Follow-up',       status: 'confirmed', reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
    { id: A.a20, clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d1,  appointment_date: '2026-05-27', appointment_time: '09:00', duration: 30, type: 'Consultation',    status: 'completed', reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
    { id: A.a21, clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d4,  appointment_date: '2026-05-21', appointment_time: '09:00', duration: 30, type: 'Consultation',    status: 'pending',   reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
    { id: A.a22, clinic_id: clinicId, patient_id: P.p10, doctor_id: D.d1,  appointment_date: '2026-05-31', appointment_time: '12:30', duration: 30, type: 'Consultation',    status: 'pending',   reason: '',                                   consultation_fee: 0,    fee: 0,    paid: false },
  ]);
}

async function seedMedicalRecords() {
  await insert('medical_records', [
    { id: MR.mr1, clinic_id: clinicId, patient_id: P.p1, doctor_id: D.d1, appointment_id: A.a5,  diagnosis: 'Controlled Hypertension',            notes: 'BP normal. Good compliance. Continue treatment.',            follow_up_date: '2026-05-10' },
    { id: MR.mr2, clinic_id: clinicId, patient_id: P.p3, doctor_id: D.d1, appointment_id: A.a3,  diagnosis: 'Type 2 Diabetes — Controlled',       notes: 'HbA1c 7.5% → 6.8%. Continue medication and diet.',         follow_up_date: '2026-04-20' },
    { id: MR.mr3, clinic_id: clinicId, patient_id: P.p5, doctor_id: D.d2, appointment_id: A.a8,  diagnosis: 'Chronic Migraine',                   notes: '4-5 migraine days/month. Started preventive therapy.',      follow_up_date: '2026-05-22' },
    { id: MR.mr4, clinic_id: clinicId, patient_id: P.p7, doctor_id: D.d4, appointment_id: A.a10, diagnosis: 'Post-operative Knee Recovery',        notes: 'ROM improving. Recovering well from total knee replacement.',follow_up_date: '2026-05-06' },
    { id: MR.mr5, clinic_id: clinicId, patient_id: P.p8, doctor_id: D.d8, appointment_id: A.a11, diagnosis: 'Generalized Anxiety Disorder',        notes: 'Started SSRI. Follow-up in 4 weeks.',                      follow_up_date: '2026-05-13' },
    { id: MR.mr6, clinic_id: clinicId, patient_id: P.p9, doctor_id: D.d9, appointment_id: A.a12, diagnosis: 'Type 2 Diabetes with Hypothyroidism', notes: 'Both conditions need monitoring. Medications adjusted.',    follow_up_date: '2026-07-18' },
  ]);
}

async function seedPayments() {
  await insert('payments', [
    { id: PAY.pay1, clinic_id: clinicId, appointment_id: A.a5,  amount: 750,  method: 'Credit Card', received_at: '2026-02-10T15:15:00Z', notes: 'Insurance claimed'                },
    { id: PAY.pay2, clinic_id: clinicId, appointment_id: A.a1,  amount: 750,  method: 'pending',     received_at: null,                    notes: 'Pending'                          },
    { id: PAY.pay3, clinic_id: clinicId, appointment_id: A.a3,  amount: 750,  method: 'Insurance',   received_at: '2026-02-12T16:00:00Z', notes: 'Insurance paid in full'           },
    { id: PAY.pay4, clinic_id: clinicId, appointment_id: A.a8,  amount: 900,  method: 'Credit Card', received_at: '2026-04-10T10:00:00Z', notes: 'Insurance $720 + patient $180'    },
    { id: PAY.pay5, clinic_id: clinicId, appointment_id: A.a9,  amount: 500,  method: 'Insurance',   received_at: null,                    notes: 'Pending insurance'                },
    { id: PAY.pay6, clinic_id: clinicId, appointment_id: A.a10, amount: 1000, method: 'Medicare',    received_at: '2026-04-08T12:30:00Z', notes: 'Medicare $800 + patient $200'     },
    { id: PAY.pay7, clinic_id: clinicId, appointment_id: A.a11, amount: 700,  method: 'Credit Card', received_at: '2026-04-15T13:45:00Z', notes: 'Full payment, no insurance'       },
    { id: PAY.pay8, clinic_id: clinicId, appointment_id: A.a15, amount: 600,  method: 'refunded',    received_at: '2026-03-25T09:00:00Z', notes: 'Refunded — appointment cancelled' },
  ]);
}

async function seedNotifications() {
  await insert('notifications', [
    { clinic_id: clinicId, user_id: U.ud1,   appointment_id: A.a1,  message: 'You have an appointment with John Smith on Mar 18.',    type: 'appointment', read: true  },
    { clinic_id: clinicId, user_id: U.up1,   appointment_id: A.a1,  message: 'Your appointment with Dr. Kareem is confirmed.',         type: 'appointment', read: true  },
    { clinic_id: clinicId, user_id: U.ud2,   appointment_id: A.a8,  message: 'You have an appointment with Sarah Johnson on Apr 10.', type: 'appointment', read: false },
    { clinic_id: clinicId, user_id: U.up5,   appointment_id: A.a8,  message: 'Your appointment with Dr. James is confirmed.',         type: 'appointment', read: false },
    { clinic_id: clinicId, user_id: U.up3,   appointment_id: A.a21, message: 'Reminder: appointment tomorrow at 9:00 AM.',            type: 'reminder',    read: false },
    { clinic_id: clinicId, user_id: U.admin, appointment_id: null,  message: 'New patient registered: Brian Thomas.',                 type: 'alert',       read: false },
  ]);
}

async function main() {
  console.log('\n🚀  HealthSync — Full Migration\n' + '─'.repeat(44));
  await seedClinic();
  await seedUsers();
  await seedDoctors();
  await seedPatients();
  await seedAppointments();
  await seedMedicalRecords();
  await seedPayments();
  await seedNotifications();

  console.log('\n✅  Done!\n');
  console.log('📋  clinicId →', clinicId);
  console.log('\n🔑  Credentials:');
  console.log('    Admin        → kareem@healthsync.com    / admin123');
  console.log('    Doctor       → dr.kareem@healthsync.com / doctor123');
  console.log('    Receptionist → lisa@healthsync.com      / recep123');
  console.log('    Patient      → john@patient.com         / patient123\n');
}

main().catch(err => { console.error('✘', err); process.exit(1); });