import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminRoutes, patientsRoutes, reciptionstRoutes } from './routes/routs';

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
          import('./shared/components/doctor-profile/doctor-profile.component').then(
            (m) => m.DoctorProfileComponent,
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
    path: 'receptionistLayout',
    loadComponent: () =>
      import('./shared/layouts/receptionist-layout/receptionist-layout.component').then(
        (m) => m.receptionistLayoutComponent,
      ),
    canActivate: [authGuard],
    children: reciptionstRoutes,
  },
  {
    path: 'patientLayout/:id',
    loadComponent: () =>
      import('./shared/layouts/patient-layout/patient-layout.component').then(
        (m) => m.PatientLayoutComponent,
      ),
    canActivate: [authGuard],
    children: patientsRoutes,
  },
];
