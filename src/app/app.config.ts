import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { tokenInterceptorInterceptor } from './core/interceptors/token-interceptor.interceptor';
import { loadInterceptorInterceptor } from './core/interceptors/load-interceptor.interceptor';
import { errorHandlerInterceptorInterceptor } from './core/interceptors/error-handler-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptorInterceptor,loadInterceptorInterceptor,errorHandlerInterceptorInterceptor])),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      easing: 'ease-in-out',
      easeTime: 300,
    }),
  ],
};
