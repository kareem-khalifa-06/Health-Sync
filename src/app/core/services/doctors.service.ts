import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Doctor, DoctorReview, DoctorSchedule } from '../../models/doctor';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment.development';
import { handleDoctorAvailabilityStatus } from '../../utils/handleDoctorAvailabilityStatus';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private supabase = inject(SupabaseService);
  private _http    = inject(HttpClient);

  private schedule_url = 'https://health-sync-production-d340.up.railway.app/doctorSchedules';
  private review_url   = 'https://health-sync-production-d340.up.railway.app/doctorReviews';

  renderDoctors(): Observable<Doctor[]> {
    return from(
      this.supabase.client
        .from('doctors')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return data.map((d: any) => ({
            ...d,
            fullName:        d.full_name,
            consultationFee: d.consultation_fee,
          })) as Doctor[];
        })
    );
  }

  getDoctorById(id: string): Observable<Doctor> {
    return from(
      this.supabase.client
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return {
            ...data,
            fullName:        data.full_name,
            consultationFee: data.consultation_fee,
          } as Doctor;
        })
    );
  }

  addDoctor(newDoctor: Doctor): Observable<Doctor> {
    return from(
      this.supabase.client
        .from('doctors')
        .insert({
          clinic_id:       environment.clinicId,
          full_name:       newDoctor.fullName,
          phone:           newDoctor.phone,
          specialization:  newDoctor.specialty,
          bio:             newDoctor.bio,
          consultation_fee: newDoctor.consultationFee ?? 0,
          rating:          newDoctor.rating ?? 0,
          available:       handleDoctorAvailabilityStatus(newDoctor),
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return { ...data, fullName: data.full_name } as Doctor;
        })
    );
  }

  updateDoctor(updatedDoctor: Doctor, id: string): Observable<Doctor> {
    return from(
      this.supabase.client
        .from('doctors')
        .update({
          full_name:       updatedDoctor.fullName,
          email:           updatedDoctor.email,
          phone:           updatedDoctor.phone,
          specialization:  updatedDoctor.specialty,
          bio:             updatedDoctor.bio,
          consultation_fee: updatedDoctor.consultationFee,
          rating:          updatedDoctor.rating,
          available:       handleDoctorAvailabilityStatus(updatedDoctor),
        })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return { ...data, fullName: data.full_name } as Doctor;
        })
    );
  }

  deleteDoctor(id: string): Observable<Doctor> {
    return from(
      this.supabase.client
        .from('doctors')
        .delete()
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Doctor;
        })
    );
  }

  // ── Still on Railway ─────────────────────────────────────────
  getDoctorSchedule(doctorId: string): Observable<DoctorSchedule[]> {
    return this._http.get<DoctorSchedule[]>(`${this.schedule_url}?doctorId=${doctorId}`);
  }
  getDoctorReviews(doctorId: string): Observable<DoctorReview[]> {
    return this._http.get<DoctorReview[]>(`${this.review_url}?doctorId=${doctorId}`);
  }
  getScheduleById(scheduleId: string): Observable<DoctorSchedule> {
    return this._http.get<DoctorSchedule>(`${this.schedule_url}/${scheduleId}`);
  }
  updateSchedule(schedule: DoctorSchedule): Observable<DoctorSchedule> {
    return this._http.put<DoctorSchedule>(`${this.schedule_url}/${schedule.id}`, schedule);
  }
}