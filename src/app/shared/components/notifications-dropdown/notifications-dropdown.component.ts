import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notifications } from '../../../models/notification';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.css',
})
export class NotificationsDropdownComponent {
  @Input() notifications: Notifications[] = [];
  @Output() closed = new EventEmitter<void>();
  isFiltered = false;
  _NotificationsService = inject(NotificationsService);
  unreadNotifications = signal(this.notifications.filter((n) => !n.read));
  // Close when clicking outside
  @HostListener('document:keydown.escape')
  onEscape() {
    this.closed.emit();
  }

  get unread() {
    return this.unreadNotifications.length;
  }

  markAllRead() {
    console.log('kareem');
    this.notifications.forEach((n) => {
      return this._NotificationsService.markAsRead(n).subscribe();
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'appointment':
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
  toggleFilters() {
    this.isFiltered = !this.isFiltered;
    if (this.isFiltered) {
      this.unreadNotifications.set(this.notifications);
    } else {
      this.unreadNotifications.set(this.notifications.filter((n) => !n.read));
    }
  }
}
