import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  base_url = 'health-sync-production-d340.up.railway.app/patients';
  constructor(private _HttpClient: HttpClient) {}
  getAllPatients(): Observable<Patient[]> {
    return this._HttpClient.get<Patient[]>(this.base_url);
  }
  addPatient(newPatient: Patient): Observable<Patient> {
    return this._HttpClient.post<Patient>(this.base_url, newPatient);
  }
  deletePatient(id: string): Observable<Patient> {
    return this._HttpClient.delete<Patient>(this.base_url + `/${id}`);
  }
  getPatientById(id: string): Observable<Patient> {
    return this._HttpClient.get<Patient>(this.base_url + `/${id}`);
  }
  updatePatient(updatedPatient: Patient, id: string): Observable<Patient> {
    return this._HttpClient.put<Patient>(
      this.base_url + `/${id}`,
      updatedPatient,
    );
  }
}
