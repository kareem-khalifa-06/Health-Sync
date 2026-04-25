import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor } from '../../../models/doctor';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

export interface ScheduleSlot {
  start: string;
  end: string;
}
export interface ScheduleDay {
  name: string;
  enabled: boolean;
  slots: ScheduleSlot[];
}

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.css',
})
export class DoctorLayoutComponent  {
  
}
