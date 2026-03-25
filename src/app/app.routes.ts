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
    children:adminRoutes
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
    path: 'patientLayout',
    loadComponent: () =>
      import('./shared/layouts/patient-layout/patient-layout.component').then(
        (m) => m.PatientLayoutComponent,
      ),
    canActivate: [authGuard],
  },
];
