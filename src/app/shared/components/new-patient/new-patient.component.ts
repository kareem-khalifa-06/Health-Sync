import { Component, inject, signal } from '@angular/core';
import { BLOODGROUPS } from '../../../Data/bloodgroups';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { BloodGroup, Gender, Patient, PatientStatus } from '../../../models/patient';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-new-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-patient.component.html',
  styleUrl: './new-patient.component.css',
})
export class NewPatientComponent {
  AuthService = inject(AuthService);
    baseRoute = this.AuthService.getBaseRoute();
  Router=inject(Router)
  id = signal<number>(5);
  patientService = inject(PatientService);
  bloodGroups = BLOODGROUPS;
  addPatientForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    dateOfBirth: new FormControl('', {
      validators: [Validators.required],
    }),
    gender: new FormControl('', {
      validators: [Validators.required],
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
    }),
    bloodGroup: new FormControl('', {
      validators: [Validators.required],
    }),
    emergencyContactName: new FormControl('', {
      validators: [Validators.required],
    }),
    emergencyContactNumber: new FormControl('', {
      validators: [Validators.required],
    }),
    emergencyContactRelationShip: new FormControl('', {
      validators: [Validators.required],
    }),
    insuranceProvider: new FormControl('', {
      validators: [Validators.required],
    }),
    allergies: new FormControl('', {
      validators: [Validators.required],
    }),
    insuranceNumber: new FormControl('', {
      validators: [Validators.required],
    }),
  });
  onSubmit() {
    if (this.addPatientForm.invalid) {
      this.addPatientForm.markAllAsTouched();
      return;
    }

    const v = this.addPatientForm.value;

    const newPatient: Patient = {
      id: `p${this.id()}`,
      userId: crypto.randomUUID(),
      firstName: v.firstName ?? '',
      lastName: v.lastName ?? '',
      fullName: `${v.firstName ?? ''} ${v.lastName ?? ''}`,
      initials: `${v.firstName?.[0] ?? ''}${v.lastName?.[0] ?? ''}`,
      avatarUrl: undefined,
      dateOfBirth: v.dateOfBirth ?? '',
      gender: (v.gender ?? 'male') as Gender,
      address: '',
      email: '',
      phone: v.phone ?? '',
      emergencyContact: {
        name: v.emergencyContactName ?? '',
        relationship: v.emergencyContactRelationShip ?? '',
        phone: v.emergencyContactNumber ?? '',
      },
      insuranceProvider: v.insuranceProvider ?? '',
      insuranceNumber: v.insuranceNumber ?? '',
      bloodGroup: (v.bloodGroup ?? 'O+') as BloodGroup,
      allergies: v.allergies ? [v.allergies] : [],
      chronicConditions: [],
      currentMedications: [],
      registeredDate: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      status: 'active' as PatientStatus,
    };

    this.patientService.addPatient(newPatient).subscribe();
    this.addPatientForm.reset();
    this.id.update((id)=>id+1)
  }
  onCancel(){
   this.Router.navigate([this.baseRoute,'patients']);
  }
}
