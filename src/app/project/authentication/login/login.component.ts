import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  {
  user: User | null = null;
  isLoggedIn = false;
  email: string = '';
  password: string = '';

  constructor(protected authService: AuthService, private router: Router) {
  }


  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then((userCredential) => {
        this.user = userCredential.user;
        this.isLoggedIn = true; // Atualiza o flag após a autenticação bem sucedida!
        this.router.navigate(['/dashboard/default']); // Redirecionar após o login
      })
      .catch(error => console.error(error));
  }

  login() {
    this.authService.loginWithEmailAndPassword(this.email, this.password).then(() => {
      this.router.navigate(['/dashboard/default']); // Navega para o dashboard após o login bem-sucedido
    }).catch(error => {
      console.error('Erro ao fazer login', error);
    });
  }
}
