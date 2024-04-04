import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Historico {
  dataHoraCautela: Date;
  nome: string;
  tipo: string;
  descricaoMaterial: string;
  dataHoraDevolucao?: Date;
  responsavelDevolucao?: string;
}

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  standalone: true,
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  form: FormGroup;
  historicos: Historico[] = [];
  private historicosCollection: AngularFirestoreCollection<Historico>;

  constructor(private firestore: AngularFirestore, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      dataHoraInformada: [''],
      dataHoraDevolucao: ['']
    });

    this.historicosCollection = this.firestore.collection<Historico>('historico');
  }

  buscar() {
    const dataHoraInformada = this.form.value.dataHoraInformada;
    const dataHoraDevolucao = this.form.value.dataHoraDevolucao;

    this.historicosCollection
      .ref
      .where('dataHoraCautela', '>', dataHoraInformada)
      .where('dataHoraDevolucao', '<=', dataHoraDevolucao)
      .get()
      .then((querySnapshot) => {
        this.historicos = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id
          } as Historico;
        });
      });
  }
}

