import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '../../../models/user';
import { Router } from '@angular/router';

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
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        ),
      ],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
    }),
    role: new FormControl('', {
      validators: [Validators.required],
    }),
  });
  get email(){
    return this.registerForm.get('email');
  }
  get password(){
    return this.registerForm.get('password');
  }
  get firstName(){
    return this.registerForm.get('firstName');
  }
  get lastName(){
    return this.registerForm.get('lastName');
  }
  get phone(){
    return this.registerForm.get('phone');
  }
  get role(){
    return this.registerForm.get('role');
  }
  onSubmit() {
    console.log(this.registerForm);
    let newUser: User;
    if (this.registerForm.valid && this.registerForm.value) {
      newUser = {
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
          console.log(res);
        },
      });
    }
    alert('Registered Succesfully')
    this.registerForm.reset();
    this._Router.navigate(['login']);

  }
}
