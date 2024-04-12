import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MensagemService } from '../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-material',
  templateUrl: './cadastro-material.component.html',
  styleUrls: ['./cadastro-material.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class CadastroMaterialComponent implements OnInit {
  cadastroForm: FormGroup;
  mensagemErro: string;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private router: Router,
    private mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      tipo: ['', Validators.required],
      descricaoMaterial: ['', Validators.required],
      observacao: ['']
    });
  }

  salvarDados(): void {
    if (this.cadastroForm.valid) {
      const material = { ...this.cadastroForm.value, status: 'Disponível' };

      this.firestore.collection('materiais', ref => ref
        .where('tipo', '==', material.tipo)
        .where('descricaoMaterial', '==', material.descricaoMaterial))
        .get()
        .toPromise()
        .then((resultado) => {
          if (resultado.empty) {
            this.firestore.collection('materiais').add(material)
              .then(() => {
                this.mensagemService.mudarMensagem('Material cadastrado com sucesso!');
                this.router.navigate(['/admin/listar-materiais']);
              })
              .catch((error) => {
                console.error('Erro ao salvar o material:', error);
                this.mensagemErro = 'Erro ao salvar o material. Por favor, tente novamente.';
              });
          } else {
            this.mensagemErro = 'Um material com o mesmo tipo e descrição já existe.';
          }
        })
        .catch((error) => {
          console.error('Erro ao verificar duplicidade:', error);
          this.mensagemErro = 'Erro ao verificar a duplicidade do material.';
        });
    } else {
      this.mensagemErro = 'Preencha todos os campos do formulário corretamente.';
    }
  }

  formatarDescricao(event: any): void {
    const valor = event.target.value.toUpperCase().replace(/\s/g, '');
    this.cadastroForm.get('descricaoMaterial').setValue(valor, { emitEvent: false });
  }

  cancelar() {
    this.router.navigate(['/admin/listar-materiais']);
  }
}
