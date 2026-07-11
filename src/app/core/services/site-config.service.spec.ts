import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SiteConfigService } from './site-config.service';
import { DEFAULT_SITE_CONFIG } from '../models/site-config.model';
import { environment } from '../../../environments/environment';

describe('SiteConfigService', () => {
  let service: SiteConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiteConfigService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SiteConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('pide la config al construirse', () => {
    httpMock.expectOne(`${environment.apiUrl}/site-config`).flush(DEFAULT_SITE_CONFIG);
    expect(service.config().marca).toBe(DEFAULT_SITE_CONFIG.marca);
  });

  it('config() arranca con los defaults antes de responder la API', () => {
    // aún no se hace flush: debe estar el initialValue
    expect(service.config().whatsappNumber).toBe(DEFAULT_SITE_CONFIG.whatsappNumber);
    httpMock.expectOne(`${environment.apiUrl}/site-config`).flush(DEFAULT_SITE_CONFIG);
  });

  it('whatsappUrl() arma la URL con el número de config y el mensaje codificado', () => {
    httpMock.expectOne(`${environment.apiUrl}/site-config`).flush({ ...DEFAULT_SITE_CONFIG, whatsappNumber: '573015550123' });
    expect(service.whatsappUrl('Hola mundo')).toBe('https://wa.me/573015550123?text=Hola%20mundo');
  });

  it('cae a defaults si la API falla', () => {
    httpMock.expectOne(`${environment.apiUrl}/site-config`).error(new ProgressEvent('error'));
    expect(service.config()).toEqual(DEFAULT_SITE_CONFIG);
  });
});
