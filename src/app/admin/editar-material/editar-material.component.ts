import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-material.component.html',
  styleUrl: './editar-material.component.scss'
})
export class EditarMaterialComponent implements OnInit {
  material: any = { status: '', motivoBaixa: '' };
  materialId: string;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.materialId = this.route.snapshot.params['id'];
    this.firestore.collection('materiais').doc(this.materialId).valueChanges().subscribe(material => {
      this.material = material;
    });
  }

  onStatusChange(status: string): void {
    this.material.status = status;
    // Seu código adicional para lidar com a mudança de status, se necessário
  }

  editarMaterial(): void {
    // Prepara o objeto com as atualizações do material
    const updateData = {
      descricaoMaterial: this.material.descricaoMaterial,
      status: this.material.status,
      tipo: this.material.tipo
    };

    // Se o status é 'Disponível', garante que o motivo da baixa seja limpo
    if (this.material.status === 'Disponível') {
      updateData['motivoBaixa'] = ''; // Limpa o motivo da baixa
      updateData['integranteP4'] = '';

      // eslint-disable-next-line no-dupe-else-if
    } else if (this.material.status === 'P4'){
      updateData['motivoBaixa'] = '';
      updateData['integranteP4'] = 'Entregue a: ' + this.material.integranteP4; // Limpa o motivo da baixa
    } else {
      // Garante que o motivo da baixa seja mantido ou atualizado conforme fornecido
      updateData['integranteP4'] = '';
      updateData['motivoBaixa'] = this.material.motivoBaixa;
    }

    this.firestore.collection('materiais').doc(this.materialId).update(updateData).then(() => {
      this.router.navigate(['/listar-materiais']); // Ajuste a rota conforme necessário
    }).catch(error => {
      console.error("Erro ao atualizar material:", error);
    });
  }
}
