// src/app/core/services/medical-records.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import dayjs from 'dayjs';

import { SupabaseService } from './supabase.service';
import { MedicalRecord } from '../../models/medical-record';

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
  private supabase = inject(SupabaseService);
  today = dayjs().format('dddd MMMM YYYY');

  renderMedicalRecords(): Observable<MedicalRecord[]> {
    return from(
      this.supabase.execute<MedicalRecord[]>(
        this.supabase.client.from('medical_records').select('*')
      )
    );
  }

  getMedicalRecordById(id: string): Observable<MedicalRecord> {
    return from(
      this.supabase.execute<MedicalRecord>(
        this.supabase.client
          .from('medical_records')
          .select('*')
          .eq('id', id)
          .single()
      )
    );
  }

  addMedicalRecord(r: MedicalRecord): Observable<MedicalRecord> {
    return from(
      this.supabase.execute<MedicalRecord>(
        this.supabase.client
          .from('medical_records')
          .insert({
            clinic_id:      this.supabase.clinicId,
            patient_id:     r.patientId,
            doctor_id:      r.doctorId,
            appointment_id: r.appointmentId,
            diagnosis:      r.diagnosis,
            notes:          r.notes,
            follow_up_date: r.followUpDate,
          })
          .select()
          .single()
      )
    );
  }

  updateMedicalRecord(r: MedicalRecord): Observable<MedicalRecord> {
    return from(
      this.supabase.execute<MedicalRecord>(
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
      )
    );
  }

  deleteMedicalRecord(id: string): Observable<MedicalRecord> {
    return from(
      this.supabase.execute<MedicalRecord>(
        this.supabase.client
          .from('medical_records')
          .delete()
          .eq('id', id)
          .select()
          .single()
      )
    );
  }
}