import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteConfig } from '../models/site-config.model';
import { UploadService } from './upload.service';
import { environment } from '../../../environments/environment';

export type SiteConfigPayload = Partial<Omit<SiteConfig, never>>;

@Injectable({ providedIn: 'root' })
export class AdminSiteConfigService {
  private http = inject(HttpClient);
  private uploadSvc = inject(UploadService);

  get() {
    return this.http.get<SiteConfig>(`${environment.apiUrl}/site-config`);
  }

  update(payload: SiteConfigPayload) {
    return this.http.put<SiteConfig>(`${environment.apiUrl}/site-config`, payload);
  }

  /** Sube una imagen (hero/branding) y devuelve su URL pública. */
  uploadImagen(file: File) {
    return this.uploadSvc.uploadImagen(file);
  }
}
