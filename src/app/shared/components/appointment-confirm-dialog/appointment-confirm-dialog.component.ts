import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationSummary {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  reason: string;
}

@Component({
  selector: 'app-appointment-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-confirm-dialog.component.html',
  styleUrl: './appointment-confirm-dialog.component.css',
})
export class AppointmentConfirmDialogComponent {
@Input() payload!: any;
@Input() patientName = '';
@Input() doctorName = '';
@Input() isLoading = false;
@Input() error: string | null = null;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
