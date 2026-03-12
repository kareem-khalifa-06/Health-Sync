import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor } from '../../../models/doctor';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

export interface ScheduleSlot {
  start: string;
  end: string;
}
export interface ScheduleDay {
  name: string;
  enabled: boolean;
  slots: ScheduleSlot[];
}

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,BackButtonComponent],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.css',
})
export class DoctorLayoutComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _doctorsService = inject(DoctorsService);

  doctor: Doctor | undefined = undefined;
  editMode = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // ── Edit Form ────────────────────────────────────────────────
  editForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    specialty: new FormControl('', Validators.required),
    subSpecialty: new FormControl(''),
    department: new FormControl(''),
    experience: new FormControl<number>(0),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    hospital: new FormControl(''),
    location: new FormControl(''),
    bio: new FormControl(''),
    consultationFee: new FormControl<number>(0),
    isAvailableToday: new FormControl(true),
  });

  // ── Weekly Schedule ──────────────────────────────────────────
  scheduleDays: ScheduleDay[] = [
    { name: 'Sunday', enabled: false, slots: [] },
    {
      name: 'Monday',
      enabled: true,
      slots: [{ start: '09:00', end: '17:00' }],
    },
    {
      name: 'Tuesday',
      enabled: true,
      slots: [{ start: '09:00', end: '17:00' }],
    },
    {
      name: 'Wednesday',
      enabled: true,
      slots: [{ start: '09:00', end: '13:00' }],
    },
    {
      name: 'Thursday',
      enabled: true,
      slots: [{ start: '09:00', end: '17:00' }],
    },
    { name: 'Friday', enabled: false, slots: [] },
    { name: 'Saturday', enabled: false, slots: [] },
  ];

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this._doctorsService.getDoctorById(id!).subscribe({
      next: (doc) => {
        this.doctor = doc;
        this.syncScheduleFromDoctor(doc);
      },
      error: (err) => console.error('Failed to load doctor', err),
    });
  }

  // ── Edit Mode ────────────────────────────────────────────────
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode && this.doctor) {
      this.patchForm(this.doctor);
    } else {
      this.previewUrl = null;
      this.selectedFile = null;
    }
  }

  patchForm(doc: Doctor): void {
    this.editForm.patchValue({
      firstName: doc.firstName,
      lastName: doc.lastName,
      specialty: doc.specialty,
      subSpecialty: doc.subSpecialty ?? '',
      department: doc.department ?? '',
      experience: doc.experience,
      email: doc.email,
      phone: doc.phone,
      hospital: doc.hospital ?? '',
      location: doc.location ?? '',
      bio: doc.bio ?? '',
      consultationFee: doc.consultationFee,
      isAvailableToday: doc.isAvailableToday,
    });
  }

  saveProfile(): void {
    if (this.editForm.invalid || !this.doctor) return;

    const v = this.editForm.value;
    const updated: Doctor = {
      ...this.doctor,
      ...(v as Partial<Doctor>),
      fullName: `${v.firstName} ${v.lastName}`,
    };

    if (this.selectedFile) {
      // TODO: replace with your upload service
      // this._uploadService.upload(this.selectedFile).subscribe(url => updated.avatarUrl = url)
      console.log('Uploading:', this.selectedFile.name);
    }

    this._doctorsService.updateDoctor(updated).subscribe({
      next: () => {
        this.doctor = updated;
        this.editMode = false;
        this.selectedFile = null;
        this.previewUrl = null;
      },
      error: (err) => console.error('Save failed', err),
    });
  }

  // ── Photo Upload ─────────────────────────────────────────────
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB.');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.previewUrl = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  // ── Schedule ─────────────────────────────────────────────────
  syncScheduleFromDoctor(doc: Doctor): void {
    if (!doc.availableDays?.length) return;
    this.scheduleDays = this.scheduleDays.map((d) => {
      const enabled = doc.availableDays.includes(d.name);
      const slots = doc.availableTimeSlots?.length
        ? [...doc.availableTimeSlots]
        : [{ start: '09:00', end: '17:00' }];
      return { ...d, enabled, slots: enabled ? slots : [] };
    });
  }

  addSlot(day: ScheduleDay): void {
    day.slots.push({ start: '09:00', end: '17:00' });
  }

  removeSlot(day: ScheduleDay, index: number): void {
    day.slots.splice(index, 1);
  }

  saveSchedule(): void {
    if (!this.doctor) return;
    const updated: Doctor = {
      ...this.doctor,
      availableDays: this.scheduleDays
        .filter((d) => d.enabled)
        .map((d) => d.name),
      availableTimeSlots: this.scheduleDays
        .filter((d) => d.enabled)
        .flatMap((d) => d.slots),
    };
    this._doctorsService.updateDoctor(updated).subscribe({
      next: () => (this.doctor = updated),
      error: (err) => console.error('Schedule save failed', err),
    });
  }
}
