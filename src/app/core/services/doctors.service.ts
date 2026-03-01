import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { routes } from '../../app.routes';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  _HttpClient = inject(HttpClient);
  base_url = 'http://localhost:3000/doctors';
  constructor() {}
  addDoctor(newDoctor: Doctor): Observable<Doctor> {
    return this._HttpClient.post<Doctor>(this.base_url, newDoctor);
  }
  renderDoctors(): Observable<Doctor[]> {
    return this._HttpClient.get<Doctor[]>(this.base_url);
  }
  updateDoctor(id: number, updatedDoctor: Doctor): Observable<Doctor> {
    return this._HttpClient.put<Doctor>(
      this.base_url + `/${id}`,
      updatedDoctor,
    );
  }
  deleteDoctor(id: string) :Observable<Doctor>{
    return this._HttpClient.delete<Doctor>(this.base_url + `/${id}`);
  }
}
