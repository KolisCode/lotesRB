import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface LoteAdmin {
  id: number;
  numero: string;
  manzana: string;
  area: number;
  precio: number;
  ubicacion: string;
  estado: 'disponible' | 'reservado' | 'vendido';
  descripcion: string | null;
  imagen: string | null;
  latitud: number | null;
  longitud: number | null;
  servicios: { id: number; nombre: string; icono: string }[];
}

export interface LotePayload {
  numero: string;
  manzana: string;
  area: number;
  precio: number;
  ubicacion: string;
  estado?: 'disponible' | 'reservado' | 'vendido';
  descripcion?: string;
  imagen?: string;
  latitud?: number;
  longitud?: number;
  servicios?: { nombre: string; icono: string }[];
}

@Injectable({ providedIn: 'root' })
export class AdminLotesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/lotes`;

  getAll()                           { return this.http.get<LoteAdmin[]>(this.base); }
  create(p: LotePayload)             { return this.http.post<LoteAdmin>(this.base, p); }
  update(id: number, p: LotePayload) { return this.http.put<LoteAdmin>(`${this.base}/${id}`, p); }
  remove(id: number)                 { return this.http.delete<{ id: number }>(`${this.base}/${id}`); }
}
