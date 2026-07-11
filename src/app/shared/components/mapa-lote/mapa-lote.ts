import { Component, ElementRef, AfterViewInit, OnDestroy, input, viewChild } from '@angular/core';
import * as L from 'leaflet';

/**
 * Mapa de ubicación de un lote con Leaflet + tiles de OpenStreetMap (sin API key).
 * Usa un marcador `divIcon` (emoji) para no depender de los assets de imagen de Leaflet.
 */
@Component({
  selector: 'app-mapa-lote',
  standalone: true,
  template: `<div #mapEl class="mapa-lote"></div>`,
  styles: [`
    :host { display: block; }
    .mapa-lote { height: 280px; width: 100%; border-radius: 12px; overflow: hidden; z-index: 0; }
    :host ::ng-deep .mapa-lote__pin { font-size: 24px; line-height: 1; text-align: center; }
  `],
})
export class MapaLote implements AfterViewInit, OnDestroy {
  readonly lat = input.required<number>();
  readonly lng = input.required<number>();
  readonly etiqueta = input<string>('');

  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');
  private map?: L.Map;
  private resizeTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit() {
    const coords: L.LatLngExpression = [this.lat(), this.lng()];
    this.map = L.map(this.mapEl().nativeElement, { scrollWheelZoom: false, attributionControl: true })
      .setView(coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const icon = L.divIcon({ className: 'mapa-lote__pin', html: '📍', iconSize: [28, 28], iconAnchor: [14, 28] });
    const marker = L.marker(coords, { icon }).addTo(this.map);
    if (this.etiqueta()) marker.bindPopup(this.etiqueta());

    // El contenedor puede montarse con tamaño 0 (dentro de flex): recalcula al siguiente tick.
    this.resizeTimer = setTimeout(() => this.map?.invalidateSize(), 0);
  }

  ngOnDestroy() {
    clearTimeout(this.resizeTimer);
    this.map?.remove();
    this.map = undefined;
  }
}
