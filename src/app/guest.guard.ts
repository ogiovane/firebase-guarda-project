import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { AuthService } from './services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return this.authService.isLoggedIn().pipe(map(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/admin/dashboard']); // Usuário logado, redirecionar para dashboard
        return false;
      }
      return true; // Usuário não logado, acesso permitido à rota de login
    }));
  }
}
