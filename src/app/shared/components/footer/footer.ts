import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECT, whatsappUrl } from '../../../core/config/project.constants';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  year = new Date().getFullYear();
  readonly whatsappUrl = whatsappUrl('Hola, me interesa información sobre los lotes');
  readonly whatsappNumber = PROJECT.whatsappNumber;
}
