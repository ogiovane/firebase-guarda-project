// src/app/public/authentication/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MensagemService } from '../../../services/message.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private mensagemService: MensagemService  // Injete o serviço de mensagens aqui
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      this.afAuth.sendPasswordResetEmail(email).then(() => {
        this.mensagemService.mudarMensagem('Caso o email esteja cadastrado você receberá um email com a redefinição de senha.');
        this.router.navigate(['/public/login']);  // Redireciona para a página de login
      }).catch((error) => {
        this.mensagemService.mudarMensagem('Falha ao enviar o link de redefinição de senha. Verifique o email fornecido.');
        console.error('Error sending password reset email:', error);
      });
    }
  }
}
