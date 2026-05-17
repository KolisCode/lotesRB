import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getAll(soloNoLeidos = false) {
    return this.http.get<ContactoAdmin[]>(soloNoLeidos ? `${this.base}?noLeidos=true` : this.base);
  }

  marcarLeido(id: number) {
    return this.http.patch<ContactoAdmin>(`${this.base}/${id}/leido`, {});
  }
}
