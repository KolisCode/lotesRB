import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class AdminLogin {
  private auth   = inject(AdminAuthService);
  private router = inject(Router);

  email    = '';
  password = '';
  cargando = signal(false);
  error    = signal('');

  onSubmit() {
    this.cargando.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.cargando.set(false);
        this.error.set('Credenciales inválidas. Intenta de nuevo.');
      },
    });
  }
}
