import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth-service.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MensagemService } from '../../services/message.service'; // Ajuste para o caminho correto

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule
  ],
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  usuarioId: string;
  userDetails$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authService: AuthService,
    public mensagemService: MensagemService // Injetar o serviço de mensagens
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      email: ['', Validators.email],
      posto: ['', Validators.required],
      nome: ['', Validators.required],
      rg: ['', Validators.required],
      nf: ['', Validators.required],
      nomeGuerra: ['', Validators.required]
    });

    this.authService.getUser().subscribe(user => {
      this.usuarioId = user.uid;
      this.perfilForm.patchValue({
        email: user.email
      });
      this.carregarDadosUsuario();
    });

    this.userDetails$ = this.authService.getCurrentUserDetails();
  }

  carregarDadosUsuario() {
    this.db.collection('usuarios').doc(this.usuarioId).valueChanges().subscribe((dados: any) => {
      this.perfilForm.patchValue(dados);
    });
  }

  salvarPerfil() {
    if (this.perfilForm.invalid) {
      this.mensagemService.mudarMensagem('Por favor, preencha todos os campos.');
      return;
    }

    const nf = this.perfilForm.get('nf').value;
    this.db.collection('usuarios', ref => ref.where('nf', '==', nf).limit(1)).get().toPromise().then((result) => {
      if (!result.empty && result.docs[0].id !== this.usuarioId) {
        this.mensagemService.mudarMensagem('Um usuário com este NF já existe.');
      } else {
        this.db.collection('usuarios').doc(this.usuarioId).set(this.perfilForm.value, { merge: true }).then(() => {
          this.mensagemService.mudarMensagem('Perfil atualizado com sucesso!');
        }).catch(error => {
          console.error('Erro ao atualizar o perfil:', error);
          this.mensagemService.mudarMensagem('Erro ao salvar o perfil.');
        });
      }
    });
  }
}
