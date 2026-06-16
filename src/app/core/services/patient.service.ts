// src/app/core/services/patient.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Patient } from '../../models/patient';
import { SupabaseService } from './supabase.service';
import { enrichPatient } from '../../utils/models-helpers';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private supabase = inject(SupabaseService);

  getAllPatients(): Observable<Patient[]> {
    return from(
      this.supabase.execute<Patient[]>(
        this.supabase.client.from('patients').select('*')
      )
    ).pipe(map((p)=>p.map(enrichPatient)));
  }

  getPatientById(id: string): Observable<Patient> {
    return from(
      this.supabase.execute<Patient>(
        this.supabase.client
          .from('patients')
          .select('*')
          .eq('id', id)
          .single()
      )
    ).pipe(map(enrichPatient));
  }

  addPatient(p: Patient): Observable<Patient> {
    return from(
      this.supabase.execute<Patient>(
        this.supabase.client
          .from('patients')
          .insert({
            clinic_id:          this.supabase.clinicId,
            first_name:         p.firstName,
            last_name:          p.lastName,
            email:              p.email,
            phone:              p.phone,
            date_of_birth:      p.dateOfBirth,
            gender:             p.gender,
            address:            p.address,
            emergency_contact:  p.emergencyContact,
            insurance_provider: p.insuranceProvider,
            insurance_number:   p.insuranceNumber,
            blood_group:        p.bloodGroup,
            allergies:          p.allergies,
            chronic_conditions: p.chronicConditions,
            current_medications: p.currentMedications,
            status:             p.status ?? 'active',
          })
          .select()
          .single()
      )
    );
  }

  updatePatient(p: Patient, id: string): Observable<Patient> {
    return from(
      this.supabase.execute<Patient>(
        this.supabase.client
          .from('patients')
          .update({
            first_name:          p.firstName,
            last_name:           p.lastName,
            email:               p.email,
            phone:               p.phone,
            date_of_birth:       p.dateOfBirth,
            gender:              p.gender,
            address:             p.address,
            emergency_contact:   p.emergencyContact,
            insurance_provider:  p.insuranceProvider,
            insurance_number:    p.insuranceNumber,
            blood_group:         p.bloodGroup,
            allergies:           p.allergies,
            chronic_conditions:  p.chronicConditions,
            current_medications: p.currentMedications,
            status:              p.status,
          })
          .eq('id', id)
          .select()
          .single()
      )
    );
  }

  deletePatient(id: string): Observable<Patient> {
    return from(
      this.supabase.execute<Patient>(
        this.supabase.client
          .from('patients')
          .delete()
          .eq('id', id)
          .select()
          .single()
      )
    );
  }
}