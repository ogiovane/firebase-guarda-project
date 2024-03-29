import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, tap } from 'rxjs/operators';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user), // Converte o objeto user em um booleano
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('Acesso negado');
          this.router.navigate(['/login']); // Redireciona para a página de login
        }
      })
    );
  }
}
