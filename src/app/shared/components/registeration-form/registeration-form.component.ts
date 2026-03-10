import { AuthService } from './../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registeration-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registeration-form.component.html',
  styleUrl: './registeration-form.component.css',
})
export class RegisterationFormComponent {
  private _AuthService = inject(AuthService);
  private _Router = inject(Router);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/,
      ),
    ]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get role() {
    return this.registerForm.get('role');
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      role: this.registerForm.value.role! as
        | 'admin'
        | 'doctor'
        | 'receptionist'
        | 'patient',
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      phone: this.registerForm.value.phone!,
      avatar: '',
      createdAt: new Date(),
    };

    this._AuthService.register(newUser).subscribe({
      next: (res) => {
        alert('Registered successfully'); 
        this.registerForm.reset();
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        alert('Registration failed, try again');
        console.error(err);
      },
    });
  }
}
