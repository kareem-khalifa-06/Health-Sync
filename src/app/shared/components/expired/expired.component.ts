import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

interface Plan {
  name:     string;
  price:    string;
  period:   string;
  features: string[];
  tag:      string | null;
  wa:       string;
}

@Component({
  selector: 'app-expired',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expired.component.html',
  styleUrl: './expired.component.css',
})
export class ExpiredComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  readonly phone = '201090222247';

  plans: Plan[] = [
    {
      name:  'Starter',
      price: '2000',
      period: 'EGP / month',
      tag:   null,
      features: [
        'Up to 3 doctors',
        'Appointments & patients',
        'Medical records',
        'Cash payment tracking',
        'Email support',
      ],
      wa: `https://wa.me/${this.phone}?text=${encodeURIComponent('Hi, I want to subscribe to the HealthSync Starter plan (2000 EGP/month).')}`,
    },
    {
      name:  'Pro',
      price: '4500',
      period: 'EGP / month',
      tag:   'Most popular',
      features: [
        'Unlimited doctors',
        'WhatsApp appointment reminders',
        'Advanced analytics',
        'Arabic UI + printable prescriptions',
        'Priority WhatsApp support',
      ],
      wa: `https://wa.me/${this.phone}?text=${encodeURIComponent('Hi, I want to subscribe to the HealthSync Pro plan (4500 EGP/month).')}`,
    },
  ];

  openWhatsApp(url: string) {
    window.open(url, '_blank');
  }

  logout() {
    this.auth.logout();
  }
}