import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MensagemService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private afAuth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);

  constructor(private mensagemService: MensagemService) {

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

  private ERROS_FIREBASE = {
    'auth/invalid-email': 'O endereço de e-mail está mal formatado.',
    'auth/user-disabled': 'Esta conta de usuário foi desativada pelo administrador.',
    'auth/user-not-found': 'Não existe conta de usuário correspondente a este identificador. O usuário pode ter sido excluído.',
    'auth/wrong-password': 'A senha é inválida ou o usuário não tem uma senha.',
    'auth/invalid-credential': 'A credencial/senha fornecida está incorreta ou não autorizada.',
    'auth/admin-restricted-operation': 'Acesso somente a usuários previamente autorizados.'
    // Adicione mais mapeamentos conforme necessário
  };

  // Função de tradução
  private traduzirErroFirebase(codigoErro: string): string {
    return this.ERROS_FIREBASE[codigoErro] || 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
  }

  loginWithGoogle(): Promise<any> {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        this.router.navigate(['/admin/dashboard']);
      })
      .catch(error => {
        const mensagemErro = this.traduzirErroFirebase(error.code);
        this.mensagemService.mudarMensagem(mensagemErro); // Enviando mensagem de erro em português
        console.error('Erro ao fazer login com Google: ', mensagemErro);
      });
  }

  // Método para registrar um novo usuário com e-mail e senha
  async registerWithEmailPassword(email: string, password: string): Promise<any> {
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
  public loginWithEmailPassword(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/admin/dashboard']);
      })
      .catch(error => {
        const mensagemErro = this.traduzirErroFirebase(error.code);
        this.mensagemService.mudarMensagem(mensagemErro);
        console.error('Erro ao fazer login: ', mensagemErro);
        throw new Error(mensagemErro);
      });
  }

  logout() {
    // Logout do Firebase
    this.afAuth.signOut().then(() => {
      console.log('Logout do Firebase realizado com sucesso.');
      this.router.navigate(['/public/login']);
    }).catch(error => {
      console.error('Erro ao fazer logout do Firebase:', error);
    });

    // Logout do OAuth2
    this.oAuthService.logOut();

    // Redireciona para a página de login após o logout
    this.router.navigate(['/public/login']);
  }

  async logoutGoogleAuth(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/public/login']);
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

  getUser(): Observable<firebase.User | null> {
    return this.afAuth.authState; // authState é um Observable de firebase.User
  }

  getCurrentUserDetails(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log('Usuário logado:', user.email); // Log do email do usuário
          return this.firestore.collection('usuarios', ref => ref.where('email', '==', user.email)).valueChanges({ idField: 'id' });
        } else {
          console.log('Nenhum usuário logado.');
          return of(null);
        }
      })
    );
  }
}


