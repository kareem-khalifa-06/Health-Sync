import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  base_url = 'http://localhost:3000/patients';
  constructor(private _HttpClient: HttpClient) {}
  getAllPatients():Observable<Patient[]> {
    return this._HttpClient.get<Patient[]>(this.base_url)
  }
  addPatient(newPatient:Patient):Observable<Patient> {
    return this._HttpClient.post<Patient>(this.base_url,newPatient)
  }
  deletePatient(id:string) {
     return this._HttpClient.delete<Patient>(this.base_url+id);
  }
  getPatientById(id:string) {
     return this._HttpClient.get<Patient>(this.base_url+id);
  }
  updatePatient(updatedPatient:Patient,id:string) {
     return this._HttpClient.put<Patient>(this.base_url+id, updatedPatient);
  }
}
