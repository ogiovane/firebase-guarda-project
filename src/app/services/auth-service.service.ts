import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { combineLatest, Observable, of } from 'rxjs';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private afAuth = inject(AngularFireAuth);

  constructor() {
    const authConfig: AuthConfig = {
      // Suas outras configurações de AuthConfig aqui...
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setStorage(localStorage); // Usar localStorage para salvar a sessão
    this.oAuthService.tryLoginImplicitFlow().then(() => {
      if (this.oAuthService.hasValidAccessToken()) {
        this.saveUserSession();
      }
    });
  }

  isLoggedIn(): Observable<boolean> {
    const firebaseLoggedIn = this.afAuth.authState.pipe(map(user => !!user));
    const oauthLoggedIn = of(this.oAuthService.hasValidAccessToken());

    // Aqui usamos a função combineLatest importada corretamente
    return combineLatest([firebaseLoggedIn, oauthLoggedIn]).pipe(
      map(([firebase, oauth]) => firebase || oauth)
    );
  }

  saveUserSession() {
    // Aqui você pode salvar informações adicionais da sessão, se necessário
    const claims = this.oAuthService.getIdentityClaims();
    if (claims) {
      localStorage.setItem('user', JSON.stringify(claims));
    }
  }

  getUserSession() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  // Método para registrar um novo usuário com e-mail e senha
  async registerWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log(result);
      // Aqui você pode redirecionar o usuário ou fazer alguma lógica pós-registro
      this.router.navigate(['/admin/dashboard']);
    } catch (error) {
      console.error(error);
    }
  }

  // Método para login com e-mail e senha
  async loginWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(result);
      // Redirecionar para a rota desejada após o login bem-sucedido
      this.router.navigate(['/admin/dashboard']);
    } catch (error) {
      console.error(error);
    }
  }

  logout() {
    // Logout do Firebase
    this.afAuth.signOut().then(() => {
      console.log('Logout do Firebase realizado com sucesso.');
    }).catch(error => {
      console.error('Erro ao fazer logout do Firebase:', error);
    });

    // Logout do OAuth2
    this.oAuthService.logOut();

    // Redireciona para a página de login após o logout
    this.router.navigate(['/login']);
  }

  async logoutGoogleAuth(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }


  getCurrentUser(): Observable<User> {
    return this.afAuth.authState; // afAuth é uma referência para AngularFireAuth
  }

  async getUserData(): Promise<any> {
    // Verifica se o usuário está autenticado via OAuth2
    if (this.oAuthService.hasValidAccessToken()) {
      const claims: any = this.oAuthService.getIdentityClaims();
      return {
        name: claims?.name,
        email: claims?.email,
        picture: claims?.picture
        // Outros campos conforme necessário...
      };
    }

    // Verifica se o usuário está autenticado via Firebase
    const firebaseUser = await this.afAuth.currentUser;
    if (firebaseUser) {
      return {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        picture: firebaseUser.photoURL
        // Outros campos conforme necessário...
      };
    }

    return null; // Retornar nulo ou algum valor padrão se nenhum usuário estiver logado
  }

}

