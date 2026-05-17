import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'precio' })
export class PrecioPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
