import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Lote, EstadoLote } from '../models/lote.model';
import { environment } from '../../../environments/environment';

interface LoteApiResponse {
  id: number;
  numero: string;
  slug: string | null;
  manzana: string;
  area: number;
  precio: number;
  ubicacion: string;
  estado: string;
  descripcion: string | null;
  imagen: string | null;
  latitud: number | null;
  longitud: number | null;
  servicios: { id: number; nombre: string; icono: string }[];
}

@Injectable({ providedIn: 'root' })
export class LotesService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<LoteApiResponse[]>(`${environment.apiUrl}/lotes`).pipe(
      map(lotes => lotes.map(l => this.mapLote(l)))
    );
  }

  getById(id: number) {
    return this.http.get<LoteApiResponse>(`${environment.apiUrl}/lotes/${id}`).pipe(
      map(l => this.mapLote(l))
    );
  }

  getBySlug(slug: string) {
    return this.http.get<LoteApiResponse>(`${environment.apiUrl}/lotes/slug/${slug}`).pipe(
      map(l => this.mapLote(l))
    );
  }

  // Funciones puras para derivar datos de una lista cargada
  calcResumen(lotes: Lote[]) {
    return {
      total:      lotes.length,
      disponibles: lotes.filter(l => l.estado === 'disponible').length,
      reservados:  lotes.filter(l => l.estado === 'reservado').length,
      vendidos:    lotes.filter(l => l.estado === 'vendido').length,
    };
  }

  filtrar(lotes: Lote[], estado?: EstadoLote, areaMin?: number, areaMax?: number, precioMax?: number): Lote[] {
    return lotes.filter(l => {
      if (estado && l.estado !== estado) return false;
      if (areaMin != null && l.area < areaMin) return false;
      if (areaMax != null && l.area > areaMax) return false;
      if (precioMax != null && l.precio > precioMax) return false;
      return true;
    });
  }

  private mapLote(l: LoteApiResponse): Lote {
    return {
      id:          l.id,
      numero:      l.numero,
      slug:        l.slug ?? String(l.id),
      manzana:     l.manzana,
      area:        l.area,
      precio:      l.precio,
      ubicacion:   l.ubicacion,
      estado:      l.estado as EstadoLote,
      descripcion: l.descripcion ?? undefined,
      imagen:      l.imagen ?? undefined,
      servicios:   l.servicios.map(s => ({ nombre: s.nombre, icono: s.icono })),
      coordenadas:
        l.latitud != null && l.longitud != null
          ? { lat: l.latitud, lng: l.longitud }
          : undefined,
    };
  }
}
