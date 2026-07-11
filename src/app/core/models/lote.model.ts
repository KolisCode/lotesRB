export type EstadoLote = 'disponible' | 'reservado' | 'vendido';

export interface Lote {
  id: number;
  numero: string;
  slug: string;           // URL amigable (ej. lote-a-01-sector-norte)
  area: number;           // m²
  precio: number;         // COP
  ubicacion: string;
  manzana: string;
  estado: EstadoLote;
  servicios: Servicio[];
  imagen?: string;
  descripcion?: string;
  coordenadas?: { lat: number; lng: number };
}

export interface Servicio {
  nombre: string;
  icono: string;          // nombre del icono (ej. 'agua', 'luz', 'gas')
}
