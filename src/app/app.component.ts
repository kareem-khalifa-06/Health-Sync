import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Health-Sync';

}
