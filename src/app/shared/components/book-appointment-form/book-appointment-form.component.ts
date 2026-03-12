import { Appointment } from './../../../models/appointment';
import { Doctor } from './../../../models/doctor';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../../core/services/doctors.service';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../models/patient';
import { AppointmentService } from '../../../core/services/appointments.service';
import { single } from 'rxjs';

@Component({
  selector: 'app-book-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment-form.component.html',
  styleUrl: './book-appointment-form.component.css',
})
export class BookAppointmentFormComponent {
  id = signal<number>(7);
  selectedDoctor = signal<Doctor | null>(null);
  doctors!: Doctor[];
  patients!: Patient[];
  appointmentForm = new FormGroup({
    patientId: new FormControl('', Validators.required),
    doctorId: new FormControl('', Validators.required),
    appointmentDate: new FormControl('', Validators.required),
    appointmentDuration: new FormControl('', Validators.required),
    appointmentType: new FormControl('', Validators.required),
    appointmentTime: new FormControl('', Validators.required),
    reason: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  constructor(
    private _DoctorsService: DoctorsService,
    private _PatientsService: PatientService,
    private _AppointmentService: AppointmentService,
  ) {}
  ngOnInit() {
    this._DoctorsService.renderDoctors().subscribe((r) => {
      this.doctors = r;
    });
    this._PatientsService.getAllPatients().subscribe((r) => {
      this.patients = r;
    });
  }
  get patientId() {
    return this.appointmentForm.get('patientId');
  }
  get doctorId() {
    return this.appointmentForm.get('doctorId');
  }
  get appointmentDate() {
    return this.appointmentForm.get('appointmentDate');
  }
  get appointmentTime() {
    return this.appointmentForm.get('appointmentTime');
  }
  get appointmentType() {
    return this.appointmentForm.get('appointmentType');
  }
  get appointmentDuration() {
    return this.appointmentForm.get('appointmentDuration');
  }
  get reason() {
    return this.appointmentForm.get('reason');
  }
  onSubmit() {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this._DoctorsService
      .getDoctorById(this.appointmentForm.value.doctorId!)
      .subscribe({
        next: (doctor) => {
          this.selectedDoctor.set(doctor);

          const newAppointment: Appointment = {
            id: `a${this.id()}`,
            patientId: this.appointmentForm.value.patientId!,
            doctorId: this.appointmentForm.value.doctorId!,
            appointmentDate: this.appointmentForm.value.appointmentDate!,
            appointmentTime: this.appointmentForm.value.appointmentTime!,
            duration: Number(this.appointmentForm.value.appointmentDuration!),
            type: this.appointmentForm.value.appointmentType!,
            status: 'pending',
            reason: this.appointmentForm.value.reason!,
            notes: '',
            slotId: `sch-${this.appointmentForm.value.doctorId!}-1`,
            consultationFee: doctor.consultationFee,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          this._AppointmentService.addAppointment(newAppointment).subscribe({
            next:()=>{
              alert('Appointment Booked Succesfully')
              this.appointmentForm.reset();
              window.history.back();
            }
          });
        },
      });
  }
  onCancel() {
    window.history.back();
  }
}
