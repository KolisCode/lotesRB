import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappUrl } from '../../core/config/project.constants';

@Component({
  selector: 'app-proyecto',
  imports: [RouterLink],
  templateUrl: './proyecto.html',
  styleUrl: './proyecto.scss',
})
export class Proyecto {
  readonly whatsappUrl = whatsappUrl('Hola, quiero info sobre el proyecto');
}
