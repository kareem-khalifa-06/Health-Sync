// migrate-to-supabase.js
// Place this file in the same directory as db.json, then run:
//   node migrate-to-supabase.js

const { createClient } = require("@supabase/supabase-js");
const { randomUUID } = require("crypto");
const ws = require("ws");
const fs = require("fs");
const path = require("path");

// ── Supabase credentials ──────────────────────────────────────────
const SUPABASE_URL = "https://zqxdqqjzowelpxgsldhq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeGRxcWp6b3dlbHB4Z3NsZGhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI4MzM3MCwiZXhwIjoyMDk2ODU5MzcwfQ.dBMWCLP6nIYMY-So0Km0c4D37aQ8i83M4d3ZhnsJc6Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

// ── Read db.json ──────────────────────────────────────────────────
const dbPath = path.join(__dirname, "db.json");
let db;
try {
  db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  console.log("✔  db.json loaded\n");
} catch (err) {
  console.error("✘  Could not read db.json:", err.message);
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────
const uuid = () => randomUUID();
const log = (msg) => console.log(`✔  ${msg}`);

async function insert(table, rows) {
  if (!rows || !rows.length) {
    console.log(`⚠  ${table} — no rows, skipping`);
    return;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.error(`✘  ${table}:`, error.message);
    process.exit(1);
  }
  log(`${table} — ${rows.length} row(s)`);
}

async function wipe() {
  // Delete in FK-safe order (children first, parents last)
  const tables = [
    "notifications",
    "payments",
    "medical_records",
    "appointments",
    "doctor_reviews",
    "doctor_schedules",
    "doctors",
    "patients",
    "users",
    "clinics",
  ];
  for (const t of tables) {
    const { error } = await supabase
      .from(t)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.warn(`  ⚠  wipe ${t}: ${error.message}`);
  }
  log("all tables wiped");
}

async function wipeAuthUsers() {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    const users = data.users || [];
    if (!users.length) break;

    for (const user of users) {
      await supabase.auth.admin.deleteUser(user.id);
      console.log(`🗑 Deleted auth user: ${user.email}`);
    }

    page++;
  }

  log("all auth users wiped");
}

// ── ID maps: old string IDs ("d1","p1") → new UUIDs ──────────────
function buildMap(collection) {
  const map = {};
  (db[collection] || []).forEach((r) => {
    map[r.id] = uuid();
  });
  return map;
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log("🚀  HealthSync — Migration from db.json\n" + "─".repeat(44));

  await wipeAuthUsers();
  await wipe();

  const clinicId = uuid();

  // 1. Create auth users and build userMap (old id → auth user id)
  const userMap = {};
  console.log("Creating auth users...");
  for (const u of db.users || []) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password || "default123",
      email_confirm: true,
    });

    if (error) {
      console.error(`Auth creation failed for ${u.email}:`, error.message);
      process.exit(1);
    }

    userMap[u.id] = data.user.id;
  }
  log(`auth users created: ${Object.keys(userMap).length}`);

  // Pre-generate all other UUIDs so FK references are consistent
  const doctorMap = buildMap("doctors");
  const patientMap = buildMap("patients");
  const appointmentMap = buildMap("appointments");
  const recordMap = buildMap("medicalRecords");

  // ── 1. Clinic ────────────────────────────────────────────────────
  await insert("clinics", [
    {
      id: clinicId,
      name: "HealthSync Demo Clinic",
      slug: "healthsync-demo",
      phone: "+201090222247",
      address: "Cairo, Egypt",
      plan: "trial",
      trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
  ]);

  // ── 2. Users ─────────────────────────────────────────────────────
  const userRows = (db.users || []).map((u) => ({
    id: userMap[u.id], // uses auth user UUID
    clinic_id: clinicId,
    email: u.email || "",
    password: u.password || "default123",
    role: u.role || "admin",
    first_name: u.firstName || u.first_name || "",
    last_name: u.lastName || u.last_name || "",
    phone: u.phone || "",
    avatar: u.avatar || "",
    doctor_id: u.doctorId ? doctorMap[u.doctorId] : null,
    patient_id: u.patientId ? patientMap[u.patientId] : null,
  }));
  await insert("users", userRows);

  // ── 3. Doctors ───────────────────────────────────────────────────
  const doctorRows = (db.doctors || []).map((d) => ({
    id: doctorMap[d.id],
    clinic_id: clinicId,
    user_id: d.userId ? userMap[d.userId] : null,
    first_name: d.firstName || "",
    last_name: d.lastName || "",
    avatar_url: d.avatarUrl || "",
    email: d.email || "",
    phone: d.phone || "",
    bio: d.bio || "",
    specialty: d.specialty || d.specialization || "",
    sub_specialty: d.subSpecialty || "",
    department: d.department || "",
    hospital: d.hospital || "",
    location: d.location || "",
    qualifications: d.qualifications || [],
    languages: d.languages || [],
    services: d.services || [],
    education: d.education || [],
    achievements: d.achievements || [],
    experience: d.experience || 0,
    total_patients: d.totalPatients || 0,
    rating: d.rating || 0,
    total_reviews: d.totalReviews || 0,
    consultation_fee: d.consultationFee || 0,
    status: d.status || "active",
    is_available_today: d.isAvailableToday ?? true,
    available_days: d.availableDays || [],
    available_time_slots: d.availableTimeSlots || [],
  }));
  await insert("doctors", doctorRows);

  // ── 4. Patients ──────────────────────────────────────────────────
  const patientRows = (db.patients || []).map((p) => ({
    id: patientMap[p.id],
    clinic_id: clinicId,
    user_id: p.userId ? userMap[p.userId] : null,
    first_name: p.firstName || "",
    last_name: p.lastName || "",
    avatar_url: p.avatarUrl || "",
    date_of_birth: p.dateOfBirth || null,
    gender: p.gender || "male",
    address: p.address || "",
    email: p.email || "",
    phone: p.phone || "",
    emergency_contact: p.emergencyContact || {},
    insurance_provider: p.insuranceProvider || "",
    insurance_number: p.insuranceNumber || "",
    blood_group: p.bloodGroup || p.bloodType || "",
    allergies: p.allergies || [],
    chronic_conditions: p.chronicConditions || [],
    current_medications: p.currentMedications || [],
    registered_date: p.registeredDate || new Date().toISOString(),
    last_visit: p.lastVisit || null,
    status: p.status || "active",
    no_show_count: p.noShowCount || 0,
  }));
  await insert("patients", patientRows);

  // ── 5. Doctor Schedules ──────────────────────────────────────────
  const scheduleRows = (db.doctorSchedules || [])
    .map((s) => ({
      id: uuid(),
      clinic_id: clinicId,
      doctor_id: doctorMap[s.doctorId] || null,
      day: s.day || "",
      day_short: s.dayShort || "",
      date: s.date || null,
      enabled: s.enabled ?? true,
      slots: s.slots || [],
    }))
    .filter((s) => s.doctor_id);
  await insert("doctor_schedules", scheduleRows);

  // ── 6. Doctor Reviews ────────────────────────────────────────────
  const reviewRows = (db.doctorReviews || [])
    .map((r) => ({
      id: uuid(),
      clinic_id: clinicId,
      doctor_id: doctorMap[r.doctorId] || null,
      patient_id: patientMap[r.patientId] || null,
      patient_name: r.patientName || "",
      patient_initials: r.patientInitials || "",
      rating: r.rating || 0,
      comment: r.comment || "",
      date: r.date || null,
    }))
    .filter((r) => r.doctor_id);
  await insert("doctor_reviews", reviewRows);

  // ── 7. Appointments ──────────────────────────────────────────────
  const appointmentRows = (db.appointments || [])
    .map((a) => ({
      id: appointmentMap[a.id],
      clinic_id: clinicId,
      patient_id: patientMap[a.patientId] || null,
      doctor_id: doctorMap[a.doctorId] || null,
      appointment_date: a.appointmentDate || null,
      appointment_time: a.appointmentTime || "",
      duration: a.duration || 30,
      type: a.type || "",
      status: a.status || "pending",
      reason: a.reason || "",
      notes: a.notes || "",
      slot_id: a.slotId || "",
      consultation_fee: a.consultationFee || 0,
      fee: a.fee || a.consultationFee || 0,
      paid: a.paid ?? false,
      paid_at: a.paidAt || null,
    }))
    .filter((a) => a.patient_id && a.doctor_id);
  await insert("appointments", appointmentRows);

  // ── 8. Medical Records ───────────────────────────────────────────
  const recordRows = (db.medicalRecords || [])
    .map((r) => ({
      id: recordMap[r.id],
      clinic_id: clinicId,
      patient_id: patientMap[r.patientId] || null,
      doctor_id: doctorMap[r.doctorId] || null,
      appointment_id: r.appointmentId ? appointmentMap[r.appointmentId] : null,
      diagnosis: r.diagnosis || "",
      symptoms: r.symptoms || [],
      vital_signs: r.vitalSigns || {},
      prescriptions: r.prescription || [],
      lab_tests: r.labTests || [],
      notes: r.notes || "",
      follow_up_date: r.followUpDate || null,
    }))
    .filter((r) => r.patient_id);
  await insert("medical_records", recordRows);

  // ── 9. Payments ──────────────────────────────────────────────────
  const paymentRows = (db.payments || []).map((p) => ({
    id: uuid(),
    clinic_id: clinicId,
    appointment_id: p.appointmentId ? appointmentMap[p.appointmentId] : null,
    amount: p.amount || 0,
    method: p.method || "",
    received_at: p.receivedAt || null,
    notes: p.notes || "",
  }));
  await insert("payments", paymentRows);

  // ── 10. Notifications ────────────────────────────────────────────
  const notificationRows = (db.notifications || [])
    .map((n) => ({
      id: uuid(),
      clinic_id: clinicId,
      user_id: userMap[n.userId] || null,
      appointment_id: n.appointmentId ? appointmentMap[n.appointmentId] : null,
      message: n.message || "",
      type: n.type || "appointment",
      read: n.read ?? false,
    }))
    .filter((n) => n.user_id);
  await insert("notifications", notificationRows);

  // ── Verification ─────────────────────────────────────────────────
  const { count: userCount, error: countErr } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  if (countErr) {
    console.warn('⚠  Could not verify user count:', countErr.message);
  } else {
    console.log(`✔  Verification: ${userCount} users in public.users`);
  }

  // ── Done ─────────────────────────────────────────────────────────
  console.log("\n✅  Migration complete!");
  console.log("\n📋  Clinic ID — paste this in environment.ts as clinicId:");
  console.log("   ", clinicId, "\n");
}

main().catch((err) => {
  console.error("✘  Unexpected error:", err);
  process.exit(1);
});