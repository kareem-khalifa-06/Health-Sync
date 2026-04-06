import { Patient } from './../../../models/patient';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-profile-edit.component.html',
  styleUrl: './patient-profile-edit.component.css',
})
export class PatientProfileEditComponent implements OnInit, OnDestroy {
  patient: Patient | null = null;
  form!: FormGroup;
  isSaving = false;
  saveSuccess = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _PatientService: PatientService,
  ) {}

  ngOnInit() {
    const patientId = this.route.snapshot.parent?.paramMap.get('id') ?? '';
    console.log(patientId);
    this._PatientService
      .getPatientById(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((patient) => {
        this.patient = patient;
        this.buildForm(patient);
      });
  }

  // ── Build form from patient data ─────────────────────────────
  private buildForm(p: Patient) {
    this.form = this.fb.group({
      // Personal
      firstName: [p.firstName, Validators.required],
      lastName: [p.lastName, Validators.required],
      dateOfBirth: [p.dateOfBirth, Validators.required],
      gender: [p.gender, Validators.required],

      // Contact
      email: [p.email, [Validators.required, Validators.email]],
      phone: [p.phone, Validators.required],
      address: [p.address],

      // Emergency contact
      emergencyContact: this.fb.group({
        name: [p.emergencyContact?.name ?? ''],
        relationship: [p.emergencyContact?.relationship ?? ''],
        phone: [p.emergencyContact?.phone ?? ''],
      }),

      // Medical
      bloodGroup: [p.bloodGroup],
      insuranceProvider: [p.insuranceProvider],
      insuranceNumber: [p.insuranceNumber],

      // Arrays stored as comma-separated strings for easy editing
      allergies: [p.allergies?.join(', ') ?? ''],
      chronicConditions: [p.chronicConditions?.join(', ') ?? ''],
    });
  }

  // ── Convenience getters ──────────────────────────────────────
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get dateOfBirth() {
    return this.form.get('dateOfBirth');
  }
  get gender() {
    return this.form.get('gender');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get emergencyContact() {
    return this.form.get('emergencyContact');
  }

  // ── Save ─────────────────────────────────────────────────────
  onSave() {
    if (this.form.invalid || !this.patient) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const v = this.form.value;

    const updated: Patient = {
      ...this.patient,
      firstName: v.firstName,
      lastName: v.lastName,
      fullName: `${v.firstName} ${v.lastName}`,
      initials: `${v.firstName[0]}${v.lastName[0]}`.toUpperCase(),
      dateOfBirth: v.dateOfBirth,
      gender: v.gender,
      email: v.email,
      phone: v.phone,
      address: v.address,
      emergencyContact: v.emergencyContact,
      bloodGroup: v.bloodGroup,
      insuranceProvider: v.insuranceProvider,
      insuranceNumber: v.insuranceNumber,
      // Convert comma-separated strings back to arrays
      allergies: v.allergies
        ? v.allergies
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      chronicConditions: v.chronicConditions
        ? v.chronicConditions
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    };

    this._PatientService.updatePatient(updated,this.patient.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        setTimeout(()=> window.history.back()
          ,800)
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Save failed', err);
      },
    });
  }

  onCancel() {
    window.history.back();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
