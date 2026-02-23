import { Routes } from '@angular/router';

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
    })
}
];
