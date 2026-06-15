import { inject, Injectable, signal } from '@angular/core';
import { from, Observable } from 'rxjs';

import { Appointment } from '../../models/appointment';
import dayjs from 'dayjs';
import { AppointmentRow } from '../../shared/components/admin-dashboard/dashboard.component';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  supaBase = inject(SupabaseService);
  today = dayjs().format('dddd MMMM YYYY');

  addAppointment(newAppointment: Appointment): Observable<Appointment> {
    return from(
      this.supaBase.client
        .from('appointments')
        .insert({ ...newAppointment, clinic_id: environment.clinicId })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Appointment;
        }),
    );
  }

  updateAppointment(updatedAppointment: Appointment): Observable<Appointment> {
    return from(
      this.supaBase.client
        .from('appointments')
        .update(updatedAppointment)
        .eq('id', updatedAppointment.id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Appointment;
        }),
    );
  }

  renderAppointments(): Observable<Appointment[]> {
  return from(
    this.supaBase.client
      .from('appointments')
      .select('*')
      .order('scheduled_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        return data.map((a: any) => ({
          ...a,
          patientId: a.patient_id,
          doctorId: a.doctor_id,
          appointmentDate: a.scheduled_at?.split('T')[0],
          appointmentTime: a.scheduled_at?.split('T')[1]?.slice(0, 5),
        })) as Appointment[];
      })
  );
}

  deleteAppointment(id: string): Observable<Appointment> {
    return from(
      this.supaBase.client
        .from('appointments')
        .delete()
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          console.log(data)
          return data as Appointment;
        }),
    );
  }
  getAppointmentById(id: string): Observable<Appointment> {
    return from(
      this.supaBase.client
        .from('appointments')
        .select()
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Appointment;
        }),
    );
  }
}
