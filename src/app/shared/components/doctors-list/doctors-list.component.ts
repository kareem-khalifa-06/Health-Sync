import { Component, inject, signal } from '@angular/core';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor } from '../../../models/doctor';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SPECIALIZATIONS } from '../../../Data/specializations';
import { RouterLink } from '@angular/router';
import { handleDoctorAvailabilityStatus } from '../../../utils/handleDoctorAvailabilityStatus';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css',
})
export class DoctorsListComponent {

  pageSize = 9;
  currentPage = 1;

  get totalPages(): number {
   
    return Math.ceil((this.filteredDoctors() ?? []).length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedDoctors(): Doctor[] {
  
    const start = (this.currentPage - 1) * this.pageSize;
    return (this.filteredDoctors() ?? []).slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      (this.filteredDoctors() ?? []).length,
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  id = signal<number>(10);
  private _DoctorsService = inject(DoctorsService);
  handleDoctorAvailabilityStatus = handleDoctorAvailabilityStatus;
  specs = SPECIALIZATIONS;
  searchQuery = '';
  statusFilter = 'All';
  ratingFilter = '6';
  specializationFilter = 'All';
  doctorsList = signal<Doctor[] | null>(null);
  filteredDoctors = signal<Doctor[] | null>(null);
  showAddDoctorForm = false;

  addDoctorForm = new FormGroup({
    name: new FormControl('', Validators.required),
    experience: new FormControl('', Validators.required),
    specialzation: new FormControl('', Validators.required),
    consultationFee: new FormControl('', Validators.required),
    availableDays: new FormControl('', Validators.required),
  });


  renderDoctors() {
    this._DoctorsService.renderDoctors().subscribe({
      next: (res) => {
        this.doctorsList.set(res);
        this.filteredDoctors.set(res);
        this.searchQuery = '';
        this.ratingFilter = '6';
        this.statusFilter = 'All';
        this.specializationFilter = 'All';
        this.currentPage = 1;
      },
    });
  }

  ngOnInit() {
    this.renderDoctors();
  }

  // ── Filters ───────────────────────────────────────────────────
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
    this.specializationFilter = query;
    this.applyFilters();
  }

  applyFilters() {
  
    this.currentPage = 1;

    let doctors = this.doctorsList() ?? [];

    if (this.searchQuery.trim()) {
      doctors = doctors.filter((doc) =>
        doc.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    }

    if (this.statusFilter === 'available') {
      doctors = doctors.filter((doc) =>
        this.handleDoctorAvailabilityStatus(doc),
      );
    } else if (this.statusFilter === 'not-available') {
      doctors = doctors.filter(
        (doc) => !this.handleDoctorAvailabilityStatus(doc),
      );
    }

    if (this.ratingFilter !== '6') {
      doctors = doctors.filter(
        (doc) => Number(doc.rating) >= +this.ratingFilter,
      );
    }

    if (this.specializationFilter !== 'All') {
      doctors = doctors.filter(
        (doc) => doc.specialty === this.specializationFilter,
      );
    }

    this.filteredDoctors.set(doctors);
  }

  // ── Actions ───────────────────────────────────────────────────
  onDelete(id: string) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    this._DoctorsService.deleteDoctor(`${id}`).subscribe({
      next: () => this.renderDoctors(),
      error: (err) => console.error('Delete failed', err),
    });
  }

  showForm() {
    this.showAddDoctorForm = true;
  }

  addDoctor(): void {
    if (!this.addDoctorForm.valid) return;

    const form = this.addDoctorForm.value;

    const newDoctor: Doctor = {
      id: `d${this.id()}`,
      userId: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      fullName: form.name!,
      initials: '',
      avatarUrl: '',
      specialty: form.specialzation!,
      subSpecialty: '',
      department: '',
      hospital: '',
      location: '',
      email: '',
      phone: '',
      bio: '',
      status: 'active',
      isAvailableToday: true,
      consultationFee: Number(form.consultationFee!),
      experience: Number(form.experience!),
      totalPatients: 140,
      rating: 5,
      totalReviews: 140,
      qualifications: [],
      languages: [],
      services: [],
      education: [],
      achievements: [],
      availableDays: [],
      availableTimeSlots: [{ start: '', end: '' }],
    };

    this._DoctorsService
      .addDoctor(newDoctor)
      .subscribe(() => this.renderDoctors());
    this.id.update((id) => id + 1);
    this.showAddDoctorForm = false;
    this.addDoctorForm.reset();
  }
}
