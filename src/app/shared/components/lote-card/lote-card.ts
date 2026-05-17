import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lote } from '../../../core/models/lote.model';
import { PrecioPipe } from '../../pipes/precio-pipe';

@Component({
  selector: 'app-lote-card',
  imports: [RouterLink, PrecioPipe],
  templateUrl: './lote-card.html',
  styleUrl: './lote-card.scss',
})
export class LoteCard {
  lote = input.required<Lote>();
}
