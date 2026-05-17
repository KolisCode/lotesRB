import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: number;
  email: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private http = inject(HttpClient);

  private readonly TOKEN_KEY = 'rb_admin_token';
  private readonly USER_KEY  = 'rb_admin_user';

  private _token = signal<string | null>(sessionStorage.getItem(this.TOKEN_KEY));
  private _admin = signal<AdminUser | null>(
    JSON.parse(sessionStorage.getItem(this.USER_KEY) ?? 'null'),
  );

  readonly admin      = this._admin.asReadonly();
  readonly isLoggedIn = computed(() => {
    const t = this._token();
    if (!t) return false;
    try {
      const { exp } = JSON.parse(atob(t.split('.')[1]));
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  });

  get token() { return this._token(); }

  login(email: string, password: string) {
    return this.http
      .post<{ access_token: string; admin: AdminUser }>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
      )
      .pipe(
        tap(({ access_token, admin }) => {
          sessionStorage.setItem(this.TOKEN_KEY, access_token);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(admin));
          this._token.set(access_token);
          this._admin.set(admin);
        }),
      );
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._admin.set(null);
  }
}
