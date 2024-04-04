import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoricoCautelasService } from '../../services/historico-cautelas.service';
import { Router } from '@angular/router';
import { MateriaisService } from '../../services/materiais.service';
import { NgIf } from '@angular/common';
import { first } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-receber-material',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './receber-material.component.html',
  styleUrl: './receber-material.component.scss'
})
export class ReceberMaterialComponent implements OnInit {
  devolucaoForm: FormGroup;
  material: any;
  userData: any;


  constructor(private router: Router, private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.material = history.state.material;
    this.authService.getUserData().then(data => {
      this.userData = data;
    });
  }

  receberMaterial() {
    // this.router.navigate(['/receber-material'], { state: { material } });
  }

  confirmarDevolucao(): void {
    const dataDevolucao = new Date(); // Captura a data e hora atual
    const atualizacaoHistorico = {
      status: 'Devolvido',
      dataHoraDevolucao: dataDevolucao,
      descricaoMaterial: this.material.descricaoMaterial,
      responsavelDevolucao: this.userData.name || 'Nome não disponível', // Adiciona o nome do responsável pela devolução)
    };

    // Atualizar status em 'historico'
    const salvarHistorico = this.firestore.collection('historico').add(atualizacaoHistorico).then(docRef => {
      console.log('Emprestimo registrado com sucesso:', docRef.id);
    });



    // Preparar para atualizar o status do material na coleção "materiais"
    const atualizarMateriais = this.firestore.collection('materiais', ref => ref.where('descricaoMaterial', '==', this.material.descricaoMaterial))
      .get().pipe(first()).toPromise().then(querySnapshot => {
        const updates = [];
        querySnapshot.forEach(doc => {
          updates.push(doc.ref.update({ status: 'Disponível', motivoBaixa: '', integranteP4: '' }));
        });
        return Promise.all(updates);
      });

    Promise.all([salvarHistorico, atualizarMateriais]).then(() => {
      this.router.navigate(['/materiais-cautelados']);
    }).catch(error => {
      console.error('Erro ao atualizar documentos:', error);
    });
  }

  cancelar(): void {
    this.router.navigate(['/materiais-cautelados']);
  }
}
