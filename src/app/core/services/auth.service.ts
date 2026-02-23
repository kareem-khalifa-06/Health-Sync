import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users=signal<User[]>([])
  base_url: string = 'http://localhost:3000';
  constructor(private _HttpClient: HttpClient) {
    this._HttpClient.get<User[]>(this.base_url + '/users').subscribe({
      next: (res) => {
        console.log(res);
        this.users.set(res);
      },
    });
  }
  register(newUser: User): Observable<User> {
    return this._HttpClient.post<User>(this.base_url + '/users', newUser);
  }
  login(email: string, password: string): boolean {
    let isLoggedIn:boolean;
    if(this.users().find((u)=>u.email===email&&u.password===password)){
      isLoggedIn=true
    }
    else{
      isLoggedIn=false
    }
    return isLoggedIn;
  }
}
