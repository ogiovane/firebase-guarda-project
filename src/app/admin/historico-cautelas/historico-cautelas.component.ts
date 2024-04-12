import { Component, OnInit } from '@angular/core';
import { HistoricoService } from '../../services/historico.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FilterMaterialPipe } from '../../pipes/filter-material.pipe';
import { FormsModule } from '@angular/forms';
import { Historico } from '../../interfaces/historico';


@Component({
  selector: 'app-historico-cautelas',
  templateUrl: './historico-cautelas.component.html',
  imports: [
    DatePipe,
    CommonModule,
    FilterMaterialPipe,
    FormsModule
  ],
  standalone: true
})

export class HistoricoCautelasComponent implements OnInit {
  historico: Historico[] = [];
  // cadastros: Cadastro[] = [];
  paginatedHistorico: Historico[] = [];
  searchText: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;

  constructor(private historicoService: HistoricoService) {
  }

  ngOnInit(): void {
    this.loadHistorico();


  }

  loadHistorico(): void {
    // this.cadastrosService.getCadastros().subscribe(data => {
    //   this.cadastros = data;
    //   this.applyFilterAndPagination();
    // });
    this.historicoService.getHistorico().subscribe(data => {
      this.historico = data.map(item => ({
        ...item,
        dataHoraCautela: item.dataHoraCautela.toDate ? item.dataHoraCautela.toDate() : item.dataHoraCautela,
        dataHoraDevolucao: item.dataHoraDevolucao?.toDate ? item.dataHoraDevolucao.toDate() : item.dataHoraDevolucao
      }));
      this.applyFilterAndPagination();
    });
  }

  applyFilterAndPagination(): void {
    // Filtra os cadastros se houver texto de busca; caso contrário, usa todos os cadastros.
    let filtered = this.searchText ? this.historico.filter(c => c.nome.toLowerCase().includes(this.searchText.toLowerCase())) : this.historico;
    this.paginatedHistorico = filtered.slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);
  }

  changePage(newPage: number, event?: MouseEvent): void {
    event?.preventDefault();
    if (newPage < 0 || newPage >= this.totalPages) return;
    this.currentPage = newPage;
    this.applyFilterAndPagination();
  }

  get totalPages(): number {
    let filteredLength = this.searchText ? this.historico.filter(c => c.descricaoMaterial.toLowerCase().includes(this.searchText.toLowerCase())).length : this.historico.length;
    return Math.ceil(filteredLength / this.itemsPerPage);
  }


}
