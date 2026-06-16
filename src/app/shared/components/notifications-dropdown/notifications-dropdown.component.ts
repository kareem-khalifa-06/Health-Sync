import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notifications } from '../../../models/notification';
import { NotificationsService } from '../../../core/services/notifications.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.css',
})
export class NotificationsDropdownComponent implements OnInit {
  private _NotificationsService = inject(NotificationsService);

  notifications: Notifications[] = [];
  showNotifications = false;
  isFiltered = false;

  displayedNotifications = signal<Notifications[]>([]);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const user = JSON.parse(localStorage.getItem('hs_user')!);
    if (!user) return;

    this._NotificationsService
      .getUserNotifications(user.id)
      .subscribe((res) => {
        this.notifications = res;
        this.displayedNotifications.set(
          [...res].sort((a, b) => Number(a.read) - Number(b.read)),
        );
      });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeNotifications();
  }

  get unread(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => {
      if (!n.read) {
        this._NotificationsService.markAsRead(n).subscribe();
        n.read = true;
      }
    });

    if (!this.isFiltered) {
      this.displayedNotifications.set([]);
    }
  }

  toggleFilters(): void {
    this.isFiltered = !this.isFiltered;

    if (this.isFiltered) {
      this.displayedNotifications.set(
        this.notifications.filter((n) => !n.read),
      );
    } else {
      this.displayedNotifications.set(
        [...this.notifications].sort((a, b) => Number(a.read) - Number(b.read)),
      );
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'appointment':
      case 'appointment_reminder':
      case 'new_appointment':
        return 'bi-calendar-check';
      case 'reminder':
        return 'bi-clock';
      case 'alert':
        return 'bi-exclamation-triangle';
      case 'message':
        return 'bi-chat-left-text';
      default:
        return 'bi-bell';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'appointment':
      case 'appointment_reminder':
      case 'new_appointment':
        return '#2563eb';
      case 'reminder':
        return '#d97706';
      case 'alert':
        return '#dc2626';
      case 'message':
        return '#059669';
      default:
        return '#64748b';
    }
  }

  getIconBg(type: string): string {
    switch (type) {
      case 'appointment':
      case 'appointment_reminder':
      case 'new_appointment':
        return '#eff6ff';
      case 'reminder':
        return '#fef3c7';
      case 'alert':
        return '#fee2e2';
      case 'message':
        return '#d1fae5';
      default:
        return '#f1f5f9';
    }
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;

    return `${days}d ago`;
  }
}
