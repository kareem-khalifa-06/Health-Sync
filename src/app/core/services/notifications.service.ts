import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Notifications } from '../../models/notification';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private supabase = inject(SupabaseService);

  getUserNotifications(userId: string): Observable<Notifications[]> {
    return from(
      this.supabase.execute<Notifications[]>(
        this.supabase.client
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      )
    );
  }

  getNotificationsById(id: string): Observable<Notifications> {
    return from(
      this.supabase.execute<Notifications>(
        this.supabase.client
          .from('notifications')
          .select('*')
          .eq('id', id)
          .single()
      )
    );
  }

  markAsRead(n: Notifications): Observable<Notifications> {
    return from(
      this.supabase.execute<Notifications>(
        this.supabase.client
          .from('notifications')
          .update({ read: true })
          .eq('id', n.id)
          .select()
          .single()
      )
    );
  }

  sendNotifications(n: Notifications): Observable<Notifications> {
    return from(
      this.supabase.execute<Notifications>(
        this.supabase.client
          .from('notifications')
          .insert({
            clinic_id:      this.supabase.clinicId,
            user_id:        n.userId,
            appointment_id: n.appointmentId ?? null,
            message:        n.message,
            type:           n.type,
            read:           false,
          })
          .select()
          .single()
      )
    );
  }
}