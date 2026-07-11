import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AdminAuthService);
  const router = inject(Router);

  // Access válido → pasa directo.
  if (auth.isLoggedIn()) return true;

  // Access vencido pero con refresh disponible → intenta renovar antes de redirigir.
  // (Sin esto, recargar/navegar tras expirar el access mandaba a login pese a tener refresh de 7d.)
  if (auth.refreshToken) {
    return auth.refresh().pipe(
      map(() => true),
      catchError(() => of(router.createUrlTree(['/admin/login']))),
    );
  }

  return router.createUrlTree(['/admin/login']);
};
