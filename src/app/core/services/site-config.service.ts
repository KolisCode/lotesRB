import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, shareReplay } from 'rxjs';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../models/site-config.model';
import { environment } from '../../../environments/environment';

/**
 * Config pública del sitio. Se carga una vez (el navbar/footer viven en todas las
 * páginas) y se expone como signal; si la API falla, cae a los defaults y el sitio
 * sigue renderizando.
 */
@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  private http = inject(HttpClient);

  readonly config = toSignal(
    this.http.get<SiteConfig>(`${environment.apiUrl}/site-config`).pipe(
      catchError(() => of(DEFAULT_SITE_CONFIG)),
      shareReplay(1),
    ),
    { initialValue: DEFAULT_SITE_CONFIG },
  );

  /** URL de WhatsApp con el número administrable + mensaje prellenado. */
  whatsappUrl(mensaje: string): string {
    return `https://wa.me/${this.config().whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  }
}
