import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../shared/components/admin-dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    children: [
      {
        path: 'user-profile',
        loadComponent: () =>
          import('../shared/layouts/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
      },
    ],
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('../shared/components/appointments/appointments.component').then(
        (m) => m.AppointmentsComponent,
      ),
  },
  {
    path: 'new-appointment',
    loadComponent: () =>
      import('../shared/components/book-appointment-form/book-appointment-form.component').then(
        (m) => m.BookAppointmentFormComponent,
      ),
  },
  {
    path: 'patients',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../shared/components/patients-list/patients-list.component').then(
            (m) => m.PatientsListComponent,
          ),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('../shared/components/patient-detail/patient-detail.component').then(
            (m) => m.PatientDetailComponent,
          ),
      },
    ],
  },
  {
    path: 'new-patient',
    loadComponent: () =>
      import('../shared/components/new-patient/new-patient.component').then(
        (m) => m.NewPatientComponent,
      ),
  },
  {
    path: 'doctors',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../shared/components/doctors-list/doctors-list.component').then(
            (m) => m.DoctorsListComponent,
          ),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('../shared/components/doctor-detail/doctor-detail.component').then(
            (m) => m.DoctorDetailComponent,
          ),
      },
    ],
  },
  {
    path: 'medical-records',
    loadComponent: () =>
      import('../shared/components/medical-records/medical-records.component').then(
        (m) => m.MedicalRecordsComponent,
      ),
  },
  {
    path: 'new-record',
    loadComponent: () =>
      import('../shared/components/new-record/new-record.component').then(
        (m) => m.NewRecordComponent,
      ),
  },
  {
    path: 'prescriptions',
    loadComponent: () =>
      import('../shared/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('../shared/components/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent,
      ),
  },
];
export const reciptionstRoutes: Route[] = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  {
    path: 'appointments',
    loadComponent: () =>
      import('../shared/components/appointments/appointments.component').then(
        (m) => m.AppointmentsComponent,
      ),
  },
  {
    path: 'new-appointment',
    loadComponent: () =>
      import('../shared/components/book-appointment-form/book-appointment-form.component').then(
        (m) => m.BookAppointmentFormComponent,
      ),
  },
  {
    path: 'patients',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../shared/components/patients-list/patients-list.component').then(
            (m) => m.PatientsListComponent,
          ),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('../shared/components/patient-detail/patient-detail.component').then(
            (m) => m.PatientDetailComponent,
          ),
      },
    ],
  },
  {
    path: 'new-patient',
    loadComponent: () =>
      import('../shared/components/new-patient/new-patient.component').then(
        (m) => m.NewPatientComponent,
      ),
  },
  {
    path: 'doctors',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../shared/components/doctors-list/doctors-list.component').then(
            (m) => m.DoctorsListComponent,
          ),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('../shared/components/doctor-detail/doctor-detail.component').then(
            (m) => m.DoctorDetailComponent,
          ),
      },
    ],
  },
  {
    path: 'medical-records',
    loadComponent: () =>
      import('../shared/components/medical-records/medical-records.component').then(
        (m) => m.MedicalRecordsComponent,
      ),
  },
  {
    path: 'new-record',
    loadComponent: () =>
      import('../shared/components/new-record/new-record.component').then(
        (m) => m.NewRecordComponent,
      ),
  },
  {
    path: 'prescriptions',
    loadComponent: () =>
      import('../shared/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
  },
];
export const patientsRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../shared/components/patient-dashboard/patient-dashboard.component').then(
        (m) => m.PatientDashboardComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../shared/components/patient-profile-edit/patient-profile-edit.component').then(
        (m) => m.PatientProfileEditComponent,
      ),
  },
  {
    path: 'new-appointment',
    loadComponent: () =>
      import('../shared/components/book-appointment-form/book-appointment-form.component').then(
        (m) => m.BookAppointmentFormComponent,
      ),
  },
  
];
