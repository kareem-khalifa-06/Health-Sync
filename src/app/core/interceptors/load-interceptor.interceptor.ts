import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AppStateService } from '../services/app-state.service';

export const loadInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const appState = inject(AppStateService);

  appState.startLoader.set(true);

  return next(req).pipe(
    finalize(() => appState.startLoader.set(false))
  );
};