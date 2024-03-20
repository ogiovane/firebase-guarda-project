import { Component } from '@angular/core';
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
  postos = ['AL SD', 'SD', 'CB', '3º SGT', '2º SGT', '1º SGT', 'SUBTEN', 'AL OF', 'ASP OF', 'TEN', 'CAP', 'MAJ', 'TEN-CEL', 'CEL'];
  lotacoes = ['1ª Cia', '2ª Cia', '4ª Cia', '5ª Cia', 'PCS', 'FT', 'Outros'];

  cadastroForm = new FormGroup({
    posto: new FormControl('', Validators.required),
    nomeCompleto: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
    rg: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern(/^\d+$/)]),
    nf: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+$/)]),
    celular: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.pattern(/^\d+$/)]),
    email: new FormControl('', [Validators.email]),
    lotacao: new FormControl('', Validators.required),
  });

  constructor(private db: AngularFirestore) {}

  salvarDados(): void {
    if (this.cadastroForm.valid) {
      const formValue = this.cadastroForm.value;

      // Criar um novo documento no Firestore
      const docRef = this.db.collection('cadastros').doc();

      // Salvar os dados do formulário no documento
      docRef.set(formValue)
        .then(() => console.log('Dados salvos com sucesso!'))
        .catch((error) => console.error('Erro ao salvar os dados', error));
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }
}
