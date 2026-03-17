import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Appointment } from '../../models/appointment';
import dayjs from 'dayjs';
import { AppointmentRow } from '../../shared/components/dashboard/dashboard.component';


@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  _HttpClient = inject(HttpClient);
  base_url = 'http://localhost:3000/appointments';
  today = dayjs().format('dddd MMMM YYYY');

  addAppointment(newAppointment: Appointment): Observable<Appointment> {
    return this._HttpClient.post<Appointment>(this.base_url, newAppointment);
  }

  updateAppointment(updatedAppointment: Appointment): Observable<Appointment> {
    return this._HttpClient.put<Appointment>(
      `${this.base_url}/${updatedAppointment.id}`,
      updatedAppointment,
    );
  }

  renderAppointments(): Observable<Appointment[]> {
    return this._HttpClient.get<Appointment[]>(this.base_url);
  }

  deleteAppointment(id: string): Observable<Appointment> {
    return this._HttpClient.delete<Appointment>(`${this.base_url}/${id}`);
  }
  getAppointmentById(id: string): Observable<Appointment> {
    return this._HttpClient.get<Appointment>(`${this.base_url}/${id}`);
  }
}
