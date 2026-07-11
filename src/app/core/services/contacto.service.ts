import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ContactoPayload {
  nombre: string;
  email?: string;
  telefono?: string;
  mensaje: string;
  loteId?: number;
}

@Injectable({ providedIn: 'root' })
export class ContactoService {
  private http = inject(HttpClient);

  enviar(payload: ContactoPayload) {
    return this.http.post<{ message: string; id: number }>(`${environment.apiUrl}/contacto`, payload);
  }
}
