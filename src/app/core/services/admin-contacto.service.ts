import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactoAdmin {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  mensaje: string;
  loteId: number | null;
  leido: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminContactoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/contacto`;

  /** Conteo de no leídos compartido entre el sidebar y la pantalla de contactos. */
  readonly noLeidos = signal(0);

  getAll(soloNoLeidos = false) {
    return this.http.get<ContactoAdmin[]>(soloNoLeidos ? `${this.base}?noLeidos=true` : this.base);
  }

  /** Recalcula el badge de no leídos consultando el backend. */
  refreshNoLeidos() {
    this.http.get<ContactoAdmin[]>(`${this.base}?noLeidos=true`).subscribe({
      next: msgs => this.noLeidos.set(msgs.length),
      error: () => {},
    });
  }

  marcarLeido(id: number) {
    return this.http.patch<ContactoAdmin>(`${this.base}/${id}/leido`, {})
      .pipe(tap(() => this.refreshNoLeidos()));
  }

  remove(id: number) {
    return this.http.delete<{ id: number }>(`${this.base}/${id}`)
      .pipe(tap(() => this.refreshNoLeidos()));
  }
}
