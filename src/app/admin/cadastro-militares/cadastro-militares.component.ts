import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';


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

export class CadastroMilitaresComponent {
  postos = ['AL SD', 'SD', 'CB', 'SGT', 'SUBTEN', 'AL OF', 'ASP OF', 'TEN', 'CAP', 'MAJ', 'TEN-CEL', 'CEL'];
  lotacoes = ['1CIA', '2CIA', '3CIA', '4CIA', '5CIA', 'PCS', 'FT', 'OUTRA UNIDADE'];
  errorMessage: string = '';


  cadastroForm = new FormGroup({
    posto: new FormControl('', Validators.required),
    nome: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
    rg: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern(/^\d+$/)]),
    nf: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+$/)]),
    celular: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.pattern(/^\d+$/)]),
    email: new FormControl('', [Validators.email]),
    lotacao: new FormControl('', Validators.required),
  });

  constructor(private db: AngularFirestore) {}



  async onSubmit() {
    const id = this.cadastroForm.get('nf').value;

    try {
      const docRef = this.db.collection('cadastros').doc(id);
      docRef.set(this.cadastroForm.value).then(() => {
        // Sucesso!
        this.cadastroForm.reset();
        this.errorMessage = '';
      }).catch((error) => {
        // Erro ao salvar dados
        console.error(error);
        this.errorMessage = 'Erro ao salvar dados';
      });
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Erro ao salvar dados';
    }
  }
}
