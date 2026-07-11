import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: number;
  email: string;
  nombre: string;
}

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private http = inject(HttpClient);

  private readonly TOKEN_KEY   = 'rb_admin_token';
  private readonly REFRESH_KEY = 'rb_admin_refresh';
  private readonly USER_KEY    = 'rb_admin_user';

  private _token = signal<string | null>(sessionStorage.getItem(this.TOKEN_KEY));
  private _admin = signal<AdminUser | null>(
    JSON.parse(sessionStorage.getItem(this.USER_KEY) ?? 'null'),
  );

  /** Refresh en vuelo compartido: evita varias llamadas /auth/refresh ante 401 concurrentes. */
  private refreshing$: Observable<TokenPair> | null = null;

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

  get token()        { return this._token(); }
  get refreshToken() { return sessionStorage.getItem(this.REFRESH_KEY); }

  login(email: string, password: string) {
    return this.http
      .post<TokenPair & { admin: AdminUser }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(({ access_token, refresh_token, admin }) => {
          this.guardarTokens(access_token, refresh_token);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(admin));
          this._admin.set(admin);
        }),
      );
  }

  /** Renueva el par de tokens usando el refresh token. Comparte la llamada en vuelo. */
  refresh(): Observable<TokenPair> {
    if (this.refreshing$) return this.refreshing$;

    const rt = this.refreshToken;
    if (!rt) return throwError(() => new Error('No hay refresh token'));

    this.refreshing$ = this.http
      .post<TokenPair>(`${environment.apiUrl}/auth/refresh`, { refreshToken: rt })
      .pipe(
        tap(({ access_token, refresh_token }) => this.guardarTokens(access_token, refresh_token)),
        finalize(() => { this.refreshing$ = null; }),
        shareReplay(1),
      );
    return this.refreshing$;
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._admin.set(null);
  }

  private guardarTokens(access: string, refresh: string) {
    sessionStorage.setItem(this.TOKEN_KEY, access);
    sessionStorage.setItem(this.REFRESH_KEY, refresh);
    this._token.set(access);
  }
}
