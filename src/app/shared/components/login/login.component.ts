import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { _adapters } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private _AuthService = inject(AuthService);
  _toastr = inject(ToastrService);
  private _Router = inject(Router);
  ngOnInit() {
    this._AuthService.logout();
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this._AuthService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe({
        next: (user) => {
          console.log(user)
          if (!this._AuthService.isLoggedIn()) return;

          const role = this._AuthService.getRole();

          if (role === 'admin') this._Router.navigate(['/adminLayout']);

          if (role === 'doctor')
           {
            this._Router.navigate(['/doctorLayout/' + user.doctorId]);

           } 

          if (role === 'patient')
            this._Router.navigate(['/patientLayout/' + user.patientId]);

          if (role === 'receptionist')
            this._Router.navigate(['/receptionistLayout']);
        },
        error: () => {
          this._toastr.error('Wrong credentials!!');
          this.loginForm.reset();
        },
      });
  }
}
