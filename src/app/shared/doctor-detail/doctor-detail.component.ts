import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Doctor,
  DoctorSchedule,
  DoctorReview,
  TimeSlot,
} from '../../models/doctor';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../core/services/doctors.service';

type TabType = 'overview' | 'schedule' | 'reviews';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.css'],
})
export class DoctorDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  doctorService = inject(DoctorsService);

  doctor!: Doctor;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.doctorService.getDoctorById(id!).subscribe((res) => {
      this.doctor = res;
    });
  }

  activeTab: TabType = 'overview';
  selectedDay: DoctorSchedule | null = null;
  selectedSlot: TimeSlot | null = null;
  isSaved = false;

  tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📋' },
    { key: 'schedule', label: 'Schedule', icon: '📅' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

  // ── schedule — matches db.json doctorSchedules[] filtered by doctorId="d1" ─
  schedule: DoctorSchedule[] = [
    {
      id: 'sch-d1-1',
      doctorId: 'd1',
      day: 'Monday',
      date: '2026-03-04',
      dayShort: 'Mon',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: false },
      ],
    },
    {
      id: 'sch-d1-2',
      doctorId: 'd1',
      day: 'Tuesday',
      date: '2026-03-05',
      dayShort: 'Tue',
      slots: [
        { time: '09:00 AM', available: false },
        { time: '10:00 AM', available: true },
        { time: '11:30 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '04:00 PM', available: false },
      ],
    },
    {
      id: 'sch-d1-3',
      doctorId: 'd1',
      day: 'Wednesday',
      date: '2026-03-06',
      dayShort: 'Wed',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '10:30 AM', available: true },
        { time: '12:00 PM', available: false },
        { time: '02:30 PM', available: true },
        { time: '04:00 PM', available: true },
      ],
    },
    {
      id: 'sch-d1-4',
      doctorId: 'd1',
      day: 'Thursday',
      date: '2026-03-07',
      dayShort: 'Thu',
      slots: [
        { time: '08:30 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:30 AM', available: false },
        { time: '03:00 PM', available: true },
        { time: '04:30 PM', available: true },
      ],
    },
    {
      id: 'sch-d1-5',
      doctorId: 'd1',
      day: 'Friday',
      date: '2026-03-08',
      dayShort: 'Fri',
      slots: [
        { time: '09:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
      ],
    },
  ];

  // ── reviews — matches db.json doctorReviews[] filtered by doctorId="d1" ────
  reviews: DoctorReview[] = [
    {
      id: 'rev1',
      doctorId: 'd1',
      patientId: 'p1',
      patientName: 'James Roberts',
      patientInitials: 'JR',
      rating: 5,
      date: '2026-02-12',
      createdAt: '2026-02-12T11:00:00.000Z',
      comment:
        'Dr.khadija elbakry is absolutely incredible. She took the time to explain everything clearly and made me feel at ease throughout. I would highly recommend her.',
    },
    {
      id: 'rev2',
      doctorId: 'd1',
      patientId: 'p2',
      patientName: 'Maria Lopez',
      patientInitials: 'ML',
      rating: 5,
      date: '2026-01-28',
      createdAt: '2026-01-28T14:30:00.000Z',
      comment:
        'Dr.khadija elbakry is thorough, warm, and highly professional. Best cardiologist I have ever seen.',
    },
    {
      id: 'rev3',
      doctorId: 'd1',
      patientId: 'p3',
      patientName: 'Thomas Brown',
      patientInitials: 'TB',
      rating: 4,
      date: '2026-01-05',
      createdAt: '2026-01-05T10:00:00.000Z',
      comment:
        'Great experience overall. Very knowledgeable and attentive. Highly recommend.',
    },
    {
      id: 'rev4',
      doctorId: 'd1',
      patientId: 'p4',
      patientName: 'Sophia Chen',
      patientInitials: 'SC',
      rating: 5,
      date: '2025-12-20',
      createdAt: '2025-12-20T09:00:00.000Z',
      comment:
        'Exceptional doctor. Her expertise and compassion made my recovery journey much easier.',
    },
  ];

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
  }

  selectDay(day: DoctorSchedule): void {
    this.selectedDay = day;
    this.selectedSlot = null;
  }

  selectSlot(slot: TimeSlot): void {
    if (slot.available) this.selectedSlot = slot;
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }
  getRatingBarWidth(star: number): string {
    if (!this.reviews.length) return '0%';
    const count = this.reviews.filter(
      (r) => Math.round(r.rating) === star,
    ).length;
    return `${Math.round((count / this.reviews.length) * 100)}%`;
  }

  formatPatientCount(count: number): string {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
  }
  get bookButtonLabel(): string {
    if (this.selectedDay && this.selectedSlot) {
      return `Confirm — ${this.selectedDay.dayShort}, ${this.selectedSlot.time}`;
    }
    return 'Book Appointment';
  }
  get canBook(): boolean {
    return !!(this.selectedDay && this.selectedSlot?.available);
  }

  bookAppointment(): void {
    if (!this.canBook) return;
    console.log('Booking payload:', {
      doctorId: this.doctor.id,
      scheduleId: this.selectedDay!.id,
      day: this.selectedDay!.day,
      date: this.selectedDay!.date,
      time: this.selectedSlot!.time,
      fee: this.doctor.consultationFee,
    });
  }

  goBack(): void {
    window.history.back();
  }
}
