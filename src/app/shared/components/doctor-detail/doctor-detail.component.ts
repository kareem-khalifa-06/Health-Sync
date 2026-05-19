import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Doctor,
  DoctorSchedule,
  DoctorReview,
  TimeSlot,
} from '../../../models/doctor';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../../core/services/doctors.service';
import { BackButtonComponent } from '../back-button/back-button.component';
import { handleDoctorAvailabilityStatus } from '../../../utils/handleDoctorAvailabilityStatus';

type TabType = 'overview' | 'schedule' | 'reviews';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.css'],
})
export class DoctorDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  doctorService = inject(DoctorsService);
  handleDoctorAvailabilityStatus = handleDoctorAvailabilityStatus;
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

  
  schedule: DoctorSchedule[] =[];
  // ── reviews — matches db.json doctorReviews[] filtered by doctorId="d1" ────
  reviews: DoctorReview[] =[];

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
      return `Confirm — ${this.selectedDay.dayShort}, ${this.selectedSlot.start}`;
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
      time: this.selectedSlot!.start,
      fee: this.doctor.consultationFee,
    });
  }
}
