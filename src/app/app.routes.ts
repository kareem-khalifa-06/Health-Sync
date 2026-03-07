import { Routes, CanActivateFn } from '@angular/router';
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
      import('./shared/components/login/login.component').then((m) => {
        return m.LoginComponent;
      }),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./shared/components/registeration-form/registeration-form.component').then(
        (m) => {
          return m.RegisterationFormComponent;
        },
      ),
  },
  {
    path: 'adminLayout',
    loadComponent: () =>
      import('./shared/layouts/admin-layout/admin-layout.component').then(
        (m) => {
          return m.AdminLayoutComponent;
        },
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard.component').then(
            (m) => {
              return m.DashboardComponent;
            },
          ),
        children: [
          {
            path: 'user-profile',
            loadComponent: () =>
              import('./shared/layouts/admin-layout/admin-layout.component').then(
                (m) => {
                  return m.AdminLayoutComponent;
                },
              ),
          },
        ],
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./shared/components/appointments/appointments.component').then(
            (m) => {
              return m.AppointmentsComponent;
            },
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./shared/components/patients-list/patients-list.component').then(
            (m) => {
              return m.PatientsListComponent;
            },
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
              import('./shared/doctor-detail/doctor-detail.component').then(
                (m) => m.DoctorDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => {
              return m.AdminLayoutComponent;
            },
          ),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => {
              return m.AdminLayoutComponent;
            },
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => {
              return m.AdminLayoutComponent;
            },
          ),
      },
    ],
  },
];
