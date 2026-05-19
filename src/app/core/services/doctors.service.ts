import { HttpClient } from '@angular/common/http';
import { Doctor, DoctorReview } from '../../models/doctor';
import { DoctorSchedule } from '../../models/doctor';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  _HttpClient = inject(HttpClient);
  base_url          = 'http://localhost:3000/doctors';
  schedule_url      = 'http://localhost:3000/doctorSchedules';
  review_url      = 'http://localhost:3000/doctorReviews';


  addDoctor(newDoctor: Doctor): Observable<Doctor> {
    return this._HttpClient.post<Doctor>(this.base_url, newDoctor);
  }

  updateDoctor(updatedDoctor: Doctor, id: string): Observable<Doctor> {
    return this._HttpClient.put<Doctor>(`${this.base_url}/${id}`, updatedDoctor);
  }

  renderDoctors(): Observable<Doctor[]> {
    return this._HttpClient.get<Doctor[]>(this.base_url);
  }

  deleteDoctor(id: string): Observable<Doctor> {
    return this._HttpClient.delete<Doctor>(`${this.base_url}/${id}`);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this._HttpClient.get<Doctor>(`${this.base_url}/${id}`);
  }

  getDoctorSchedule(doctorId: string): Observable<DoctorSchedule[]> {
    return this._HttpClient.get<DoctorSchedule[]>(
      `${this.schedule_url}?doctorId=${doctorId}`
    );
  }
  getDoctorReviews(doctorId: string): Observable<DoctorReview[]> {
    return this._HttpClient.get<DoctorReview[]>(
      `${this.review_url}?doctorId=${doctorId}`
    );
  }

  getScheduleById(scheduleId: string): Observable<DoctorSchedule> {
    return this._HttpClient.get<DoctorSchedule>(
      `${this.schedule_url}/${scheduleId}`
    );
  }

  updateSchedule(schedule: DoctorSchedule): Observable<DoctorSchedule> {
    return this._HttpClient.put<DoctorSchedule>(
      `${this.schedule_url}/${schedule.id}`,
      schedule
    );
  }
}