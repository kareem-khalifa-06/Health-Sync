// patient.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Patient } from '../../models/patient';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private supabase = inject(SupabaseService);

  getAllPatients(): Observable<Patient[]> {
    return from(
      this.supabase.client
        .from('patients')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return data.map((p: any) => ({
            ...p,
            fullName: p.full_name,
            dateOfBirth: p.date_of_birth,
            bloodType: p.blood_type,
            noShowCount: p.no_show_count,
          })) as Patient[];
        })
    );
  }

  getPatientById(id: string): Observable<Patient> {
    return from(
      this.supabase.client
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return {
            ...data,
            fullName: data.full_name,
            dateOfBirth: data.date_of_birth,
            bloodType: data.blood_type,
            noShowCount: data.no_show_count,
          } as Patient;
        })
    );
  }

  addPatient(newPatient: Patient): Observable<Patient> {
    return from(
      this.supabase.client
        .from('patients')
        .insert({
          clinic_id:     environment.clinicId,
          full_name:     newPatient.fullName,
          phone:         newPatient.phone,
          date_of_birth: newPatient.dateOfBirth,
          gender:        newPatient.gender,
          blood_type:    newPatient.bloodGroup
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return { ...data, fullName: data.full_name } as Patient;
        })
    );
  }

  updatePatient(updatedPatient: Patient, id: string): Observable<Patient> {
    return from(
      this.supabase.client
        .from('patients')
        .update({
          full_name:     updatedPatient.fullName,
          phone:         updatedPatient.phone,
          date_of_birth: updatedPatient.dateOfBirth,
          gender:        updatedPatient.gender,
          blood_type:    updatedPatient.bloodGroup,
        })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return { ...data, fullName: data.full_name } as Patient;
        })
    );
  }

  deletePatient(id: string): Observable<Patient> {
    return from(
      this.supabase.client
        .from('patients')
        .delete()
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Patient;
        })
    );
  }
}