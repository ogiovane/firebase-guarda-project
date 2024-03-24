// src/app/services/cadastros.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastrosService {
  constructor(private firestore: AngularFirestore) {}

  getCadastroByNf(nf: string): Observable<any[]> {
    return this.firestore.collection('cadastros', ref => ref.where('nf', '==', nf)).valueChanges({ idField: 'id' });
  }
}
