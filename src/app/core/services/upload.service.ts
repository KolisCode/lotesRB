import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Sube una imagen al backend (lotes, hero, branding) y devuelve su URL pública. */
@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);

  uploadImagen(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload/imagen`, fd);
  }
}
