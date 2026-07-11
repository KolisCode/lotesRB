import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-proyecto',
  imports: [RouterLink],
  templateUrl: './proyecto.html',
  styleUrl: './proyecto.scss',
})
export class Proyecto {
  private siteConfig = inject(SiteConfigService);

  readonly cfg = this.siteConfig.config;

  get whatsappUrl() { return this.siteConfig.whatsappUrl('Hola, quiero info sobre el proyecto'); }
}
