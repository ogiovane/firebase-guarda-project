import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { Router } from '@angular/router';
import { CadastrosService } from '../../services/cadastros.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MensagemService } from '../../services/message.service';


@Component({
  selector: 'app-cadastro-militares',
  templateUrl: './cadastro-militares.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularFireModule,
    AngularFirestoreModule
  ],
  styleUrls: ['./cadastro-militares.component.scss']
})

export class CadastroMilitaresComponent implements OnInit {
  postos: string[];
  lotacoes: string[];
  errorMessage: string;
  mensagem: string;
  sucesso: boolean;
  cadastroForm: FormGroup;

  constructor(private db: AngularFirestore, private router: Router, private cadastrosService: CadastrosService, private mensagemService: MensagemService
  ) {
  }

  ngOnInit(): void {
    this.postos = this.cadastrosService.postos;
    this.lotacoes = this.cadastrosService.lotacoes;
    this.inicializarForm();
  }


  inicializarForm(): void {
    this.cadastroForm = new FormGroup({
      posto: new FormControl('', Validators.required),
      nome: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
      rg: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern(/^\d+$/)]),
      nf: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+$/)]),
      celular: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      lotacao: new FormControl('', Validators.required)
    });
  }

  onNomeChange(event: any) {
    const valor = event.target.value.replace(/[0-9]/g, '').toUpperCase(); // Remove números e converte para maiúsculas
    this.cadastroForm.get('nome').setValue(valor, { emitEvent: false }); // Atualiza o valor sem emitir um novo evento de mudança
  }

  onRGChange(event: any) {
    const valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    this.cadastroForm.get('rg').setValue(valor, { emitEvent: false }); // Atualiza o valor sem emitir um novo evento de mudança
  }

  onNFChange(event: any) {
    const valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    this.cadastroForm.get('nf').setValue(valor, { emitEvent: false }); // Atualiza o valor sem emitir um novo evento de mudança
  }

  async onSubmit() {
    if (this.cadastroForm.invalid) {
      this.mensagemService.mudarMensagem('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const nf = this.cadastroForm.get('nf').value;
    const docs = await this.db.collection('cadastros', ref => ref.where('nf', '==', nf)).get().toPromise();

    if (docs.empty) {
      this.db.collection('cadastros').doc(nf).set(this.cadastroForm.value)
        .then(() => {
          this.mensagemService.mudarMensagem('Cadastro salvo com sucesso!');
          this.router.navigate(['/admin/lista-cadastros']);
        })
        .catch(error => {
          console.error('Erro ao salvar o cadastro:', error);
          this.mensagemService.mudarMensagem('Erro ao salvar dados.');
        });
    } else {
      this.mensagemService.mudarMensagem('Um cadastro com este NF já existe.');
      this.router.navigate(['/admin/lista-cadastros']);
    }
  }

  formatarCelular(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');

    this.cadastroForm.get('celular').setValue(valor, { emitEvent: false });
  }

  cancelar() {
    this.router.navigate(['/admin/dashboard']);
  }
}
