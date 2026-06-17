import { NotificationsService } from './notifications.service';
import { Injectable, signal } from '@angular/core';
import { DoctorsService } from './doctors.service';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from './appointments.service';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { _adapters } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Notifications } from '../../models/notification';
import { PatientService } from './patient.service';
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
  id = signal<number>(0);
  constructor(
    private _DoctorsService: DoctorsService,
    private _AppointmentService: AppointmentService,
    private NotificationsService: NotificationsService,
    private _Toastr: ToastrService,
    private _PatientService: PatientService,
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
            a.status !== 'cancelled' &&
            a.id !== excludeId &&
            a.appointmentDate === payload.appointmentDate &&
            a.appointmentTime === payload.appointmentTime &&
            // [Certain] doctor conflict
            (a.doctorId === payload.doctorId ||
              // [Certain] patient conflict — the missing check
              a.patientId === payload.patientId),
        ),
      ),
      catchError(() => of(false)),
    );
  }
  book(payload: BookingPayload): Observable<BookingResult> {
    return this.hasConflict(payload).pipe(
      switchMap((conflict) => {
        if (conflict) {
          return of<BookingResult>({
            success: false,
            error: 'This time slot is already taken. Please choose another.',
          });
        }

        const newAppointment: Appointment = {
          // ← no id — Supabase generates UUID
          patientId: payload.patientId,
          doctorId: payload.doctorId,
          appointmentDate: payload.appointmentDate,
          appointmentTime: payload.appointmentTime,
          type: payload.type,
          reason: payload.reason,
          duration: payload.appointmentDuration,
          status: 'pending',
          notes: '',
          consultationFee: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Appointment;

        return forkJoin({
          doctor: this._DoctorsService.getDoctorById(payload.doctorId),
          patient: this._PatientService.getPatientById(payload.patientId),
        }).pipe(
          switchMap(({ doctor, patient }) =>
            this._AppointmentService.addAppointment(newAppointment).pipe(
              switchMap((saved) => {
                const doctorNotif: Notifications = {
                  id: crypto.randomUUID(),
                  userId: doctor.userId,
                  message: `New appointment: ${patient.fullName} on ${payload.appointmentDate} at ${payload.appointmentTime}`,
                  type: 'appointment',
                  appointmentId: saved.id,
                  read: false,
                  createdAt: new Date().toISOString(),
                };
                const patientNotif: Notifications = {
                  id: crypto.randomUUID(),
                  userId: patient.userId,
                  message: `Your appointment with ${doctor.fullName} on ${payload.appointmentDate} is confirmed.`,
                  type: 'appointment',
                  appointmentId: saved.id,
                  read: false,
                  createdAt: new Date().toISOString(),
                };
                return forkJoin([
                  this.NotificationsService.sendNotifications(doctorNotif),
                  this.NotificationsService.sendNotifications(patientNotif),
                ]).pipe(map(() => saved));
              }),
            ),
          ),
          map((saved) => {
            this._Toastr.success('Appointment Booked Successfully');
            return { success: true, appointment: saved } as BookingResult;
          }),
        );
      }),

      catchError((err) => {
        const message =
          err?.status === 0
            ? 'Network error. Check your connection.'
            : 'Something went wrong. Please try again.';
        return of<BookingResult>({ success: false, error: message });
      }),
    );
  }

  _formatLabel(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
  }
}
