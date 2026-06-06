import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const errorHandlerInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // return next(updatedReq).pipe(tap((res: HttpEvent<unknown>) => {
  //     if (res instanceof HttpResponse && isShowSuccess) {
  //       const msg: string = message!.length > 0 ? message! : 'Success';
  //       _toastr.open(decodeURI(msg), '👍', {
  //         verticalPosition: 'bottom',
  //         panelClass: ['success'],
  //         duration: 5000
  //       });
  //     }
  //   }),
  //   catchError((err: HttpErrorResponse) => {
  //     console.log(err)
  //     if (err.status === 401) {
  //       _userService.logout();
  //     }
  //     if (isShowError) {
  //       const _msg = err.error.message ?? err.statusText;
  //       _toastr.open(_translate.instant(_msg), '❌', {
  //         verticalPosition: 'bottom',
  //         panelClass: ['danger'],
  //         duration: 5000
  //       });
  //     }
  //     return throwError(() => err)
  //   }),

  // );
  return next(req);

};
