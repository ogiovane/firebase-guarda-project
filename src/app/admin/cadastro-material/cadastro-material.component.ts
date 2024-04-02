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
    descricao: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  constructor(private firestore: AngularFirestore) {}

  salvarDados(): void {
    if (this.cadastroForm.valid) {
      this.firestore.collection('materiais').add(this.cadastroForm.value)
        .then(() => alert('Material cadastrado com sucesso!'))
        .catch((error) => console.error('Erro ao salvar o material:', error));
      this.cadastroForm.reset();
    } else {
      alert('Preencha todos os campos do formulário corretamente.');
    }
  }
}
