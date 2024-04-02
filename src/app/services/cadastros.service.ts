// src/app/services/cadastros.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { QueryFn } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CadastrosService {
  constructor(private firestore: AngularFirestore) {}

  getCadastros(searchText?: string) {
    // Iniciar com uma referência à coleção
    let collection = this.firestore.collection('cadastros', ref => {
      let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      if (searchText) {
        // Aplica os filtros na busca. Ajuste conforme a necessidade para case-sensitive/insensitive
        query = query.where('nome', '>=', searchText)
          .where('nome', '<=', searchText + '\uf8ff');
      }
      return query;
    });

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as {[key: string]: any}; // Asserção de tipo
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
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

}
