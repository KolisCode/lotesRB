import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '../../../core/services/site-config.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private siteConfig = inject(SiteConfigService);
  readonly cfg = this.siteConfig.config;
  year = new Date().getFullYear();

  get whatsappUrl() { return this.siteConfig.whatsappUrl('Hola, me interesa información sobre los lotes'); }
}
