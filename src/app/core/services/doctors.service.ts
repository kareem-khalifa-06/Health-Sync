// src/app/core/services/doctors.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Doctor, DoctorReview, DoctorSchedule } from '../../models/doctor';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private supabase = inject(SupabaseService);

  // Schedule & Reviews have no Supabase tables yet — stay on Railway
  private _http = inject(HttpClient);
  private scheduleUrl = 'https://health-sync-production-d340.up.railway.app/doctorSchedules';
  private reviewUrl   = 'https://health-sync-production-d340.up.railway.app/doctorReviews';

  renderDoctors(): Observable<Doctor[]> {
    return from(
      this.supabase.execute<Doctor[]>(
        this.supabase.client.from('doctors').select('*')
      )
    );
  }

  getDoctorById(id: string): Observable<Doctor> {
    return from(
      this.supabase.execute<Doctor>(
        this.supabase.client
          .from('doctors')
          .select('*')
          .eq('id', id)
          .single()
      )
    );
  }

  getDoctorByUserId(userId: string): Observable<Doctor> {
    return from(
      this.supabase.execute<Doctor>(
        this.supabase.client
          .from('doctors')
          .select('*')
          .eq('user_id', userId)
          .single()
      )
    );
  }

  addDoctor(d: Doctor): Observable<Doctor> {
    return from(
      this.supabase.execute<Doctor>(
        this.supabase.client
          .from('doctors')
          .insert({
            clinic_id:           this.supabase.clinicId,
            first_name:          d.firstName,
            last_name:           d.lastName,
            email:               d.email,
            phone:               d.phone,
            bio:                 d.bio,
            specialty:           d.specialty,
            sub_specialty:       d.subSpecialty,
            department:          d.department,
            hospital:            d.hospital,
            location:            d.location,
            qualifications:      d.qualifications,
            languages:           d.languages,
            services:            d.services,
            education:           d.education,
            achievements:        d.achievements,
            experience:          d.experience,
            consultation_fee:    d.consultationFee,
            rating:              d.rating ?? 0,
            total_reviews:       d.totalReviews ?? 0,
            total_patients:      d.totalPatients ?? 0,
            status:              d.status ?? 'active',
            is_available_today:  d.isAvailableToday ?? true,
            available_days:      d.availableDays ?? [],
            available_time_slots: d.availableTimeSlots ?? [],
          })
          .select()
          .single()
      )
    );
  }

  updateDoctor(d: Doctor, id: string): Observable<Doctor> {
    return from(
      this.supabase.execute<Doctor>(
        this.supabase.client
          .from('doctors')
          .update({
            first_name:           d.firstName,
            last_name:            d.lastName,
            email:                d.email,
            phone:                d.phone,
            bio:                  d.bio,
            specialty:            d.specialty,
            sub_specialty:        d.subSpecialty,
            department:           d.department,
            hospital:             d.hospital,
            location:             d.location,
            qualifications:       d.qualifications,
            languages:            d.languages,
            services:             d.services,
            education:            d.education,
            achievements:         d.achievements,
            experience:           d.experience,
            consultation_fee:     d.consultationFee,
            status:               d.status,
            is_available_today:   d.isAvailableToday,
            available_days:       d.availableDays,
            available_time_slots: d.availableTimeSlots,
          })
          .eq('id', id)
          .select()
          .single()
      )
    );
  }

  deleteDoctor(id: string): Observable<Doctor> {
    return from(
      this.supabase.execute<Doctor>(
        this.supabase.client
          .from('doctors')
          .delete()
          .eq('id', id)
          .select()
          .single()
      )
    );
  }

  // ── Still on Railway ──────────────────────────────────────────
  getDoctorSchedule(doctorId: string): Observable<DoctorSchedule[]> {
    return this._http.get<DoctorSchedule[]>(`${this.scheduleUrl}?doctorId=${doctorId}`);
  }
  getDoctorReviews(doctorId: string): Observable<DoctorReview[]> {
    return this._http.get<DoctorReview[]>(`${this.reviewUrl}?doctorId=${doctorId}`);
  }
  getScheduleById(scheduleId: string): Observable<DoctorSchedule> {
    return this._http.get<DoctorSchedule>(`${this.scheduleUrl}/${scheduleId}`);
  }
  updateSchedule(schedule: DoctorSchedule): Observable<DoctorSchedule> {
    return this._http.put<DoctorSchedule>(`${this.scheduleUrl}/${schedule.id}`, schedule);
  }
}