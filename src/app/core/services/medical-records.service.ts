import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { MedicalRecord } from '../../medical-record';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordsService {
  constructor(private _HttpClient: HttpClient) {}
 base_url = 'health-sync-production-d340.up.railway.app/medicalRecords';
  today = dayjs().format('dddd MMMM YYYY');

  addMedicalRecord(newMedicalRecord: MedicalRecord): Observable<MedicalRecord> {
    return this._HttpClient.post<MedicalRecord>(this.base_url, newMedicalRecord);
  }

  updateMedicalRecord(updatedMedicalRecord: MedicalRecord): Observable<MedicalRecord> {
    return this._HttpClient.put<MedicalRecord>(
      `${this.base_url}/${updatedMedicalRecord.id}`,
      updatedMedicalRecord,
    );
  }

  renderMedicalRecords(): Observable<MedicalRecord[]> {
    return this._HttpClient.get<MedicalRecord[]>(this.base_url);
  }

  deleteMedicalRecord(id: string): Observable<MedicalRecord> {
    return this._HttpClient.delete<MedicalRecord>(`${this.base_url}/${id}`);
  }
  getMedicalRecordById(id: string): Observable<MedicalRecord> {
    return this._HttpClient.get<MedicalRecord>(`${this.base_url}/${id}`);
  }

  }

