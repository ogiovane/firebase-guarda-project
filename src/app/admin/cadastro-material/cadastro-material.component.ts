import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import firebase from 'firebase/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-cadastro-material',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-material.component.html',
  styleUrl: './cadastro-material.component.scss'
})

export class CadastroMaterialComponent {
  cadastroForm = new FormGroup({
    tipo: new FormControl('', Validators.required),
    descricaoMaterial: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  constructor(private firestore: AngularFirestore) {
  }

  salvarDados(): void {
    if (this.cadastroForm.valid) {
      const { tipo, descricaoMaterial } = this.cadastroForm.value;
      // Busca na coleção 'materiais' por documentos com os mesmos 'tipo' e 'descricaoMaterial'
      this.firestore.collection('materiais', ref => ref
        .where('tipo', '==', tipo)
        .where('descricaoMaterial', '==', descricaoMaterial))
        .get()
        .toPromise()
        .then((resultado) => {
          if (resultado.empty) {
            // Se não houver documentos duplicados, prossegue com a adição do novo documento
            this.firestore.collection('materiais').add(this.cadastroForm.value)
              .then(() => alert('Material cadastrado com sucesso!'))
              .catch((error) => console.error('Erro ao salvar o material:', error));
          } else {
            // Se houver documentos duplicados, alerta o usuário
            alert('Um material com o mesmo tipo e descrição já existe.');
          }
        })
        .catch((error) => console.error('Erro ao verificar duplicidade:', error));
      this.cadastroForm.reset();
    } else {
      alert('Preencha todos os campos do formulário corretamente.');
    }
  }
}
