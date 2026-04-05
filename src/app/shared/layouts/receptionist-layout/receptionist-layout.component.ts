import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-receptionist-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './receptionist-layout.component.html',
  styleUrl: './receptionist-layout.component.css',
})
export class receptionistLayoutComponent {}
