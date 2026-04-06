import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { AppointmentRow } from '../admin-dashboard/dashboard.component';
import { Appointment } from '../../../models/appointment';
import {
  BookingService,
  SlotStatus,
} from '../../../core/services/booking.service';

@Component({
  selector: 'app-reschedule-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reschedule-dialog.component.html',
  styleUrl: './reschedule-dialog.component.css',
})
export class RescheduleDialogComponent implements OnInit, OnDestroy {
  @Input() row!: AppointmentRow;
  @Output() confirmed = new EventEmitter<Appointment>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  slotStatuses: SlotStatus[] = [];
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _BookingService: BookingService,
  ) {}

  ngOnInit() {
    // Pre-fill with existing appointment values
    this.form = this.fb.group({
      appointmentDate: [
        this.row.appointment.appointmentDate,
        Validators.required,
      ],
      appointmentTime: [
        this.row.appointment.appointmentTime,
        Validators.required,
      ],
    });

    // Reload slots when date changes
    combineLatest([this.form.get('appointmentDate')!.valueChanges])
      .pipe(
        filter(([date]) => !!date),
        takeUntil(this.destroy$),
        switchMap(([date]) =>
          this._BookingService.getSlotStatuses(
            this.row.appointment.doctorId,
            date,
          ),
        ),
      )
      .subscribe((slots) => {
        // Mark current slot as available since we're rescheduling our own appointment
        this.slotStatuses = slots.map((s) => ({
          ...s,
          available:
            s.time === this.row.appointment.appointmentTime
              ? true // own slot is always available
              : s.available,
        }));
        // Reset time if the currently selected one is no longer available
        const currentTime = this.form.get('appointmentTime')!.value;
        const stillAvailable = this.slotStatuses.find(
          (s) => s.time === currentTime && s.available,
        );
        if (!stillAvailable) this.form.get('appointmentTime')!.reset('');
      });

    // Trigger initial slot load for the existing date
    this.form
      .get('appointmentDate')!
      .setValue(this.row.appointment.appointmentDate);
  }

  get appointmentDate() {
    return this.form.get('appointmentDate');
  }
  get appointmentTime() {
    return this.form.get('appointmentTime');
  }

  onConfirm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const updated: Appointment = {
      ...this.row.appointment,
      appointmentDate: this.form.value.appointmentDate,
      appointmentTime: this.form.value.appointmentTime,
      updatedAt: new Date().toISOString(),
    };

    // Run conflict check excluding own slot
    this._BookingService
      .hasConflict(
        {
          doctorId: updated.doctorId,
          patientId: updated.patientId,
          appointmentDate: updated.appointmentDate,
          appointmentTime: updated.appointmentTime,
          appointmentDuration: updated.duration,
          type: updated.type,
          reason: updated.reason ?? '',
        },
        updated.id,
      )
      .subscribe((conflict) => {
        this.isLoading = false;
        if (conflict) {
          this.error = `${updated.appointmentTime} on ${updated.appointmentDate} was just booked by someone else. Please choose another slot.`;
          // Refresh slots
          this._BookingService
            .getSlotStatuses(updated.doctorId, updated.appointmentDate)
            .subscribe((slots) => (this.slotStatuses = slots));
        } else {
          this.confirmed.emit(updated);
        }
      });
  }

  onCancel() {
    this.cancelled.emit();
  }

  formatTime = this._BookingService._formatLabel;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
