import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-devolver-material',
  templateUrl: './devolver-material.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DevolverMaterialComponent implements OnInit {
  material: any;
  devolucaoForm: FormGroup;
  userData: any;
  currentUser: any;
  isUserDataLoaded: boolean = false; // Adicione um controle de estado

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService
  ) {
    this.devolucaoForm = this.fb.group({
      necessitaAbastecimento: ['', Validators.required],
      cupomAbastecimento: ['', Validators.pattern('[0-9]*')]
    });
  }

  ngOnInit(): void {
    this.material = history.state.material;
    this.devolucaoForm.get('necessitaAbastecimento').valueChanges.subscribe(value => {
      if (value === 'sim') {
        this.devolucaoForm.get('cupomAbastecimento').enable();
      } else {
        this.devolucaoForm.get('cupomAbastecimento').disable();
      }
    });


    this.authService.getUserData().then(data => {
      this.userData = data;
    });

    this.authService.getCurrentUserDetails().subscribe(user => {
      if (user.length > 0) {
        this.currentUser = user[0]; // Assumindo que o array tem os dados corretos
        this.isUserDataLoaded = true;
      }
    });
  }

  confirmarDevolucao(): void {
    const dataDevolucao = new Date(); // Captura a data e hora atual
    const atualizacaoHistorico = {
      status: 'Disponível',
      dataHoraDevolucao: dataDevolucao,
      responsavelDevolucao: `${this.currentUser.posto} ${this.currentUser.nomeGuerra}` || 'Nome não disponível', // Adiciona o nome do responsável pela devolução
      emailResponsavelDevolucao: `${this.currentUser.email}` || 'Email não disponível', // Adiciona o nome do responsável pela devolução
      ...(this.material.posto && { posto: this.material.posto }), // Inclua apenas se definido
      ...(this.material.nome && { nome: this.material.nome }), // Inclua apenas se definido
      ...(this.devolucaoForm.value.necessitaAbastecimento === 'sim' && { cupomAbastecimento: this.devolucaoForm.value.cupomAbastecimento })
    };

    // Atualizar status em 'historico'
    const atualizarHistorico = this.firestore.collection('historico').doc(this.material.id).update(atualizacaoHistorico);

    // Preparar para atualizar o status do material na coleção "materiais"
    const atualizarMateriais = this.firestore.collection('materiais', ref => ref.where('descricaoMaterial', '==', this.material.descricaoMaterial))
      .get().pipe(first()).toPromise().then(querySnapshot => {
        const updates = [];
        querySnapshot.forEach(doc => {
          updates.push(doc.ref.update({ status: 'Disponível' }));
        });
        return Promise.all(updates);
      });

    Promise.all([atualizarHistorico, atualizarMateriais]).then(() => {
      this.router.navigate(['/admin/materiais-cautelados']);
    }).catch(error => {
      console.error("Erro ao atualizar documentos:", error);
    });
  }

  atualizarStatusMaterial(): void {
    this.firestore.collection('materiais', ref => ref.where('descricaoMaterial', '==', this.material.descricaoMaterial))
      .get().pipe(first()).subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({ status: 'Disponível' })
          .then(() => console.log("Status atualizado com sucesso em 'materiais'"))
          .catch(error => console.error("Erro ao atualizar status em 'materiais':", error));
      });
    });
  }



  cancelar(): void {
    this.router.navigate(['/admin/materiais-cautelados']);
  }
}
