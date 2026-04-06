import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
const  _AuthService = inject(AuthService);
const _toastr=inject(ToastrService);
const _Router=inject(Router);
if(_AuthService.isLoggedIn()){
  _toastr.success('logged in successfully')
  return true
}
_toastr.error('Login First!!')
  _Router.navigate(['/login']);
  return false;
};
