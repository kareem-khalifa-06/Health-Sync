import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, interval, of, Subject, switchMap, takeUntil } from 'rxjs';
import dayjs from 'dayjs';

import { AppointmentService } from '../../../core/services/appointments.service';
import { DoctorsService } from '../../../core/services/doctors.service';
import { PatientService } from '../../../core/services/patient.service';
import { BookingService } from '../../../core/services/booking.service';
import { Doctor, DoctorSchedule } from '../../../models/doctor';
import { AppointmentRow } from '../admin-dashboard/dashboard.component';

// ── Types ────────────────────────────────────────────────────

export interface BlockedSlot {
  id: string;
  date: string;
  time: string;
  reason: string;
}

export interface WeekDay {
  date: string;
  label: string;
  dayNum: number;
  isToday: boolean;
  rows: AppointmentRow[];
  blockedSlots: BlockedSlot[];
}

// ── Component ────────────────────────────────────────────────

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.css',
})
export class DoctorScheduleComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  // ── Data ─────────────────────────────────────────────────
  doctor!: Doctor;
  doctorId = '';
  allRows: AppointmentRow[] = [];
  todayRows: AppointmentRow[] = [];
  weekDays: WeekDay[] = [];
  blockedSlots: BlockedSlot[] = [];
  DoctorSchedule: DoctorSchedule[] = [];
  // ── View ─────────────────────────────────────────────────
  currentView: 'timeline' | 'week' = 'timeline';

  // ── Patient preview ───────────────────────────────────────
  previewRow: AppointmentRow | null = null;
  previewVisible = false;

  // ── Block slot ────────────────────────────────────────────
  showBlockDialog = false;
  blockDate = '';
  blockTime = '';
  blockReason = '';
  blockSlots: { time: string; label: string }[] = [];

  // ── Week nav ─────────────────────────────────────────────
  weekStart = dayjs().startOf('week');
  get weekLabel() {
    return `${this.weekStart.format('MMM D')} – ${this.weekStart.add(6, 'day').format('MMM D, YYYY')}`;
  }

  // ── Timeline ─────────────────────────────────────────────
  readonly timelineHours = [
    '08:00',
    '08:30',
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

  td = dayjs().format('YYYY-MM-DD');
  todayFull = dayjs().format('dddd, DD MMMM YYYY');
  lastUpdated = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private _AppointmentService: AppointmentService,
    private _DoctorsService: DoctorsService,
    private _PatientService: PatientService,
    public _BookingService: BookingService,
  ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.parent?.paramMap.get('id') ?? '';
    this._DoctorsService.getDoctorById(this.doctorId).subscribe((res) => {
      this.doctor = res;
      console.log(this.doctor, this.doctorId);
    });
    this._DoctorsService.getDoctorSchedule(this.doctorId).subscribe({
      next: (res) => {
        this.DoctorSchedule = res;
        console.log('Dijooo  ', this.DoctorSchedule);
      }
    });

    // Real-time refresh every 30s
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadData(true));
  }

  // ── Load appointments for selected doctor ─────────────────
  loadData(silent = false) {
    if (!silent) this.isLoading = true;

    this._AppointmentService
      .renderAppointments()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((apps) => {
          const mine = apps.filter((a) => a.doctorId === this.doctorId);
          if (mine.length === 0) return of([]);
          return forkJoin(
            mine.map((a) =>
              forkJoin({
                patient: this._PatientService.getPatientById(a.patientId),
                doctor: this._DoctorsService.getDoctorById(a.doctorId),
              }).pipe(
                switchMap(({ patient, doctor }) =>
                  of({ appointment: a, patient, doctor }),
                ),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: (rows) => {
          this.allRows = rows;
          this.todayRows = rows.filter(
            (r) => r.appointment.appointmentDate === this.td,
          );
          this.isLoading = false;
          this.lastUpdated = dayjs().format('HH:mm:ss');
          this.buildWeek();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  // ── Task: Mark as completed ───────────────────────────────
  markCompleted(row: AppointmentRow) {
    const prev = row.appointment.status;
    row.appointment.status = 'completed';

    this._AppointmentService.updateAppointment(row.appointment).subscribe({
      next: () => this.loadData(true),
      error: () => {
        row.appointment.status = prev;
      },
    });
  }

  // ── Task: Patient preview ─────────────────────────────────
  showPreview(row: AppointmentRow) {
    this.previewRow = row;
    this.previewVisible = true;
  }

  hidePreview() {
    this.previewVisible = false;
    this.previewRow = null;
  }

  // ── Task: Week view ───────────────────────────────────────
  buildWeek() {
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = this.weekStart.add(i, 'day');
      const dateStr = day.format('YYYY-MM-DD');
      return {
        date: dateStr,
        label: day.format('ddd'),
        dayNum: day.date(),
        isToday: dateStr === this.td,
        rows: this.allRows.filter(
          (r) => r.appointment.appointmentDate === dateStr,
        ),
        blockedSlots: this.blockedSlots.filter((b) => b.date === dateStr),
      };
    });
  }

  prevWeek() {
    this.weekStart = this.weekStart.subtract(1, 'week');
    this.buildWeek();
  }
  nextWeek() {
    this.weekStart = this.weekStart.add(1, 'week');
    this.buildWeek();
  }
  goToday() {
    this.weekStart = dayjs().startOf('week');
    this.buildWeek();
  }

  // ── Task: Block time slots ────────────────────────────────
  openBlockDialog(date = this.td, time = '') {
    this.blockDate = date;
    this.blockTime = time;
    this.blockReason = '';
    this.showBlockDialog = true;
    this.loadBlockSlots(date);
  }

  loadBlockSlots(date: string) {
    if (!date || !this.doctorId) return;
    this._BookingService
      .getSlotStatuses(this.doctorId, date)
      .pipe(takeUntil(this.destroy$))
      .subscribe((slots) => {
        this.blockSlots = slots
          .filter((s) => s.available)
          .map((s) => ({ time: s.time, label: s.label }));
      });
  }

  onBlockDateChange(date: string) {
    this.blockDate = date;
    this.blockTime = '';
    this.loadBlockSlots(date);
  }

  confirmBlock() {
    if (!this.blockDate || !this.blockTime) return;
    this.blockedSlots = [
      ...this.blockedSlots,
      {
        id: `block-${Date.now()}`,
        date: this.blockDate,
        time: this.blockTime,
        reason: this.blockReason.trim() || 'Blocked',
      },
    ];
    this.buildWeek();
    this.showBlockDialog = false;
  }

  removeBlock(id: string) {
    this.blockedSlots = this.blockedSlots.filter((b) => b.id !== id);
    this.buildWeek();
  }

  cancelBlock() {
    this.showBlockDialog = false;
  }

  // ── Slot lookup helpers ───────────────────────────────────
  getSlotRow(time: string, date = this.td): AppointmentRow | undefined {
    return this.allRows.find(
      (r) =>
        r.appointment.appointmentDate === date &&
        r.appointment.appointmentTime === time,
    );
  }

  getSlotBlock(time: string, date = this.td): BlockedSlot | undefined {
    return this.blockedSlots.find((b) => b.date === date && b.time === time);
  }

  isCurrentSlot(time: string): boolean {
    const [h, m] = time.split(':').map(Number);
    const now = dayjs();
    const slotMins = h * 60 + m;
    const nowMins = now.hour() * 60 + now.minute();
    return nowMins >= slotMins && nowMins < slotMins + 30;
  }

  // ── Stats ─────────────────────────────────────────────────
  get todayTotal() {
    return this.todayRows.length;
  }
  get todayConfirmed() {
    return this.todayRows.filter((r) => r.appointment.status === 'confirmed')
      .length;
  }
  get todayPending() {
    return this.todayRows.filter((r) => r.appointment.status === 'pending')
      .length;
  }
  get todayCompleted() {
    return this.todayRows.filter((r) => r.appointment.status === 'completed')
      .length;
  }

  formatTime = this._BookingService._formatLabel;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
