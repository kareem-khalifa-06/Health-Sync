import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const  _AuthService = inject(AuthService);
  const _toastr=inject(ToastrService);
  const _Router=inject(Router);
  if(_AuthService.isLoggedIn()&&_AuthService.currentUser()?.role==='admin'){
    _toastr.success('logged in successfully')
    return true
  }
   _toastr.error('Access Denied!!')
    _Router.navigate(['/login']);
    return false;
 
};
