import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {
    this.auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(err => console.error(err));

  }

  loginWithGoogle() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithEmailAndPassword(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  getCurrentUser(): Observable<User> {
    return this.auth.authState; // afAuth é uma referência para AngularFireAuth
  }



  // ... adicione outros métodos para registro, recuperação de senha, etc
}
