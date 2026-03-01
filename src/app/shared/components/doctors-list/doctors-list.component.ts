import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor } from '../../../models/doctor';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css',
})
export class DoctorsListComponent {
  private _DoctorsService = inject(DoctorsService);
  private destroyRef = inject(DestroyRef);
  todayDate = dayjs().format('dddd');
  searchQuery = '';
  statusFilter = 'All';
  ratingFilter = '6';
  specializationFilter='All';
  doctorsList = signal<Doctor[] | null>(null);
  filteredDoctors = signal<Doctor[] | null>(null);
  showAddDoctorForm:boolean=false;
  renderDoctors() {
    const sub = this._DoctorsService.renderDoctors().subscribe({
      next: (res) => {
        this.doctorsList.set(res);
        this.filteredDoctors.set(res);
        this.searchQuery = '';
        this.ratingFilter = '6';
        this.statusFilter = 'All';
        this.specializationFilter = 'All';
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  ngOnInit() {
    this.renderDoctors();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onFilterStatus(query: string) {
    this.statusFilter = query;
    this.applyFilters();
  }

  onFilterRating(rating: string) {
    this.ratingFilter = rating;
    this.applyFilters();
  }
  onFilterSpecialization(query: string) {
    this.specializationFilter=query;
    this.applyFilters();
  }

  applyFilters() {
    let doctors = this.doctorsList() ?? [];

    // search filter
    if (this.searchQuery.trim()) {
      doctors = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    }

    // status filter
    if (this.statusFilter === 'available') {
      doctors = doctors.filter((doc) =>
        this.handleDoctorAvailabilityStatus(doc),
      );
    } else if (this.statusFilter === 'not-available') {
      doctors = doctors.filter(
        (doc) => !this.handleDoctorAvailabilityStatus(doc),
      );
    }

    // rating filter
    if (this.ratingFilter !== '6') {
      doctors = doctors.filter(
        (doc) => Number(doc.rating) >= +this.ratingFilter,
      );
    }
    //specializaiton filter
     if (this.specializationFilter.trim()) {
      doctors = doctors.filter((doc) =>
        doc.specialization.toLowerCase().includes(this.specializationFilter.toLowerCase()),
      );
    }
    this.filteredDoctors.set(doctors);
  }
  handleDoctorAvailabilityStatus(doc: Doctor): boolean {
    return doc.availableDays.includes(this.todayDate);
  }
  onDelete(id: string) {
    this._DoctorsService.deleteDoctor(id).subscribe({
      next: () => {
        this.renderDoctors();
      },
    });
  }

}
