import { Component, inject, OnInit } from '@angular/core';

import {
  RouterOutlet,

} from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.css',
})
export class DoctorLayoutComponent  {
  
}
