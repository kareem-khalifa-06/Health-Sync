import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { combineLatest, filter, Subject, switchMap, takeUntil } from 'rxjs';

import { DoctorsService } from '../../../core/services/doctors.service';
import { PatientService } from '../../../core/services/patient.service';


import { Patient } from '../../../models/patient';
import { Doctor } from '../../../models/doctor';
import { BookingPayload, BookingResult, BookingService, SlotStatus } from '../../../core/services/booking.service';
import { AppointmentConfirmDialogComponent } from '../appointment-confirm-dialog/appointment-confirm-dialog.component';
import { handleDoctorAvailabilityStatus } from '../../../utils/handleDoctorAvailabilityStatus';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-book-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule, AppointmentConfirmDialogComponent],
  templateUrl: './book-appointment-form.component.html',
  styleUrl: './book-appointment-form.component.css',
})
export class BookAppointmentFormComponent implements OnInit, OnDestroy {
  appointmentForm!: FormGroup;
  baseRoute:string=''
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  slotStatuses: SlotStatus[] = [];

  showDialog = false;
  isLoading = false;
  bookingError: string | null = null;

  selectedPatientName = '';
  selectedDoctorName = '';

  private _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _PatientService: PatientService,
    private _DoctorsService: DoctorsService,
    private _BookingService: BookingService,
    private _Router: Router,
    private _AuthService: AuthService,
  ) {}

  ngOnInit() {
  this.baseRoute=this._AuthService.getBaseRoute()
    this.appointmentForm = this._fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      appointmentDuration: [30, [Validators.required, Validators.min(1)]],
      appointmentType: ['', Validators.required],
      reason: [''],
    });

    this._PatientService
      .getAllPatients()
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => (this.patients = res));

    this._DoctorsService
      .renderDoctors()
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => (this.doctors = res));


    combineLatest([
      this.appointmentForm.get('doctorId')!.valueChanges,
      this.appointmentForm.get('appointmentDate')!.valueChanges,
    ])
      .pipe(
        takeUntil(this._destroy$),
        filter(([doctorId, date]) => !!doctorId && !!date),
        switchMap(([doctorId, date]) =>
          this._BookingService.getSlotStatuses(doctorId, date),
        ),
      )
      .subscribe((statuses) => {
        this.slotStatuses = statuses;
        this.appointmentForm.get('appointmentTime')!.reset();
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
  get appointmentDuration() {
    return this.appointmentForm.get('appointmentDuration');
  }
  get appointmentType() {
    return this.appointmentForm.get('appointmentType');
  }
  get reason() {
    return this.appointmentForm.get('reason');
  }

  handleDoctorAvailabilityStatus = handleDoctorAvailabilityStatus;
  onSubmit() {
    if (this.appointmentForm.invalid) return;

    this.selectedPatientName =
      this.patients.find((p) => p.id === this.appointmentForm.value.patientId)
        ?.fullName ?? '';
    this.selectedDoctorName =
      this.doctors.find((d) => d.id === this.appointmentForm.value.doctorId)
        ?.fullName ?? '';

    this.bookingError = null;
    this.showDialog = true;
  }

  onConfirm() {
    this.isLoading = true;
    this.bookingError = null;

    const payload: BookingPayload = {
      patientId: this.appointmentForm.value.patientId,
      doctorId: this.appointmentForm.value.doctorId,
      appointmentDate: this.appointmentForm.value.appointmentDate,
      appointmentTime: this.appointmentForm.value.appointmentTime,
      appointmentDuration: this.appointmentForm.value.appointmentDuration,
      type: this.appointmentForm.value.appointmentType,
      reason: this.appointmentForm.value.reason,
    };

    this._BookingService
      .book(payload)
      .pipe(takeUntil(this._destroy$))
      .subscribe((result: BookingResult) => {
        this.isLoading = false;
        if (result.success) {
          this.showDialog = false;
          this._Router.navigate([this.baseRoute,'appointments']);
        } else {
          this.bookingError = result.error ?? 'Booking failed.';
        }
      }); 
  }

  onCancel() {
       history.back();
  }

  onDialogCancelled() {
    this.showDialog = false;
    this.bookingError = null;
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
