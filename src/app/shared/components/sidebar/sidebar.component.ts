import { AuthService } from './../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AppointmentService } from '../../../core/services/appointments.service';
import { Appointment } from '../../../models/appointment';
import dayjs from 'dayjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  collapsed: boolean = false;
  _AuthService = inject(AuthService);
  userRole = this._AuthService.getRole();
  todayApps: Appointment[]=[];
  baseRoute=this._AuthService.getBaseRoute();
  td = dayjs().format('YYYY-MM-DD');
  constructor(private _App: AppointmentService) {}
  ngOnInit() {
    console.log(this.userRole);
    this._App.renderAppointments().subscribe((res) => {
      this.todayApps = res.filter(
        (a) => a.appointmentDate === this.td && a.status === 'pending',
      );
    });
  }
}
