import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, inject, input } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../core/services/patient.service';
import { calculateAge } from '../../../utils/calculateAge';
import { BackButtonComponent } from '../back-button/back-button.component';
import { SlicePipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { _adapters } from 'chart.js';
import { AppStateService } from '../../../core/services/app-state.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [BackButtonComponent, SlicePipe, UpperCasePipe, RouterLink, MatProgressSpinner],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
})
export class PatientDetailComponent {
  _Router = inject(Router);
  _Auth=inject(AuthService);
  appState=inject(AppStateService);
  baseRoute:string='';
  patient!: Patient;
  calculateAge = calculateAge;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _patientservice: PatientService,
  ) {}

  ngOnInit() {
    this.baseRoute= this._Auth.getBaseRoute();
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    const sub = this._patientservice.getPatientById(id!).subscribe({
      next: (r) => (this.patient = r),
    });
  }
}
