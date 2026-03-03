import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  _HttpClient = inject(HttpClient);
  base_url = 'http://localhost:3000/doctors';

  addDoctor(newDoctor: Doctor): Observable<Doctor> {
    return this._HttpClient.post<Doctor>(this.base_url, newDoctor);
  }

  renderDoctors(): Observable<Doctor[]> {
    return this._HttpClient.get<Doctor[]>(this.base_url);
  }

  deleteDoctor(id: number): Observable<Doctor> {
    
    return this._HttpClient.delete<Doctor>(`${this.base_url}/${id}`);
  }
}
