// import { Component } from '@angular/core';
// import { HistoricoService } from '../../services/historico.service';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
//
// @Component({
//   selector: 'app-historico-material',
//   standalone: true,
//   imports: [
//     DatePipe,
//     FormsModule,
//     CommonModule
//   ],
//   templateUrl: './historico-material.component.html',
//   styleUrl: './historico-material.component.scss'
// })
// export class HistoricoMaterialComponent {
//   descricaoMaterial: string = '';
//   historico: any[] = [];
//
//   constructor(private historicoService: HistoricoService) {}
//
//   buscarPorMaterial(): void {
//     this.historicoService.buscarPorDescricaoMaterial(this.descricaoMaterial).subscribe(historicos => {
//       this.historico = historicos;
//       // Se necessário, você pode adicionar uma verificação aqui
//       // para assegurar que historico seja uma array vazia se não houver dados
//     }, error => {
//       console.error("Ocorreu um erro durante a busca: ", error);
//       this.historico = []; // Garante que a variável seja resetada em caso de erro
//     });
//   }
// }
