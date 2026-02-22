import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterationFormComponent } from './shared/components/registeration-form/registeration-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RegisterationFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Health-Sync';
}
