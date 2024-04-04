import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { Router } from '@angular/router';
import { CadastrosService } from '../../services/cadastros.service';


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
  errorMessage: string = '';


  cadastroForm = new FormGroup({
    posto: new FormControl('', Validators.required),
    nome: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
    rg: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern(/^\d+$/)]),
    nf: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+$/)]),
    celular: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    lotacao: new FormControl('', Validators.required)
  });

  constructor(private db: AngularFirestore, private router: Router, private cadastrosService: CadastrosService) {
  }

  ngOnInit(): void {
    this.postos = this.cadastrosService.postos;
    this.lotacoes = this.cadastrosService.lotacoes;
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
    const id = this.cadastroForm.get('nf').value;

    try {
      const docRef = this.db.collection('cadastros').doc(id);
      await docRef.set(this.cadastroForm.value);
      // Sucesso!
      alert('Cadastro salvo com sucesso!'); // Substitua por sua lógica de notificação se necessário
      this.cadastroForm.reset();
      this.errorMessage = '';
      this.router.navigate(['/lista-cadastros']); // Redireciona para '/lista-cadastros'
    } catch (error) {
      // Erro ao salvar dados
      console.error(error);
      this.errorMessage = 'Erro ao salvar dados';
      alert('Erro ao salvar dados.'); // Opcional: Substitua por sua lógica de notificação
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
    this.router.navigate(['/dashboard/default']);
  }
}
