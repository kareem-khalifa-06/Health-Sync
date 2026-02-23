import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { ElementSchemaRegistry } from '@angular/compiler';

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
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });
  onSubmit() {
    const logIn = this._AuthService.login(
      this.loginForm.value.email!,
      this.loginForm.value.password!,
    );
    if (logIn) {
      alert('Logged in successfully')
      this._Router.navigate(['/register']);
    }
    else{

      alert('wrong Credentials!!')
      this._Router.navigate(['/login']);
    }
    this.loginForm.reset();
    
    console.log('Kareem!!');
  }
}
