import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./shared/components/registeration-form/registeration-form.component').then(
        (m) => m.RegisterationFormComponent,
      ),
  },
  {
    path: 'adminLayout',
    loadComponent: () =>
      import('./shared/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        children: [
          {
            path: 'user-profile',
            loadComponent: () =>
              import('./shared/layouts/admin-layout/admin-layout.component').then(
                (m) => m.AdminLayoutComponent,
              ),
          },
        ],
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./shared/components/appointments/appointments.component').then(
            (m) => m.AppointmentsComponent,
          ),
      },
      {
        path: 'new-appointment',
        loadComponent: () =>
          import('./shared/components/book-appointment-form/book-appointment-form.component').then(
            (m) => m.BookAppointmentFormComponent,
          ),
      },
      {
        path: 'patients',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./shared/components/patients-list/patients-list.component').then(
                (m) => m.PatientsListComponent,
              ),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./shared/components/patient-detail/patient-detail.component').then(
                (m) => m.PatientDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'new-patient',
        loadComponent: () =>
          import('./shared/components/new-patient/new-patient.component').then(
            (m) => m.NewPatientComponent,
          ),
      },
      {
        path: 'doctors',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./shared/components/doctors-list/doctors-list.component').then(
                (m) => m.DoctorsListComponent,
              ),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./shared/components/doctor-detail/doctor-detail.component').then(
                (m) => m.DoctorDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
      },
    ],
  },


  {
    path: 'doctorLayout/:id',
    loadComponent: () =>
      import('./shared/layouts/doctor-layout/doctor-layout.component').then(
        (m) => m.DoctorLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./shared/layouts/doctor-layout/doctor-layout.component').then(
            (m) => m.DoctorLayoutComponent,
          ),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./shared/components/doctor-schedule/doctor-schedule.component').then(
            (m) => m.DoctorScheduleComponent,
          ),
      },
    ],
  },
];
