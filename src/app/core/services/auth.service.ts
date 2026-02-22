import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url: string = 'http://localhost:3000';
  constructor(private _HttpClient: HttpClient) {}
  register(newUser:User):Observable<User> {
    return this._HttpClient.post<User>(this.base_url+'/users',newUser);
  }
}
