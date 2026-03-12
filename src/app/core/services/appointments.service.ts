import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Appointment } from '../../models/appointment';


@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  _HttpClient = inject(HttpClient);
  base_url = 'http://localhost:3000/appointments';

  addAppointment (newAppointment:Appointment): Observable<Appointment> {
    return this._HttpClient.post<Appointment>(this.base_url, newAppointment);
  }

  updateAppointment(updatedAppointment :Appointment): Observable<Appointment> {
    return this._HttpClient.put<Appointment>(this.base_url, updatedAppointment);
  }

  renderAppointments(): Observable<Appointment[]> {
    return this._HttpClient.get<Appointment[]>(this.base_url);
  }

  deleteAppointment(id: string): Observable<Appointment> {
    return this._HttpClient.delete<Appointment>(`${this.base_url}/${id}`);
  }
  getAppointmentyId(id: string): Observable<Appointment> {
    return this._HttpClient.get<Appointment>(`${this.base_url}/${id}`);
  }

}
