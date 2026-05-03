import { Notifications } from './../../../models/notification';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DoctorsService } from '../../../core/services/doctors.service';
import { PatientService } from '../../../core/services/patient.service';
import dayjs from 'dayjs';
import { AppointmentService } from '../../../core/services/appointments.service';
import { Appointment } from '../../../models/appointment';
import { Patient } from '../../../models/patient';
import { Doctor } from '../../../models/doctor';
import { forkJoin, of, switchMap } from 'rxjs';
import { Chart } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { CommonModule } from '@angular/common';
import { NotificationsDropdownComponent } from '../notifications-dropdown/notifications-dropdown.component';
export interface AppointmentRow {
  appointment: Appointment;
  patient: Patient;
  doctor: Doctor;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,CommonModule,NotificationsDropdownComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private _AuthService:AuthService,
    public _DoctorsService: DoctorsService,
    public _PatientService: PatientService,
    private _Router: Router,
    private _AppointmentService: AppointmentService,
    private _NotificationsService:NotificationsService
  ) {}
  doctorsCount!: number;
  patientsCount!: number;
  baseRoute=this._AuthService.getBaseRoute()
  appointmentsCount!: number;
  todayAppointments: Appointment[] = [];
  pendingCount!:number;
  patient!: Patient;
  doctor!: Doctor;
  doctors!:Doctor[];
  todayRows!: AppointmentRow[];
  todayDate = dayjs().format('dddd,DD MMMM YYYY');
  notifications:Notifications[]=[];
  unreadNotifications=this.notifications.filter((n)=>!n.read);
  showNotifications = false;

  td = dayjs().format('YYYY-MM-DD');
  ngOnInit() {
       const  userId=this._AuthService.currentUser()!.id;
  this._NotificationsService.getUserNotifications(userId).subscribe((res)=>{
        this.notifications=res;
        console.log(this.notifications.length)
     });
    this._DoctorsService.renderDoctors().subscribe((res) => {
      
      this.doctorsCount = res.length;
      this.doctors = res.splice(Math.floor(Math.random()*4), 4);
    });
    this._PatientService.getAllPatients().subscribe((res) => {
      this.patientsCount = res.length;
    });
    this._AppointmentService.renderAppointments().subscribe((res) => {
      this.appointmentsCount = res.length;
      this.pendingCount=res.filter((a)=>a.status==='pending').length
      this.todayAppointments = res.filter((a) => {
        return a.appointmentDate === this.td;
      });
    });
    this._AppointmentService
      .renderAppointments()
      .pipe(
        switchMap((app) => {
          this.appointmentsCount = app.length;
          const todayAppointments = app.filter(
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

  toggleNotifications() {
  this.showNotifications = !this.showNotifications;
}
 logout(){
  this._AuthService.logout();
 }
closeNotifications() {
  this.showNotifications = false;
}
}
