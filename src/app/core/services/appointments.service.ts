// src/app/core/services/appointments.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import dayjs from 'dayjs';
import { Appointment } from '../../models/appointment';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private supabase = inject(SupabaseService);
  today = dayjs().format('dddd MMMM YYYY');

  renderAppointments(): Observable<Appointment[]> {
    return from(
      this.supabase.execute<Appointment[]>(
        this.supabase.client
          .from('appointments')
          .select('*')
          .order('appointment_date', { ascending: true })
      )
    );
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return from(
      this.supabase.execute<Appointment>(
        this.supabase.client
          .from('appointments')
          .select('*')
          .eq('id', id)
          .single()
      )
    );
  }

  addAppointment(a: Appointment): Observable<Appointment> {
    return from(
      this.supabase.execute<Appointment>(
        this.supabase.client
          .from('appointments')
          .insert({
            clinic_id:        this.supabase.clinicId,
            patient_id:       a.patientId,
            doctor_id:        a.doctorId,
            appointment_date: a.appointmentDate,
            appointment_time: a.appointmentTime,
            duration:         a.duration,
            type:             a.type,
            status:           a.status,
            reason:           a.reason,
            notes:            a.notes,
            consultation_fee: a.consultationFee ?? 0,
          })
          .select()
          .single()
      )
    );
  }

  updateAppointment(a: Appointment): Observable<Appointment> {
    return from(
      this.supabase.execute<Appointment>(
        this.supabase.client
          .from('appointments')
          .update({
            patient_id:       a.patientId,
            doctor_id:        a.doctorId,
            appointment_date: a.appointmentDate,
            appointment_time: a.appointmentTime,
            duration:         a.duration,
            type:             a.type,
            status:           a.status,
            reason:           a.reason,
            notes:            a.notes,
            consultation_fee: a.consultationFee,
            updated_at:       new Date().toISOString(),
          })
          .eq('id', a.id)
          .select()
          .single()
      )
    );
  }

  deleteAppointment(id: string): Observable<Appointment> {
    return from(
      this.supabase.execute<Appointment>(
        this.supabase.client
          .from('appointments')
          .delete()
          .eq('id', id)
          .select()
          .single()
      )
    );
  }
}