import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  const isApi = req.url.startsWith(environment.apiUrl);
  const token = auth.token;
  const authReq = token && isApi
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const esEndpointAuth = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

      // 401 en una petición autenticada → intenta renovar una vez y reintentar.
      if (err.status === 401 && isApi && !esEndpointAuth && auth.refreshToken) {
        return auth.refresh().pipe(
          switchMap(({ access_token }) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${access_token}` } })),
          ),
          catchError(refreshErr => {
            auth.logout();
            router.navigate(['/admin/login']);
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => err);
    }),
  );
};
