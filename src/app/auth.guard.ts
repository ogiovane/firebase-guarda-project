import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, tap } from 'rxjs/operators';
import { Observable, take } from 'rxjs';
import { AuthService } from './services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().pipe(map(isLoggedIn => {
      const isLoginPage = state.url.includes('/public/login');

      if (isLoggedIn && isLoginPage) {
        // Usuário está logado e tentando acessar a página de login, redireciona para o dashboard
        this.router.navigate(['/admin/dashboard']);
        return false;
      } else if (!isLoggedIn && !isLoginPage) {
        // Usuário não está logado e tentando acessar uma rota protegida, redireciona para login
        this.router.navigate(['/public/login']);
        return false;
      }

      return true;
    }));
  }
}
