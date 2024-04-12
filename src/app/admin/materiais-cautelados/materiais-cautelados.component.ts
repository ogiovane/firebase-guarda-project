import { Component, OnDestroy, OnInit } from '@angular/core';
import { HistoricoCautelasService } from '../../services/historico-cautelas.service';
import { Router } from '@angular/router';
import { MateriaisService } from '../../services/materiais.service';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MensagemService } from '../../services/message.service';

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
  ],
  styleUrls: ['./materiais-cautelados.component.scss']
})
export class MateriaisCauteladosComponent implements OnInit, OnDestroy {
  materiais: any[] = [];
  materiaisBaixados: any[] = [];
  totaisMateriais: Record<string, TotaisMaterial> = {};
  mensagem: string = '';
  private subscription: Subscription;


  constructor(private historicoService: HistoricoCautelasService, private router: Router, private materiaisService: MateriaisService, private mensagemService: MensagemService) {
    // this.initializeChartData();
  }

  ngOnInit(): void {
    this.historicoService.buscarMateriaisCautelados().subscribe(materiais => {
      this.materiais = materiais;

      this.subscription = this.mensagemService.mensagemAtual.subscribe(mensagem => {
        this.mensagem = mensagem;
      });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  devolverMaterial(material: any): void {
    this.router.navigate(['/admin/devolver-material'], { state: { material } });
  }

  receberMaterial(material: any) {
    this.router.navigate(['/admin/receber-material'], { state: { material } });
  }

  editarMaterial(material: any): void {
    // Supondo que a rota para editar material seja '/editar-material/{id}'
    this.router.navigate(['/admin/editar-material', material.id]);
  }
}
