import {
  Prescription,
  LabTest,
  MedicalRecord,
} from './../../../medical-record';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorsService } from '../../../core/services/doctors.service';
import { AppointmentService } from '../../../core/services/appointments.service';
import { Patient } from '../../../models/patient';
import { Doctor } from '../../../models/doctor';
import { Appointment } from '../../../models/appointment';
import { MedicalRecordsService } from '../../../core/services/medical-records.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-new-record',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-record.component.html',
  styleUrl: './new-record.component.css',
})
export class NewRecordComponent implements OnInit {
  AuthService = inject(AuthService);
    baseRoute = this.AuthService.getBaseRoute();
  id = signal<number>(3);
  // ── Dropdown data ────────────────────────────────────────────
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];

  // ── Dynamic lists ────────────────────────────────────────────
  symptoms: string[] = [];
  prescriptions: Prescription[] = [];
  labTests: LabTest[] = [];

  // ── Symptom input ────────────────────────────────────────────
  symptomInput = '';

  // ── Form ─────────────────────────────────────────────────────
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _MedicalRecordService: MedicalRecordsService,
    private _PatientService: PatientService,
    private _DoctorsService: DoctorsService,
    private _AppointmentService: AppointmentService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentId: [''],
      date: [dayjs().format('YYYY-MM-DD'), Validators.required],
      diagnosis: ['', Validators.required],
      notes: [''],
      followUpDate: [''],
      vitalSigns: this.fb.group({
        bloodPressure: [''],
        heartRate: [null],
        temperature: [null],
        weight: [null],
        height: [null],
      }),
    });

    this._PatientService
      .getAllPatients()
      .subscribe((res) => (this.patients = res));
    this._DoctorsService
      .renderDoctors()
      .subscribe((res) => (this.doctors = res));
    this._AppointmentService
      .renderAppointments()
      .subscribe((res) => (this.appointments = res));
    this._MedicalRecordService.renderMedicalRecords().subscribe((records) => {
      this.id.set(records.length + 1);
    });
  }

  // ── Symptoms ─────────────────────────────────────────────────
  addSymptom(event: Event) {
    event.preventDefault();
    this._addSymptom();
  }

  addSymptomClick() {
    this._addSymptom();
  }

  private _addSymptom() {
    const val = this.symptomInput.trim();
    if (val && !this.symptoms.includes(val)) {
      this.symptoms = [...this.symptoms, val];
    }
    this.symptomInput = '';
  }

  removeSymptom(s: string) {
    this.symptoms = this.symptoms.filter((x) => x !== s);
  }

  // ── Prescriptions ────────────────────────────────────────────
  addPrescription() {
    this.prescriptions = [
      ...this.prescriptions,
      {
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        id: '',
        notes: '',
      },
    ];
  }

  removePrescription(i: number) {
    this.prescriptions = this.prescriptions.filter((_, idx) => idx !== i);
  }

  // ── Lab Tests ────────────────────────────────────────────────
  addLabTest() {
    this.labTests = [
      ...this.labTests,
      {
        name: '',
        orderedAt: dayjs().format('YYYY-MM-DD'),
        status: 'in-progress',
        result: '',
        id: crypto.randomUUID(),
      },
    ];
  }

  removeLabTest(i: number) {
    this.labTests = this.labTests.filter((_, idx) => idx !== i);
  }

  // ── Submit ───────────────────────────────────────────────────
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const record: MedicalRecord = {
      id: `mr${this.id()}`,
      patientId: v.patientId,
      doctorId: v.doctorId,
      appointmentId: v.appointmentId,
      date: v.date,
      diagnosis: v.diagnosis,
      symptoms: this.symptoms,
      vitalSigns: v.vitalSigns,
      prescriptions: this.prescriptions,
      labTests: this.labTests,
      notes: v.notes,
      followUpDate: v.followUpDate,
      followUpNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._MedicalRecordService.addMedicalRecord(record).subscribe({
      next: () => {
        this.id.update((id) => id + 1);
        this.router.navigate([this.baseRoute, 'medical-records']);
      },
      error: (err) => console.error('Failed to save record', err),
    });
  }

  onCancel() {
    this.router.navigate([this.baseRoute,'medical-records']);
  }
}
