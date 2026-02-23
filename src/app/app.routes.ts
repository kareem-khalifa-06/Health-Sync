import { Routes, CanActivateFn } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
{
    path:'',
    redirectTo:'login',
    pathMatch:'full'
},
{
    path:'login',
    loadComponent:()=>import('./shared/components/login/login.component').then((m)=>{
      return  m.LoginComponent
    })
},
{
    path:'register',
    loadComponent:()=>import('./shared/components/registeration-form/registeration-form.component').then((m)=>{
      return  m.RegisterationFormComponent
    }),
    canActivate:[authGuard]
},
{
    path:'adminLayout',
    loadComponent:()=>import('./shared/layouts/admin-layout/admin-layout.component').then((m)=>{
      return  m.AdminLayoutComponent
    }),
    canActivate:[authGuard]
}
];
