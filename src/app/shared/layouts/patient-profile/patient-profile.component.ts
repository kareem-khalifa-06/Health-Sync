import { Patient } from './../../../models/patient';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject, takeUntil, switchMap, of, map } from 'rxjs';
import { Appointment } from '../../../models/appointment';
import { MedicalRecord } from '../../../medical-record';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointments.service';
import { MedicalRecordsService } from '../../../core/services/medical-records.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Doctor } from '../../../models/doctor';
import { DoctorsService } from '../../../core/services/doctors.service';
interface appointmentDetails{
  app:Appointment,
  patient:Patient,
  doctor:Doctor

}

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css',
})
export class PatientDashboardComponent implements OnInit, OnDestroy {
  patient: Patient | null = null;
  upcomingAppointments: appointmentDetails[] = [];
  
  medicalRecords: MedicalRecord[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _PatientService: PatientService,
    private _DoctorsService: DoctorsService,
    private _AppointmentService: AppointmentService,
    private _MedicalRecordsService: MedicalRecordsService,
    private _AuthService: AuthService,
    public _BookingService: BookingService,
  ) {}

  ngOnInit() {
    const patientId = this.route.snapshot.paramMap.get('id') ?? '';
    const today = new Date().toISOString().split('T')[0];

    this._PatientService
      .getPatientById(patientId)
      .pipe(
        switchMap((patient) => {
          this.patient = patient;

          return forkJoin({
            appointments: this._AppointmentService.renderAppointments(),
            doctors: this._DoctorsService.renderDoctors(),
            records: this._MedicalRecordsService.renderMedicalRecords(),
          }).pipe(
            map(({ appointments, doctors, records }) => {

              const upcoming = appointments
                .filter(
                  (a) =>
                    a.patientId === patientId &&
                    a.status !== 'cancelled' &&
                    a.appointmentDate >= today,
                )
                .sort((a, b) =>
                  a.appointmentDate.localeCompare(b.appointmentDate),
                )
                .map((a) => ({
                  app: a,
                  patient: patient,
                  doctor: doctors.find((d) => d.id === a.doctorId)!,
                }));

              // ── Medical records ──
              this.medicalRecords = records
                .filter((r) => r.patientId === patientId)
                .sort((a, b) => b.date.localeCompare(a.date));

              return upcoming;
            }),
          );
        }),

        takeUntil(this.destroy$),
      )
      .subscribe((upcomingAppointments) => {
        this.upcomingAppointments = upcomingAppointments;
      });
  }


  get activePrescriptions() {
    return this.patient?.currentMedications ?? [];
  }

  get recentRecords() {
    return this.medicalRecords.slice(0, 3);
  }

  // ── Actions ──────────────────────────────────────────────────

  goToEdit() {
    const patientId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['patientProfileEdit', patientId]);
  }

  logout() {
    this._AuthService.logout();
  }

  downloadReport() {
    console.log('[HealthSync] Downloading report for', this.patient?.fullName);
    window.print();
  }

  formatTime = this._BookingService._formatLabel;
  bookAppointmnet(){
   this.router.navigate(['patient'])
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
