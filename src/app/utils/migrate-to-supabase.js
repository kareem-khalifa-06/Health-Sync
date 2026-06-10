
const ws = require('ws');
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://ldvcweeokaxvydfbofjf.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkdmN3ZWVva2F4dnlkZmJvZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDcxMTAsImV4cCI6MjA5NjU4MzExMH0.cDg2Tnyqvr8rFh3-zAd8p5RPBihnMU2kMq1Lceg8Qzg'; 
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  realtime: { transport: ws }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const uuid = () => randomUUID();
const log  = (msg) => console.log(`\n✔  ${msg}`);
const warn = (msg) => console.warn(`⚠  ${msg}`);

async function insert(table, rows) {
  if (!rows.length) { warn(`No rows for ${table}, skipping.`); return; }
  const { error } = await supabase.from(table).insert(rows);
  if (error) { console.error(`✘  ${table}:`, error.message); process.exit(1); }
  log(`${table} — inserted ${rows.length} row(s)`);
}

// ── ID maps (old string → new UUID) ──────────────────────────────────────────
const clinicId = uuid();           // single demo clinic

// patients:  p1 … p10
const P = {};
['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10'].forEach(k => P[k] = uuid());

// doctors in users table: d1 … d10
const D = {};
['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10'].forEach(k => D[k] = uuid());

// appointments: a1 … a22
const A = {};
for (let i = 1; i <= 22; i++) A[`a${i}`] = uuid();

// medical records: mr1 … mr6
const MR = {};
for (let i = 1; i <= 6; i++) MR[`mr${i}`] = uuid();

// prescriptions: rx1 … rx5
const RX = {};
for (let i = 1; i <= 5; i++) RX[`rx${i}`] = uuid();

// payments: pay1 … pay8
const PAY = {};
for (let i = 1; i <= 8; i++) PAY[`pay${i}`] = uuid();

// ── 1. Clinics ────────────────────────────────────────────────────────────────
async function seedClinics() {
  await insert('clinics', [{
    id:           clinicId,
    name:         'HealthSync Demo Clinic',
    slug:         'healthsync-demo',
    phone:        '+201090222247',
    address:      'New York, NY',
    plan:         'trial',
    trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
  }]);
}

// ── 2. Users (doctors + admin + receptionist) ─────────────────────────────────
// We insert into our public `users` table (no auth.users link yet — dev phase)
async function seedUsers() {
  const rows = [
    // Admin
    { id: uuid(), clinic_id: clinicId, full_name: 'Admin User',        role: 'admin',         phone: '+201090222247', specialization: null },
    // Receptionist
    { id: uuid(), clinic_id: clinicId, full_name: 'Lisa Martinez',     role: 'receptionist',  phone: '+1-555-0110', specialization: null },

    // Doctors (mapped to D[])
    { id: D.d1,  clinic_id: clinicId, full_name: 'Dr. Kareem Khalifa',   role: 'doctor', phone: '+201111445265', specialization: 'Cardiology'       },
    { id: D.d2,  clinic_id: clinicId, full_name: 'Dr. James Mitchell',   role: 'doctor', phone: '+1-555-0102', specialization: 'Neurology'        },
    { id: D.d3,  clinic_id: clinicId, full_name: 'Dr. Priya Sharma',     role: 'doctor', phone: '+1-555-0103', specialization: 'Pediatrics'       },
    { id: D.d4,  clinic_id: clinicId, full_name: 'Dr. Ahmed Hassan',     role: 'doctor', phone: '+1-555-0104', specialization: 'Orthopedics'      },
    { id: D.d5,  clinic_id: clinicId, full_name: 'Dr. Elena Vasquez',    role: 'doctor', phone: '+1-555-0105', specialization: 'Dermatology'      },
    { id: D.d6,  clinic_id: clinicId, full_name: 'Dr. Robert Chen',      role: 'doctor', phone: '+1-555-0106', specialization: 'Oncology'         },
    { id: D.d7,  clinic_id: clinicId, full_name: 'Dr. Fatima Al-Rashid', role: 'doctor', phone: '+1-555-0107', specialization: 'Ophthalmology'    },
    { id: D.d8,  clinic_id: clinicId, full_name: 'Dr. Anita Patel',      role: 'doctor', phone: '+1-555-0111', specialization: 'Psychiatry'       },
    { id: D.d9,  clinic_id: clinicId, full_name: 'Dr. Jennifer Kim',     role: 'doctor', phone: '+1-555-0112', specialization: 'Endocrinology'    },
    { id: D.d10, clinic_id: clinicId, full_name: 'Dr. Thomas Williams',  role: 'doctor', phone: '+1-555-0113', specialization: 'Gastroenterology' },
  ];
  await insert('users', rows);
}

// ── 3. Patients ───────────────────────────────────────────────────────────────
async function seedPatients() {
  const rows = [
    { id: P.p1,  clinic_id: clinicId, full_name: 'John Smith',    phone: '+1-555-0201', date_of_birth: '1985-06-15', gender: 'male',   blood_type: 'O+', no_show_count: 0 },
    { id: P.p2,  clinic_id: clinicId, full_name: 'Emily Davis',   phone: '+1-555-0202', date_of_birth: '1992-03-22', gender: 'female', blood_type: 'A+', no_show_count: 0 },
    { id: P.p3,  clinic_id: clinicId, full_name: 'Michael Brown', phone: '+1-555-0203', date_of_birth: '1978-11-08', gender: 'male',   blood_type: 'B+', no_show_count: 0 },
    { id: P.p4,  clinic_id: clinicId, full_name: 'Sophia Chen',   phone: '+1-555-0204', date_of_birth: '1990-07-14', gender: 'female', blood_type: 'AB+', no_show_count: 0 },
    { id: P.p5,  clinic_id: clinicId, full_name: 'Sarah Johnson', phone: '+1-555-0210', date_of_birth: '1988-09-12', gender: 'female', blood_type: 'A-', no_show_count: 0 },
    { id: P.p6,  clinic_id: clinicId, full_name: 'David Wilson',  phone: '+1-555-0211', date_of_birth: '2020-05-20', gender: 'male',   blood_type: 'O-', no_show_count: 0 },
    { id: P.p7,  clinic_id: clinicId, full_name: 'Lisa Martin',   phone: '+1-555-0212', date_of_birth: '1965-12-03', gender: 'female', blood_type: 'B-', no_show_count: 0 },
    { id: P.p8,  clinic_id: clinicId, full_name: 'Kevin Moore',   phone: '+1-555-0213', date_of_birth: '1995-02-28', gender: 'male',   blood_type: 'AB-', no_show_count: 0 },
    { id: P.p9,  clinic_id: clinicId, full_name: 'Anna Garcia',   phone: '+1-555-0214', date_of_birth: '1972-08-17', gender: 'female', blood_type: 'A+', no_show_count: 0 },
    { id: P.p10, clinic_id: clinicId, full_name: 'Brian Thomas',  phone: '+1-555-0215', date_of_birth: '1982-11-22', gender: 'male',   blood_type: 'O+', no_show_count: 0 },
  ];
  await insert('patients', rows);
}

// ── 4. Appointments ───────────────────────────────────────────────────────────
async function seedAppointments() {
  const rows = [
    { id: A.a1,  clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d1, scheduled_at: '2026-03-18T09:00:00Z', type: 'Checkup',        status: 'completed',  fee: 750,  paid: true,  notes: 'Routine cardiology checkup' },
    { id: A.a2,  clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d1, scheduled_at: '2026-03-19T10:00:00Z', type: 'Follow-up',       status: 'completed',  fee: 750,  paid: true,  notes: 'Follow-up after ECG' },
    { id: A.a3,  clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d1, scheduled_at: '2026-02-12T14:00:00Z', type: 'Annual Physical', status: 'completed',  fee: 750,  paid: true,  notes: 'Annual health screening' },
    { id: A.a4,  clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d2, scheduled_at: '2026-03-05T10:00:00Z', type: 'Consultation',    status: 'completed',  fee: 900,  paid: false, notes: 'Headache evaluation' },
    { id: A.a5,  clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d1, scheduled_at: '2026-02-10T14:30:00Z', type: 'Checkup',         status: 'completed',  fee: 750,  paid: true,  notes: 'Blood pressure monitoring' },
    { id: A.a6,  clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d1, scheduled_at: '2026-02-11T09:30:00Z', type: 'Follow-up',       status: 'completed',  fee: 750,  paid: true,  notes: 'Medication adjustment' },
    { id: A.a7,  clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d1, scheduled_at: '2026-03-24T16:30:00Z', type: 'Consultation',    status: 'completed',  fee: 0,    paid: false, notes: '' },
    { id: A.a8,  clinic_id: clinicId, patient_id: P.p5,  doctor_id: D.d2, scheduled_at: '2026-04-10T09:30:00Z', type: 'Consultation',    status: 'confirmed',  fee: 900,  paid: true,  notes: 'Severe headaches and vision changes' },
    { id: A.a9,  clinic_id: clinicId, patient_id: P.p6,  doctor_id: D.d3, scheduled_at: '2026-04-12T10:30:00Z', type: 'Checkup',         status: 'confirmed',  fee: 500,  paid: false, notes: 'Annual well-child visit' },
    { id: A.a10, clinic_id: clinicId, patient_id: P.p7,  doctor_id: D.d4, scheduled_at: '2026-04-08T11:00:00Z', type: 'Follow-up',       status: 'confirmed',  fee: 1000, paid: true,  notes: 'Post-operative knee follow-up' },
    { id: A.a11, clinic_id: clinicId, patient_id: P.p8,  doctor_id: D.d8, scheduled_at: '2026-04-15T14:00:00Z', type: 'Consultation',    status: 'confirmed',  fee: 700,  paid: true,  notes: 'Anxiety and stress management' },
    { id: A.a12, clinic_id: clinicId, patient_id: P.p9,  doctor_id: D.d9, scheduled_at: '2026-04-18T09:00:00Z', type: 'Follow-up',       status: 'confirmed',  fee: 800,  paid: false, notes: 'Diabetes management review' },
    { id: A.a13, clinic_id: clinicId, patient_id: P.p10, doctor_id: D.d10,scheduled_at: '2026-04-20T15:30:00Z', type: 'Consultation',    status: 'confirmed',  fee: 850,  paid: false, notes: 'Acid reflux symptoms' },
    { id: A.a14, clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d1, scheduled_at: '2026-04-22T10:00:00Z', type: 'Checkup',         status: 'completed',  fee: 750,  paid: false, notes: 'Routine hypertension follow-up' },
    { id: A.a15, clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d5, scheduled_at: '2026-04-05T11:30:00Z', type: 'Consultation',    status: 'cancelled',  fee: 600,  paid: false, notes: 'Skin rash evaluation' },
    { id: A.a16, clinic_id: clinicId, patient_id: P.p4,  doctor_id: D.d6, scheduled_at: '2026-04-25T14:00:00Z', type: 'Consultation',    status: 'confirmed',  fee: 1200, paid: false, notes: 'Breast cancer screening follow-up' },
    { id: A.a17, clinic_id: clinicId, patient_id: P.p1,  doctor_id: D.d4, scheduled_at: '2026-04-06T14:00:00Z', type: 'Consultation',    status: 'confirmed',  fee: 0,    paid: false, notes: '' },
    { id: A.a18, clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d4, scheduled_at: '2026-04-05T17:00:00Z', type: 'Consultation',    status: 'confirmed',  fee: 0,    paid: false, notes: '' },
    { id: A.a19, clinic_id: clinicId, patient_id: P.p8,  doctor_id: D.d1, scheduled_at: '2026-05-09T15:30:00Z', type: 'Follow-up',       status: 'confirmed',  fee: 0,    paid: false, notes: '' },
    { id: A.a20, clinic_id: clinicId, patient_id: P.p2,  doctor_id: D.d1, scheduled_at: '2026-05-27T09:00:00Z', type: 'Consultation',    status: 'completed',  fee: 0,    paid: false, notes: '' },
    { id: A.a21, clinic_id: clinicId, patient_id: P.p3,  doctor_id: D.d4, scheduled_at: '2026-05-21T09:00:00Z', type: 'Consultation',    status: 'pending',    fee: 0,    paid: false, notes: '' },
    { id: A.a22, clinic_id: clinicId, patient_id: P.p10, doctor_id: D.d1, scheduled_at: '2026-05-31T12:30:00Z', type: 'Consultation',    status: 'pending',    fee: 0,    paid: false, notes: '' },
  ];
  await insert('appointments', rows);
}

// ── 5. Medical Records ────────────────────────────────────────────────────────
async function seedMedicalRecords() {
  const rows = [
    {
      id: MR.mr1, clinic_id: clinicId,
      patient_id: P.p1, doctor_id: D.d1, appointment_id: A.a5,
      diagnosis: 'Controlled Hypertension',
      notes: 'BP within normal range. Patient shows good compliance. Continue current treatment.',
      follow_up_date: '2026-05-10',
    },
    {
      id: MR.mr2, clinic_id: clinicId,
      patient_id: P.p3, doctor_id: D.d1, appointment_id: A.a3,
      diagnosis: 'Type 2 Diabetes — Controlled',
      notes: 'HbA1c improved from 7.5% to 6.8%. Continue medication and diet plan.',
      follow_up_date: '2026-04-20',
    },
    {
      id: MR.mr3, clinic_id: clinicId,
      patient_id: P.p5, doctor_id: D.d2, appointment_id: A.a8,
      diagnosis: 'Chronic Migraine',
      notes: 'Patient reports 4-5 migraine days per month. Started on preventive therapy.',
      follow_up_date: '2026-05-22',
    },
    {
      id: MR.mr4, clinic_id: clinicId,
      patient_id: P.p7, doctor_id: D.d4, appointment_id: A.a10,
      diagnosis: 'Post-operative Knee Recovery',
      notes: 'Range of motion improving. Patient recovering well from total knee replacement.',
      follow_up_date: '2026-05-06',
    },
    {
      id: MR.mr5, clinic_id: clinicId,
      patient_id: P.p8, doctor_id: D.d8, appointment_id: A.a11,
      diagnosis: 'Generalized Anxiety Disorder',
      notes: 'Anxiety affecting work performance. Started on SSRI. Follow-up in 4 weeks.',
      follow_up_date: '2026-05-13',
    },
    {
      id: MR.mr6, clinic_id: clinicId,
      patient_id: P.p9, doctor_id: D.d9, appointment_id: A.a12,
      diagnosis: 'Type 2 Diabetes with Hypothyroidism',
      notes: 'Both levels need monitoring. Medication adjustments made.',
      follow_up_date: '2026-07-18',
    },
  ];
  await insert('medical_records', rows);
}

// ── 6. Prescriptions ──────────────────────────────────────────────────────────
async function seedPrescriptions() {
  const rows = [
    { id: RX.rx1, clinic_id: clinicId, record_id: MR.mr1, medication: 'Lisinopril',     dosage: '10mg',  frequency: 'Once daily in the morning',          duration_days: 90,  notes: 'Generic substitution allowed' },
    { id: RX.rx2, clinic_id: clinicId, record_id: MR.mr2, medication: 'Metformin',      dosage: '500mg', frequency: 'Twice daily with meals',             duration_days: 180, notes: 'Brand name required' },
    { id: RX.rx3, clinic_id: clinicId, record_id: MR.mr3, medication: 'Sumatriptan',    dosage: '50mg',  frequency: 'As needed at onset of migraine',     duration_days: 30,  notes: 'Do not exceed 2 tablets in 24 hours' },
    { id: RX.rx4, clinic_id: clinicId, record_id: MR.mr3, medication: 'Propranolol',    dosage: '40mg',  frequency: 'Once daily',                         duration_days: 90,  notes: 'May cause drowsiness' },
    { id: RX.rx5, clinic_id: clinicId, record_id: MR.mr5, medication: 'Sertraline',     dosage: '50mg',  frequency: 'Once daily',                         duration_days: 180, notes: 'Do not stop abruptly. Take 2-4 weeks to feel full effect.' },
    { id: RX.rx5, clinic_id: clinicId, record_id: MR.mr6, medication: 'Levothyroxine',  dosage: '88mcg', frequency: 'Once daily on empty stomach',        duration_days: 180, notes: 'Take 30-60 minutes before breakfast' },
  ];
  // rx5 is used twice in source data — give second one a new UUID
  rows[5].id = uuid();
  await insert('prescriptions', rows);
}

// ── 7. Payments ───────────────────────────────────────────────────────────────
async function seedPayments() {
  const rows = [
    { id: PAY.pay1, clinic_id: clinicId, appointment_id: A.a5,  amount: 750,  method: 'Credit Card', received_at: '2026-02-10T15:15:00Z', notes: 'Insurance claimed' },
    { id: PAY.pay2, clinic_id: clinicId, appointment_id: A.a1,  amount: 750,  method: 'pending',     received_at: null,                    notes: 'Pending' },
    { id: PAY.pay3, clinic_id: clinicId, appointment_id: A.a3,  amount: 750,  method: 'Insurance',   received_at: '2026-02-12T16:00:00Z', notes: 'Insurance paid in full' },
    { id: PAY.pay4, clinic_id: clinicId, appointment_id: A.a8,  amount: 900,  method: 'Credit Card', received_at: '2026-04-10T10:00:00Z', notes: 'Insurance claimed $720, patient $180' },
    { id: PAY.pay5, clinic_id: clinicId, appointment_id: A.a9,  amount: 500,  method: 'Insurance',   received_at: null,                    notes: 'Pending insurance' },
    { id: PAY.pay6, clinic_id: clinicId, appointment_id: A.a10, amount: 1000, method: 'Medicare',    received_at: '2026-04-08T12:30:00Z', notes: 'Medicare paid $800, patient $200' },
    { id: PAY.pay7, clinic_id: clinicId, appointment_id: A.a11, amount: 700,  method: 'Credit Card', received_at: '2026-04-15T13:45:00Z', notes: 'Full payment, no insurance' },
    { id: PAY.pay8, clinic_id: clinicId, appointment_id: A.a15, amount: 600,  method: 'refunded',    received_at: '2026-03-25T09:00:00Z', notes: 'Refunded — appointment cancelled' },
  ];
  await insert('payments', rows);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀  HealthSync — Supabase Migration\n' + '─'.repeat(40));

//   if (SUPABASE_ANON === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkdmN3ZWVva2F4dnlkZmJvZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDcxMTAsImV4cCI6MjA5NjU4MzExMH0.cDg2Tnyqvr8rFh3-zAd8p5RPBihnMU2kMq1Lceg8Qzg') {
//     console.error('✘  Please set SUPABASE_ANON_KEY in the script before running.');
//     process.exit(1);
//   }

  await seedClinics();
  await seedUsers();
  await seedPatients();
  await seedAppointments();
  await seedMedicalRecords();
  await seedPrescriptions();
  await seedPayments();

  console.log('\n✅  Migration complete! All data is in Supabase.\n');
  console.log('📋  Clinic ID (save this):', clinicId);
  console.log('    Paste it in your Angular environment.ts if you need it.\n');
}

main().catch(err => {
  console.error('✘  Unexpected error:', err);
  process.exit(1);
});