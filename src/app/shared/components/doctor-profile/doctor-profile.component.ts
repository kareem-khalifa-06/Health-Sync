import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor, DoctorSchedule } from '../../../models/doctor';
import { AuthService } from '../../../core/services/auth.service';
import { ConstantPool } from '@angular/compiler';
import { handleDoctorAvailabilityStatus } from '../../../utils/handleDoctorAvailabilityStatus';
import { catchError, concat, forkJoin, of, toArray } from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';

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
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css',
})
export class DoctorProfileComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _doctorsService = inject(DoctorsService);
  private _authService = inject(AuthService);
  _toast=inject(ToastrService);
  handleDoctorAvailabilityStatus = handleDoctorAvailabilityStatus;
  doctor: Doctor | undefined = undefined;
  doctorId = '';
  editMode = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  doctorSchedule: DoctorSchedule[] = [];
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

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    this.doctorId = this._route.snapshot.parent?.paramMap.get('id') ?? '';

    const url = this._router.url;

    this._doctorsService.getDoctorById(this.doctorId).subscribe({
      next: (doc) => {
        this.doctor = doc;
        console.log(doc);
      },
      error: (err) => console.error('Failed to load doctor', err),
    });
    this._doctorsService.getDoctorSchedule(this.doctorId).subscribe({
      next: (res) => {
        this.doctorSchedule = res;
        console.log(res);
      },
      error: () => {
        console.log('Failed');
      },
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
      fullName: `Dr. ${v.firstName} ${v.lastName}`,
      // ← persist the new photo as avatarUrl
      avatarUrl: this.previewUrl ?? this.doctor.avatarUrl,
    };

    this._doctorsService.updateDoctor(updated, this.doctorId).subscribe({
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
saveSchedule(): void {
  if (!this.doctor) return;

  const scheduleUpdates = this.doctorSchedule.map((d) =>
    this._doctorsService.updateSchedule(d).pipe(
      catchError((err) => {
        console.error(`Failed to update schedule for ${d.day}`, err);
        return of(null);
      })
    )
  );

  concat(...scheduleUpdates)
    .pipe(toArray())
    .subscribe({
      next: () => {
        const updatedDoctor: Doctor = {
          ...this.doctor!,
          availableDays: this.doctorSchedule
            .filter((d) => d.enabled)
            .map((d) => d.day),
          availableTimeSlots: this.doctorSchedule
            .filter((d) => d.enabled)
            .flatMap((d) => d.slots.filter((s) => s.available)),
        };

        this._doctorsService
          .updateDoctor(updatedDoctor, this.doctorId)
          .subscribe({
            next: (res) => {
              this.doctor = res;
              this._toast.success("Schedules Updated Successfully!!")
              console.log('Schedule and doctor updated successfully');
            },
            error: (err) => console.error('Failed to update doctor', err),
          });
      },
      error: (err) => {console.error('Failed to update schedules', err)
        this._toast.error("Failed to Update Schedule")
      },
    });
    
}
  addSlot(day: DoctorSchedule) {
    day.slots.push({ start: '09:00', end: '10:00', available: true });
  }
  removeSlot(day: DoctorSchedule, i: number) {
    day.slots.splice(i, 1);
  }

  logout() {
    this._authService.logout();
  }
}
