// src/app/services/cadastros.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Cadastro } from '../interfaces/cadastro';


@Injectable({
  providedIn: 'root'
})
export class CadastrosService {
  postos = ['ALSD', 'SD', 'CB', '3SGT','2SGT','1SGT', 'SUBTEN', 'ALOF', 'ASPOF', 'TEN', 'CAP', 'MAJ', 'TEN CEL', 'CEL'];
  lotacoes = ['1CIA', '2CIA', '3CIA', '4CIA', '5CIA', 'PCS', 'FT', 'OUTRA UNIDADE'];

  constructor(private firestore: AngularFirestore) {}

  getCadastros(): Observable<Cadastro[]> {
    return this.firestore.collection<Cadastro>('cadastros', ref => ref.orderBy('nome', 'asc'))
      .valueChanges({ idField: 'id' });
  }
  deleteCadastro(id: string): Promise<void> {
    return this.firestore.collection('cadastros').doc(id).delete();
  }

  // Método para atualizar um cadastro
  updateCadastro(id: string, cadastroData: any): Promise<void> {
    return this.firestore.collection('cadastros').doc(id).update(cadastroData);
  }

  getCadastroByNf(nf: string): Observable<any[]> {
    return this.firestore.collection('cadastros', ref => ref.where('nf', '==', nf)).valueChanges({ idField: 'id' });
  }

  getCadastroById(id: string): Observable<any> {
    return this.firestore.collection('cadastros').doc(id).valueChanges();
  }

  buscarCadastros(nome: string): Observable<Cadastro[]> {
    return this.firestore.collection<Cadastro>('cadastros', ref =>
      ref.where('nome', '==', nome)
    ).valueChanges();
  }

}
