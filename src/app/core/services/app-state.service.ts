import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  startLoader=signal<boolean>(false);
  endLoader=signal<boolean>(false);
  constructor() { }
}
