import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-recipsionist-layout',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './recipsionist-layout.component.html',
  styleUrl: './recipsionist-layout.component.css'
})
export class RecipsionistLayoutComponent {

}
