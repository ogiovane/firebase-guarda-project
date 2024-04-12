import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Material {
  id: string;
  tipo: string;
  status: string;
  descricaoMaterial: string;
  rg: string;
  nf: string;
  posto: string;
  nome: string;
}

@Component({
  selector: 'app-devolucao-material',
  templateUrl: './devolucao-material.component.html',
  styleUrls: ['./devolucao-material.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class DevolucaoMaterialComponent implements OnInit {
  devolucaoForm: FormGroup;
  material: Material | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.devolucaoForm = this.fb.group({
      abasteceu: ['', Validators.required],
      cupomAbastecimento: [''],
      descricaoMaterial: [{ value: '', disabled: true }],
      tipoMaterial: [{ value: '', disabled: true }]
    });

    const navigation = this.router.getCurrentNavigation();
    this.material = navigation?.extras.state?.['material'] as Material;

    if (this.material) {
      this.devolucaoForm.patchValue({
        descricaoMaterial: this.material.descricaoMaterial,
        tipoMaterial: this.material.tipo
      });
    }

    // Observar mudanças no campo 'abasteceu' para controlar a validação de 'cupomAbastecimento'
    this.devolucaoForm.get('abasteceu')?.valueChanges.subscribe(abasteceu => {
      const cupomAbastecimentoControl = this.devolucaoForm.get('cupomAbastecimento');
      if (abasteceu === 'Sim') {
        cupomAbastecimentoControl?.setValidators([Validators.required]);
        cupomAbastecimentoControl?.updateValueAndValidity();
      } else {
        cupomAbastecimentoControl?.clearValidators();
        cupomAbastecimentoControl?.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {}

  salvarDevolucao(): void {
    // Primeiro, verifique se o formulário é válido e se o objeto material está presente
    if (this.devolucaoForm.valid && this.material) {
      // Constrói o objeto de histórico com os dados necessários
      const historicoData = {
        materialId: this.material.id,
        descricao: this.material.descricaoMaterial,
        tipo: this.material.tipo,
        abasteceu: this.devolucaoForm.value.abasteceu,
        // Inclui o cupom de abastecimento apenas se a resposta for 'Sim' e o campo não estiver vazio
        cupomAbastecimento: this.devolucaoForm.value.abasteceu === 'Sim' ? this.devolucaoForm.value.cupomAbastecimento : null,
        dataHoraDevolucao: new Date(),
        // Campos adicionais como 'responsavel' podem ser incluídos aqui
      };

      // Processo de atualização do status do material para 'Disponível'
      this.firestore.collection('materiais').doc(this.material.id).update({ status: 'Devolvido' })
        .then(() => {
          // Salva o registro no histórico independente da resposta para 'Abasteceu?'
          this.firestore.collection('historico').add(historicoData)
            .then(() => {
              console.log('Histórico de devolução registrado com sucesso.');
              // Redireciona para a listagem de materiais após salvar
              this.router.navigate(['/listar-materiais']);
            }).catch(error => console.error('Erro ao registrar histórico de devolução:', error));
        }).catch(error => console.error('Erro ao atualizar status do material:', error));
    } else {
      alert('Por favor, preencha todos os campos necessários.');
    }
  }


  cancelar(): void {
    this.router.navigate(['/admin/listar-materiais']);
  }
}
