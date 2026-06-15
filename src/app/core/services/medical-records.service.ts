// medical-records.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import dayjs from 'dayjs';
import { MedicalRecord } from '../../medical-record';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
  private supabase = inject(SupabaseService);
  today = dayjs().format('dddd MMMM YYYY');

  renderMedicalRecords(): Observable<MedicalRecord[]> {
    return from(
      this.supabase.client
        .from('medical_records')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return data.map((r: any) => ({
            ...r,
            patientId:    r.patient_id,
            doctorId:     r.doctor_id,
            appointmentId: r.appointment_id,
            followUpDate: r.follow_up_date,
          })) as MedicalRecord[];
        })
    );
  }

  getMedicalRecordById(id: string): Observable<MedicalRecord> {
    return from(
      this.supabase.client
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return {
            ...data,
            patientId:     data.patient_id,
            doctorId:      data.doctor_id,
            appointmentId: data.appointment_id,
            followUpDate:  data.follow_up_date,
          } as MedicalRecord;
        })
    );
  }

  addMedicalRecord(r: MedicalRecord): Observable<MedicalRecord> {
    return from(
      this.supabase.client
        .from('medical_records')
        .insert({
          clinic_id:      environment.clinicId,
          patient_id:     r.patientId,
          doctor_id:      r.doctorId,
          appointment_id: r.appointmentId,
          diagnosis:      r.diagnosis,
          notes:          r.notes,
          follow_up_date: r.followUpDate,
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return { ...data, patientId: data.patient_id } as MedicalRecord;
        })
    );
  }

  updateMedicalRecord(r: MedicalRecord): Observable<MedicalRecord> {
    return from(
      this.supabase.client
        .from('medical_records')
        .update({
          diagnosis:      r.diagnosis,
          notes:          r.notes,
          follow_up_date: r.followUpDate,
        })
        .eq('id', r.id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return { ...data, patientId: data.patient_id } as MedicalRecord;
        })
    );
  }

  deleteMedicalRecord(id: string): Observable<MedicalRecord> {
    return from(
      this.supabase.client
        .from('medical_records')
        .delete()
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as MedicalRecord;
        })
    );
  }
}