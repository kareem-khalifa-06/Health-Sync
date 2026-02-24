import { AuthService } from './../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  collapsed:boolean = false;
  _AuthService=inject(AuthService);

}
