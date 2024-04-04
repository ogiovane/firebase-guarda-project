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

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: ['Disponíveis', 'Cautelados', 'Baixados'], // Labels para cada segmento
    datasets: [{
      data: [], // Dados serão inseridos aqui
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
      borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1
    }]
  };

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

  // initializeChartData() {
  //   // Supondo que 'Cartões' é a categoria que queremos exibir
  //   if (this.totaisMateriais['Cartão']) {
  //     const dadosCartoes = this.totaisMateriais['Cartão'];
  //
  //     this.pieChartData.labels = ['Disponíveis', 'Cautelados', 'Baixados'];
  //     this.pieChartData.datasets[0].data = [
  //       dadosCartoes.disponiveis,
  //       dadosCartoes.cautelados,
  //       dadosCartoes.baixados,
  //       dadosCartoes.total,
  //     ];
  //   }
  //
  //   // Atualização necessária para refletir mudanças no gráfico
  //   this.pieChartData = {
  //     ...this.pieChartData,
  //     labels: this.pieChartData.labels,
  //     datasets: this.pieChartData.datasets
  //   };
  // }


  devolverMaterial(material: any): void {
    this.router.navigate(['/devolver-material'], { state: { material } });
  }

  receberMaterial(material: any) {
    this.router.navigate(['/receber-material'], { state: { material } });
  }
}
