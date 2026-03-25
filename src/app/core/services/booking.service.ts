import { Injectable, signal } from '@angular/core';
import { DoctorsService } from './doctors.service';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from './appointments.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { _adapters } from 'chart.js';
export interface BookingPayload {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  reason: string;
  appointmentDuration: number;
}

export interface SlotStatus {
  time: string;
  label: string;
  available: boolean;
}

export interface BookingResult {
  success: boolean;
  appointment?: Appointment;
  error?: string;
}
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  id=signal<number>(0)
  constructor(
    private _DoctorsService: DoctorsService,
    private _AppointmentService: AppointmentService,
  ) {}

  readonly ALL_SLOTS = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];

  getSlotStatuses(doctorId: string, date: string): Observable<SlotStatus[]> {
    return this._AppointmentService.renderAppointments().pipe(
      map((appointments) => {
        const bookedTimes = appointments
          .filter(
            (a) =>
              a.doctorId === doctorId &&
              a.appointmentDate === date &&
              a.status !== 'cancelled',
          )
          .map((a) => a.appointmentTime);

        return this.ALL_SLOTS.map((time) => ({
          time,
          label: this._formatLabel(time),
          available: !bookedTimes.includes(time),
        }));
      }),
      catchError(() => {
        return of(
          this.ALL_SLOTS.map((time) => ({
            time,
            label: this._formatLabel(time),
            available: true,
          })),
        );
      }),
    );
  }

  hasConflict(
    payload: BookingPayload,
    excludeId?: string,
  ): Observable<boolean> {
    return this._AppointmentService.renderAppointments().pipe(
      map((appointments) =>
        appointments.some(
          (a) =>
            a.doctorId === payload.doctorId &&
            a.appointmentDate === payload.appointmentDate &&
            a.appointmentTime === payload.appointmentTime &&
            a.status !== 'cancelled' &&
            a.id !== excludeId,
        ),
      ),
      catchError(() => of(false)),
    );
  }

  book(payload: BookingPayload): Observable<BookingResult> {
    this._AppointmentService.renderAppointments().subscribe((r)=>{
      this.id.set(r.length)
    })
    return this.hasConflict(payload).pipe(
      switchMap((conflict) => {
        if (conflict) {
          return of<BookingResult>({
            success: false,
            error: 'This time slot was just taken. Please choose another.',
          });
        }

       const newAppointment: Appointment = {
         id:`a${this.id()+1}`,
         patientId: payload.patientId,
         doctorId: payload.doctorId,
         appointmentDate: payload.appointmentDate,
         appointmentTime: payload.appointmentTime,
         type: payload.type,
         reason: payload.reason,
         duration: payload.appointmentDuration,
         status: 'pending',
         notes: '',
         slotId: `sch-${payload.doctorId}-${Date.now()}`,
         consultationFee: 0,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
       };
        
        return this._AppointmentService
          .addAppointment(newAppointment)
          .pipe(
            map((saved) => {
               this.id.update((id) => id + 1);
              this._simulateNotification(saved);
              return <BookingResult>{ success: true, appointment: saved };
            }),
            catchError((err) => {
              const message =
                err?.status === 0
                  ? 'Network error. Check your connection and try again.'
                  : err?.status === 409
                    ? 'This slot was just booked by someone else. Please pick another.'
                    : 'Something went wrong while saving. Please try again.';

              return of<BookingResult>({ success: false, error: message });
            }),
          );
      }),
    );
  }

  private _simulateNotification(appointment: Appointment): void {
    console.info(
      `[HealthSync] Booking confirmed — ID: ${appointment.id} | ` +
        `${appointment.appointmentDate} at ${appointment.appointmentTime}`,
    );

    setTimeout(() => {
      console.info(
        `[HealthSync] Reminder sent to patient ${appointment.patientId}`,
      );
    }, 1000);
  }

   _formatLabel(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
  }
}
