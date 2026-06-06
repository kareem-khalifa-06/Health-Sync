import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AppointmentService } from '../services/appointments.service';


export const loadInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const _loaderState = inject(AppointmentService);
    let updatedReq = req;

   
        _loaderState.startLoader.set(true)

        const headers = req.headers;
        updatedReq = req.clone({ headers });
    

  
    return next(updatedReq).pipe(
        finalize(() => {
            _loaderState.startLoader.set(false);
        }),
    );
};
