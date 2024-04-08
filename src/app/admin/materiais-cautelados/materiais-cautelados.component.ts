import { Component, OnInit } from '@angular/core';
import { HistoricoCautelasService } from '../../services/historico-cautelas.service';
import { Router } from '@angular/router';
import { MateriaisService } from '../../services/materiais.service';
import { ChartConfiguration, ChartData, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

interface TotaisMaterial {
  disponiveis: number;
  cautelados: number;
  baixados: number;
  total: number;
}

@Component({
  selector: 'app-materiais-cautelados',
  templateUrl: './materiais-cautelados.component.html',
  standalone: true,
  imports: [
    KeyValuePipe,
    CommonModule,
    BaseChartDirective
  ],
  styleUrls: ['./materiais-cautelados.component.scss']
})
export class MateriaisCauteladosComponent implements OnInit {
  materiais: any[] = [];
  materiaisBaixados: any[] = [];
  totaisMateriais: Record<string, TotaisMaterial> = {};


  constructor(private historicoService: HistoricoCautelasService, private router: Router, private materiaisService: MateriaisService) {
    // this.initializeChartData();
  }

  ngOnInit(): void {
    this.historicoService.buscarMateriaisCautelados().subscribe(materiais => {
      this.materiais = materiais;
      // Possivelmente, atualize o gráfico aqui também, se afetar os dados
    });

    this.historicoService.buscarMateriaisBaixados().subscribe(materiaisBaixados => {
      this.materiaisBaixados = materiaisBaixados;
      // Possivelmente, atualize o gráfico aqui também, se afetar os dados
    });

    this.materiaisService.buscarTotaisMateriais().subscribe(totais => {
      this.totaisMateriais = totais;
      // this.initializeChartData(); // Chame aqui após ter os dados
    });
  }

  devolverMaterial(material: any): void {
    this.router.navigate(['/devolver-material'], { state: { material } });
  }

  receberMaterial(material: any) {
    this.router.navigate(['/receber-material'], { state: { material } });
  }
}
