import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';

interface Material {
  id: string;
  descricao: string;
  status: string;
}

interface Militar {
  id: string;
  rg: string;
  nomeCompleto: string;
  posto: string;
  // Adicione outras propriedades conforme necessário
}

@Component({
  selector: 'app-emprestar-material',
  templateUrl: './emprestar-material.component.html',
  styleUrls: ['./emprestar-material.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CommonModule]
})
export class EmprestarMaterialComponent implements OnInit {
  emprestimoForm: FormGroup;
  materiaisDisponiveis$: Observable<Material[]>;
  materiaisDisponiveis: Material[] = [];

  constructor(private firestore: AngularFirestore) {
    this.emprestimoForm = new FormGroup({
      nf: new FormControl('', Validators.required),
      rg: new FormControl({ value: '', disabled: true }, Validators.required),
      nomeCompleto: new FormControl({ value: '', disabled: true }, Validators.required),
      posto: new FormControl({ value: '', disabled: true }, Validators.required),
      tipo: new FormControl('', Validators.required),
      materialId: new FormControl('', Validators.required),
      descricaoMaterial: new FormControl('', Validators.required), // Campo adicionado para descrição
      status: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.emprestimoForm.get('tipo')?.valueChanges.pipe(
      switchMap(tipo => {
        if (tipo) {
          return this.firestore.collection<Material>('materiais', ref =>
            ref.where('status', '==', 'Disponível').where('tipo', '==', tipo)
          ).valueChanges({ idField: 'id' });
        } else {
          // Se nenhum tipo for selecionado, limpa a lista
          return of([]);
        }
      })
    ).subscribe(materiais => {
      this.materiaisDisponiveis = materiais; // Garanta que esta linha está correta
    });
  }


  carregarMateriaisPorTipo(): void {
    let tipo = this.emprestimoForm.get('tipo')?.value;
    if (tipo) {
      this.materiaisDisponiveis$ = this.firestore.collection<Material>('materiais', ref =>
        ref.where('status', '==', 'Disponível').where('tipo', '==', tipo)
      ).valueChanges({ idField: 'id' });
    } else {
      this.materiaisDisponiveis$ = new Observable<Material[]>(); // Reset quando nenhum tipo é selecionado
    }
  }
  validarMilitar(): void {
    const nf = this.emprestimoForm.get('nf')?.value;
    this.firestore.collection<Militar>('cadastros', ref => ref.where('nf', '==', nf)).valueChanges({ idField: 'id' }).pipe(
      map(militares => militares[0])
    ).subscribe(militar => {
      if (militar) {
        this.emprestimoForm.patchValue({
          rg: militar.rg,
          nomeCompleto: militar.nomeCompleto,
          posto: militar.posto,
        });
      } else {
        alert('Militar não encontrado.');
      }
    });
  }

  adicionarAoHistorico(dadosEmprestimo): void {
    const registroHistorico = {
      ...dadosEmprestimo,
      dataHora: dadosEmprestimo.dataHora.toISOString(), // Converte a data/hora para string ISO
      // Certifique-se de que os campos necessários estão incluídos, você pode omitir campos não desejados aqui
    };

    this.firestore.collection('historico').add(registroHistorico)
      .then(() => console.log('Registro adicionado ao histórico com sucesso.'))
      .catch(error => console.error('Erro ao adicionar registro ao histórico:', error));
  }

  atualizarDescricaoMaterial(event: any): void {
    const selectedId = event.target.value;
    const selectedMaterial = this.materiaisDisponiveis.find(material => material.id === selectedId);
    this.emprestimoForm.patchValue({ descricaoMaterial: selectedMaterial?.descricao || '' });
  }

  salvarEmprestimo(): void {
    if (this.emprestimoForm.valid) {
      const emprestimoData = this.emprestimoForm.getRawValue(); // getRawValue para incluir campos desabilitados
      const agora = new Date();
      emprestimoData.dataHora = agora;

      this.firestore.collection('cautelas').add(emprestimoData).then(docRef => {
        this.atualizarStatusMaterial(emprestimoData.materialId, 'Emprestado');
        this.adicionarAoHistorico(emprestimoData); // Agora inclui descrição do material
        console.log('Emprestimo registrado com sucesso:', docRef.id);
      }).catch(error => {
        console.error('Erro ao salvar empréstimo:', error);
      });
    }
  }

  atualizarStatusMaterial(materialId: string, novoStatus: string): void {
    this.firestore.collection('materiais').doc(materialId).update({ status: novoStatus })
      .then(() => console.log('Status do material atualizado com sucesso.'))
      .catch(error => console.error('Erro ao atualizar status do material:', error));
  }

  cancelarEmprestimo(): void {
    this.emprestimoForm.reset();
  }
}
