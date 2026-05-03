import { Notifications } from './../../models/notification';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private _HttpClient: HttpClient) {}

  baseUrl = 'http://localhost:3000/notifications/';
  getNotificationsById(id: string): Observable<Notifications> {
    return this._HttpClient.get<Notifications>(`${this.baseUrl}+${id}`);
  }
  markAsRead(n: Notifications): Observable<Notifications> {
    return this._HttpClient.put<Notifications>(`${this.baseUrl}${n.id}`, {
      ...n,
      read: true,
    });
  }
  sendNotifications(n: Notifications): Observable<Notifications> {
    return this._HttpClient.post<Notifications>(`${this.baseUrl}`, n);
  }

  getUserNotifications(userId: string): Observable<Notifications[]> {
    return this._HttpClient
      .get<Notifications[]>(this.baseUrl)
      .pipe(map((res) => res.filter((n) => n.userId === userId)));
  }
}
