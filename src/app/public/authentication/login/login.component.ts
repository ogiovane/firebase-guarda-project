import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MensagemService } from '../../../services/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user: User | null = null;
  isLoggedIn = false;
  email: string = '';
  password: string = '';
  errorMessage: any;

  constructor(protected authService: AuthService, private router: Router, protected mensagemService: MensagemService ) {
  }


  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then((userCredential) => {
        this.user = userCredential.user;
        this.isLoggedIn = true; // Atualiza o flag após a autenticação bem sucedida!
        this.router.navigate(['/admin/dashboard']); // Redirecionar após o login
      })
      .catch(error => console.error(error));
  }

  loginWithEmailPassword() {
    this.authService.loginWithEmailPassword(this.email, this.password).then(() => {
      this.router.navigate(['/admin/dashboard/']); // Navega para o dashboard após o login bem-sucedido
    }).catch(error => {
      // console.error('Erro ao fazer login', error);
      error => console.error(error);
    });
  }

  // Método opcional para registro

  registerWithEmailPassword(email: string, password: string) {
    this.authService.registerWithEmailPassword(this.email, this.password);
  }
}
