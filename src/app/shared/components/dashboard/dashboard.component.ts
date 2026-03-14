import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DoctorsService } from '../../../core/services/doctors.service';
import { PatientService } from '../../../core/services/patient.service';
import dayjs from 'dayjs';
import { AppointmentService } from '../../../core/services/appointments.service';
import { Appointment } from '../../../models/appointment';
import { Patient } from '../../../models/patient';
import { Doctor } from '../../../models/doctor';
import { forkJoin, of, switchMap } from 'rxjs';

interface AppointmentRow {
  appointment: Appointment;
  patient: Patient;
  doctor: Doctor;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    public _DoctorsService: DoctorsService,
    public _PatientService: PatientService,
    private _Router: Router,
    private _AppointmentService: AppointmentService,
  ) {}

  doctorsCount!: number;
  patientsCount!: number;
  appointmentsCount!: number;
  todayRows: AppointmentRow[] = [];

  todayDate = dayjs().format('dddd, DD MMMM YYYY');
  td = dayjs().format('YYYY-MM-DD');

  ngOnInit() {
    this._DoctorsService.renderDoctors().subscribe((res) => {
      this.doctorsCount = res.length;
    });

    this._PatientService.getAllPatients().subscribe((res) => {
      this.patientsCount = res.length;
    });
// needs to be understood
    this._AppointmentService
      .renderAppointments()
      .pipe(
        switchMap((appointments) => {
          this.appointmentsCount = appointments.length;
          const todayAppointments = appointments.filter(
            (a) => a.appointmentDate === this.td,
          );

          if (todayAppointments.length === 0) return of([]);

          return forkJoin(
            todayAppointments.map((a) =>
              forkJoin({
                patient: this._PatientService.getPatientById(a.patientId),
                doctor: this._DoctorsService.getDoctorById(a.doctorId),
              }).pipe(
                switchMap(({ patient, doctor }) =>
                  of({ appointment: a, patient, doctor }),
                ),
              ),
            ),
          );
        }),
      )
      .subscribe((rows) => {
        this.todayRows = rows;
      });
  }
}
