import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { MedicalRecordsService } from '../../../core/services/medical-records.service';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorsService } from '../../../core/services/doctors.service';
import { MedicalRecord } from '../../../medical-record';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './medical-records.component.html',
  styleUrl: './medical-records.component.css',
})
export class MedicalRecordsComponent implements OnInit {
  currentPage = 1;
  pageSize = 2; 
  Math = Math;

  get totalPages() {
    return Math.ceil(this.filteredRecords.length / this.pageSize);
  }

  get paginatedRecords() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecords.slice(start, start + this.pageSize);
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
  AuthService = inject(AuthService);
  baseRoute = this.AuthService.getBaseRoute();
  searchQuery = '';
  records: MedicalRecord[] = [];
  filteredRecords: MedicalRecord[] = [];

  // ── Lookup maps — safe to call from template ─────────────────
  patientMap = new Map<string, string>();
  doctorMap = new Map<string, string>();

  constructor(
    private _MedicalRecordsService: MedicalRecordsService,
    private _PatientService: PatientService,
    private _DoctorsService: DoctorsService,
    private _Router: Router,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit() {
    forkJoin({
      patients: this._PatientService.getAllPatients(),
      doctors: this._DoctorsService.renderDoctors(),
    }).subscribe(({ patients, doctors }) => {
      patients.forEach((p) => this.patientMap.set(p.id, p.fullName));
      doctors.forEach((d) => this.doctorMap.set(d.id, d.fullName));
      this.loadRecords();
    });
  }

  loadRecords() {
    this._MedicalRecordsService.renderMedicalRecords().subscribe((records) => {
      this.records = records;
      this.filteredRecords = records;
    });
  }

  getPatientName(id: string): string {
    return this.patientMap.get(id) ?? id;
  }

  getDoctorName(id: string): string {
    return this.doctorMap.get(id) ?? id;
  }

  applySearch(q: string) {
    this.searchQuery = q;
    if (!q.trim()) {
      this.filteredRecords = this.records;
      return;
    }
    const lower = q.toLowerCase();
    this.filteredRecords = this.records.filter(
      (r) =>
        r.diagnosis.toLowerCase().includes(lower) ||
        r.notes?.toLowerCase().includes(lower) ||
        this.getPatientName(r.patientId).toLowerCase().includes(lower) ||
        this.getDoctorName(r.doctorId).toLowerCase().includes(lower),
    );
    this.currentPage=1;
  }

  // ── Navigation ───────────────────────────────────────────────
  openNewRecord() {
    this._Router.navigate([this.baseRoute, 'new-record']);
  }
}
