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
    canActivate: [authGuard],
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
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard.component').then(
            (m) => {
              return m.DashboardComponent;
            },
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => {
              return m.AdminLayoutComponent;
            },
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => {
              return m.AdminLayoutComponent;
            },
          ),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (m) => {
              return m.AdminLayoutComponent;
            },
          ),
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
