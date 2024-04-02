import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-baixar-material',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './baixar-material.component.html',
  styleUrl: './baixar-material.component.scss'
})
export class BaixarMaterialComponent implements OnInit {
  motivo: string = '';
  materialId: string;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.materialId = this.route.snapshot.params['id'];
  }

  baixarMaterial(): void {
    this.firestore.collection('materiais').doc(this.materialId).update({
      status: 'Baixado',
      motivoBaixa: this.motivo
    }).then(() => {
      this.router.navigate(['/']); // Ajuste conforme necessário
    }).catch(error => {
      console.error("Erro ao baixar material:", error);
    });
  }
}
