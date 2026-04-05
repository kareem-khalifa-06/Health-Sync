import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminRoutes } from './routes/routs';

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
    path: 'adminLayout',
    loadComponent: () =>
      import('./shared/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    canActivate: [authGuard],
    children: adminRoutes,
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
  {
    path: 'recipsionistLayout',
    loadComponent: () =>
      import('./shared/layouts/recipsionist-layout/recipsionist-layout.component').then(
        (m) => m.RecipsionistLayoutComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'patientDashboard/:id',
    loadComponent: () =>
      import('./shared/layouts/patient-profile/patient-profile.component').then(
        (m) => m.PatientDashboardComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'patientProfileEdit/:id',
    loadComponent: () =>
      import('./shared/components/patient-profile-edit/patient-profile-edit.component').then(
        (m) => m.PatientProfileEditComponent,
      ),
    canActivate: [authGuard],
  },
];
