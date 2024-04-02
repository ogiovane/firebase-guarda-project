import { Component, OnInit } from '@angular/core';
import { HistoricoService } from '../../services/historico.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FilterMaterialPipe } from '../../pipes/filter-material.pipe';
import { FormsModule } from '@angular/forms';

export interface Historico {
  dataHoraCautela: Date;
  tipo: string;
  descricaoMaterial: string;
  nome: string;
  dataHoraDevolucao?: Date; // Tornar opcional, se necessário
  responsavelDevolucao?: string;
}

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
  searchText: string;

  constructor(private historicoService: HistoricoService) {
  }

  ngOnInit(): void {
    this.historicoService.getHistorico().subscribe(data => {
      this.historico = data.map(item => ({
        ...item,
        dataHoraCautela: item.dataHoraCautela.toDate ? item.dataHoraCautela.toDate() : item.dataHoraCautela,
        dataHoraDevolucao: item.dataHoraDevolucao?.toDate ? item.dataHoraDevolucao.toDate() : item.dataHoraDevolucao
      }));
    });
  }
}
