// src/app/core/services/doctors.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Doctor, DoctorReview, DoctorSchedule } from '../../models/doctor';
import { SupabaseService } from './supabase.service';
import { enrichDoctor } from '../../utils/models-helpers';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private supabase = inject(SupabaseService);

  // ── Doctors ───────────────────────────────────────────────────────

  renderDoctors(): Observable<Doctor[]> {
    return from(
      this.supabase.execute<Doctor[]>(
        this.supabase.client.from('doctors').select('*')
      )
    ).pipe(map(doctors => doctors.map(enrichDoctor)));
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
    ).pipe(map(enrichDoctor));
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
    ).pipe(map(enrichDoctor));
  }

  addDoctor(d: Doctor): Observable<Doctor> {
    return from(
      this.supabase.execute<Doctor>(
        this.supabase.client
          .from('doctors')
          .insert({
            clinic_id:            this.supabase.clinicId,
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
            rating:               d.rating         ?? 0,
            total_reviews:        d.totalReviews   ?? 0,
            total_patients:       d.totalPatients  ?? 0,
            status:               d.status         ?? 'active',
            is_available_today:   d.isAvailableToday  ?? true,
            available_days:       d.availableDays      ?? [],
            available_time_slots: d.availableTimeSlots ?? [],
          })
          .select()
          .single()
      )
    ).pipe(map(enrichDoctor));
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
    ).pipe(map(enrichDoctor));
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

  // ── Schedules ─────────────────────────────────────────────────────

  getDoctorSchedule(doctorId: string): Observable<DoctorSchedule[]> {
    return from(
      this.supabase.execute<DoctorSchedule[]>(
        this.supabase.client
          .from('doctor_schedules')
          .select('*')
          .eq('doctor_id', doctorId)
          .order('day')
      )
    ).pipe(
      map(schedules => schedules.map(s => ({
        ...s,
        // slots may arrive as a JSON string if column is text — parse defensively
        slots: typeof s.slots === 'string' ? JSON.parse(s.slots) : s.slots ?? [],
      })))
    );
  }

  getScheduleById(scheduleId: string): Observable<DoctorSchedule> {
    return from(
      this.supabase.execute<DoctorSchedule>(
        this.supabase.client
          .from('doctor_schedules')
          .select('*')
          .eq('id', scheduleId)
          .single()
      )
    ).pipe(
      map(s => ({
        ...s,
        slots: typeof s.slots === 'string' ? JSON.parse(s.slots) : s.slots ?? [],
      }))
    );
  }

  updateSchedule(schedule: DoctorSchedule): Observable<DoctorSchedule> {
    return from(
      this.supabase.execute<DoctorSchedule>(
        this.supabase.client
          .from('doctor_schedules')
          .update({
            day:      schedule.day,
            day_short: schedule.dayShort,
            date:     schedule.date,
            enabled:  schedule.enabled,
            slots:    schedule.slots,
          })
          .eq('id', schedule.id)
          .select()
          .single()
      )
    );
  }

  // ── Reviews ───────────────────────────────────────────────────────

  getDoctorReviews(doctorId: string): Observable<DoctorReview[]> {
    return from(
      this.supabase.execute<DoctorReview[]>(
        this.supabase.client
          .from('doctor_reviews')
          .select('*')
          .eq('doctor_id', doctorId)
          .order('date', { ascending: false })
      )
    ).pipe(
      // rating comes as string from Supabase numeric column — coerce to number
      map(reviews => reviews.map(r => ({ ...r, rating: Number(r.rating) })))
    );
  }
}