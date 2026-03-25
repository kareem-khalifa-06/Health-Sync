import { AppointmentRow } from './../dashboard/dashboard.component';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointments.service';
import { Appointment } from '../../../models/appointment';
import { CommonModule } from '@angular/common';
import { forkJoin, interval, of, Subject, switchMap, takeUntil } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorsService } from '../../../core/services/doctors.service';
import { BookingService } from '../../../core/services/booking.service';
import dayjs from 'dayjs';
import { Doctor } from '../../../models/doctor';
import { FormsModule } from '@angular/forms';
import { RescheduleDialogComponent } from '../reschedule-dialog/reschedule-dialog.component';

export interface CalendarDay {
  date: string;
  label: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  rows: AppointmentRow[];
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule,RescheduleDialogComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  // ── Data ─────────────────────────────────────────────────────
  appointments = signal<Appointment[]>([]);
  appointmentRows: AppointmentRow[] = [];
  filterAppointments = signal<AppointmentRow[]>([]);

  todayAppointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];
  confirmedAppointments: Appointment[] = [];
  cancelledAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];

  doctors: Doctor[] = [];
  isLoading = false;
  lastUpdated = '';

  // ── Filters ──────────────────────────────────────────────────
  searchQuery = '';
  statusFilter = 'All';
  doctorFilter = 'All';
  dateFilter = '';

  currentView: 'list' | 'kanban' | 'calendar' = 'list';

  calendarMonth = dayjs().startOf('month');
  calendarDays: CalendarDay[] = [];
  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ── Bulk selection ───────────────────────────────────────────
  selectedIds = new Set<string>();
  get selectedCount() {
    return this.selectedIds.size;
  }
  get allSelected() {
    const rows = this.filterAppointments();
    return (
      rows.length > 0 &&
      rows.every((r) => this.selectedIds.has(r.appointment.id))
    );
  }

  // ── Reschedule dialog ────────────────────────────────────────
  showReschedule = false;
  rescheduleRow: AppointmentRow | null = null;

  // ── Real-time ────────────────────────────────────────────────
  private destroy$ = new Subject<void>();
  private readonly REFRESH_INTERVAL = 3000; // 30 seconds

  td = dayjs().format('YYYY-MM-DD');

  constructor(
    private _AppointmentService: AppointmentService,
    private _PatientService: PatientService,
    private _DoctorsService: DoctorsService,
    public _BookingService: BookingService,
  ) {}

  ngOnInit() {
    this._DoctorsService
      .renderDoctors()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.doctors = res));

    // Initial load
    this.loadData();

    // ── Task 4: Real-time polling every 30s ──────────────────
    interval(this.REFRESH_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadData(true));
  }

  loadData(silent = false) {
    if (!silent) this.isLoading = true;

    this._AppointmentService
      .renderAppointments()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((apps) => {
          this.appointments.set(apps);
          this.todayAppointments = apps.filter(
            (a) => a.appointmentDate === this.td,
          );
          this.pendingAppointments = apps.filter((a) => a.status === 'pending');
          this.confirmedAppointments = apps.filter(
            (a) => a.status === 'confirmed',
          );
          this.cancelledAppointments = apps.filter(
            (a) => a.status === 'cancelled',
          );
          this.completedAppointments = apps.filter(
            (a) => a.status === 'completed',
          );

          if (apps.length === 0) return of([]);

          return forkJoin(
            apps.map((a) =>
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
          this.appointmentRows = rows;
          this.applyFilters();
          this.buildCalendar();
          this.isLoading = false;
          this.lastUpdated = dayjs().format('HH:mm:ss');
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  // ── Task 1: Status update with optimistic UI + rollback ──────
  updateStatus(
    row: AppointmentRow,
    status: 'cancelled' | 'confirmed' | 'completed',
  ) {
    const previous = row.appointment.status;
    row.appointment.status = status; // optimistic update
    this.applyFilters();

    this._AppointmentService.updateAppointment(row.appointment).subscribe({
      next: () => this.loadData(true),
      error: () => {
        row.appointment.status = previous; // rollback
        this.applyFilters();
      },
    });
  }

  // ── Task 2: Reschedule dialog ────────────────────────────────
  openReschedule(row: AppointmentRow) {
    this.rescheduleRow = row;
    this.showReschedule = true;
  }

  onRescheduleConfirmed(updated: Appointment) {
    this.showReschedule = false;
    this.rescheduleRow = null;
    this._AppointmentService.updateAppointment(updated).subscribe({
      next: () => this.loadData(true),
    });
  }

  onRescheduleCancelled() {
    this.showReschedule = false;
    this.rescheduleRow = null;
  }

  // ── Task 3: Bulk selection ───────────────────────────────────
  toggleSelect(id: string) {
    this.selectedIds.has(id)
      ? this.selectedIds.delete(id)
      : this.selectedIds.add(id);
    this.selectedIds = new Set(this.selectedIds); // trigger change detection
  }

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedIds = new Set();
    } else {
      this.selectedIds = new Set(
        this.filterAppointments().map((r) => r.appointment.id),
      );
    }
  }

  clearSelection() {
    this.selectedIds = new Set();
  }

  bulkUpdateStatus(status: 'confirmed' | 'cancelled') {
    const targets = this.appointmentRows.filter((r) =>
      this.selectedIds.has(r.appointment.id),
    );

    const updates = targets.map((r) => {
      const updated = { ...r.appointment, status };
      return this._AppointmentService.updateAppointment(updated);
    });

    forkJoin(updates).subscribe({
      next: () => {
        this.clearSelection();
        this.loadData(true);
      },
    });
  }


  exportCSV() {
    const targets =
      this.selectedIds.size > 0
        ? this.appointmentRows.filter((r) =>
            this.selectedIds.has(r.appointment.id),
          )
        : this.filterAppointments();

    const headers = [
      'ID',
      'Date',
      'Time',
      'Patient',
      'Doctor',
      'Type',
      'Status',
      'Reason',
    ];
    const rows = targets.map((r) =>
      [
        r.appointment.id,
        r.appointment.appointmentDate,
        r.appointment.appointmentTime,
        r.patient.fullName,
        r.doctor.fullName,
        r.appointment.type,
        r.appointment.status,
        `"${r.appointment.reason ?? ''}"`,
      ].join(','),
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `appointments-${dayjs().format('YYYY-MM-DD')}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  applyFilters() {
    let filtered = this.appointmentRows ?? [];

    if (this.searchQuery?.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.patient.fullName.toLowerCase().includes(q) ||
          r.doctor.fullName.toLowerCase().includes(q),
      );
    }

    if (this.statusFilter !== 'All')
      filtered = filtered.filter(
        (r) => r.appointment.status === this.statusFilter,
      );

    if (this.doctorFilter !== 'All')
      filtered = filtered.filter(
        (r) => r.doctor.fullName === this.doctorFilter,
      );

    if (this.dateFilter?.trim())
      filtered = filtered.filter(
        (r) => r.appointment.appointmentDate === this.dateFilter,
      );

    this.filterAppointments.set(filtered);
    if (this.currentView === 'calendar') this.buildCalendar();
  }

  onSearch(q: string) {
    this.searchQuery = q;
    this.applyFilters();
  }
  onStatusFilter(q: string) {
    this.statusFilter = q;
    this.applyFilters();
  }
  onDoctorFilter(q: string) {
    this.doctorFilter = q;
    this.applyFilters();
  }
  onDateFilter(q: string) {
    this.dateFilter = q;
    this.applyFilters();
  }

  // ── View ─────────────────────────────────────────────────────
  setView(view: 'list' | 'kanban' | 'calendar') {
    this.currentView = view;
    if (view === 'calendar') this.buildCalendar();
  }

  // ── Kanban getters ───────────────────────────────────────────
  get kanbanPending() {
    return this.filterAppointments().filter(
      (r) => r.appointment.status === 'pending',
    );
  }
  get kanbanConfirmed() {
    return this.filterAppointments().filter(
      (r) => r.appointment.status === 'confirmed',
    );
  }
  get kanbanCompleted() {
    return this.filterAppointments().filter(
      (r) => r.appointment.status === 'completed',
    );
  }
  get kanbanCancelled() {
    return this.filterAppointments().filter(
      (r) => r.appointment.status === 'cancelled',
    );
  }

  // ── Calendar ─────────────────────────────────────────────────
  buildCalendar() {
    const rows = this.filterAppointments();
    const start = this.calendarMonth.startOf('month').startOf('week');
    const end = this.calendarMonth.endOf('month').endOf('week');
    const days: CalendarDay[] = [];
    let cursor = start;

    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      const dateStr = cursor.format('YYYY-MM-DD');
      days.push({
        date: dateStr,
        label: cursor.date(),
        isToday: dateStr === this.td,
        isCurrentMonth: cursor.month() === this.calendarMonth.month(),
        rows: rows.filter((r) => r.appointment.appointmentDate === dateStr),
      });
      cursor = cursor.add(1, 'day');
    }
    this.calendarDays = days;
  }

  prevMonth() {
    this.calendarMonth = this.calendarMonth.subtract(1, 'month');
    this.buildCalendar();
  }
  nextMonth() {
    this.calendarMonth = this.calendarMonth.add(1, 'month');
    this.buildCalendar();
  }
  get calendarTitle() {
    return this.calendarMonth.format('MMMM YYYY');
  }

  formatTime = this._BookingService._formatLabel;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
