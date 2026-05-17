import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="not-found container">
      <h1 class="not-found__code">404</h1>
      <p class="not-found__msg">La página que buscas no existe.</p>
      <a routerLink="/home" class="btn btn--primary">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 1rem;
      text-align: center;
    }
    .not-found__code {
      font-size: clamp(4rem, 15vw, 8rem);
      font-weight: 800;
      color: var(--color-primary, #2563eb);
      line-height: 1;
    }
    .not-found__msg {
      font-size: 1.125rem;
      color: var(--color-muted, #6b7280);
    }
  `],
})
export class NotFound {}
