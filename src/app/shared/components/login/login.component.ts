import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private _AuthService = inject(AuthService);
  private _Router = inject(Router);

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
          if(this._AuthService.isLoggedIn()){
            alert('Logged in successfully');
            if(this._AuthService.getRole()==='admin')
          this._Router.navigate(['/adminLayout']);
          }
          
        },
        error: (err) => {
          alert('Wrong credentials!!');
          this.loginForm.reset();
        },
      });
  }
}
