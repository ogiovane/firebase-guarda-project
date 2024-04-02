// src/app/materiais-cautelados/materiais-cautelados.component.ts
import { Component, OnInit } from '@angular/core';
import { HistoricoCautelasService } from '../../services/historico-cautelas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaisService } from '../../services/materiais.service';

interface TotaisMaterial {
  disponiveis: number;
  cautelados: number;
  total: number;
}
@Component({
  selector: 'app-materiais-cautelados',
  templateUrl: './materiais-cautelados.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class MateriaisCauteladosComponent implements OnInit {
  materiais: any[] = [];
  materiaisBaixados: any[] = [];
  totaisMateriais: Record<string, TotaisMaterial> = {};



  constructor(private historicoService: HistoricoCautelasService, private router: Router,private materiaisService: MateriaisService) {}

  ngOnInit(): void {
    this.historicoService.buscarMateriaisCautelados().subscribe(materiais => {
      this.materiais = materiais;
    });

    this.historicoService.buscarMateriaisBaixados().subscribe(materiaisBaixados => {
      this.materiaisBaixados = materiaisBaixados;
    });

    this.materiaisService.buscarTotaisMateriais().subscribe(totais => {
      this.totaisMateriais = totais;
    });
  }

  devolverMaterial(material: any): void {
    this.router.navigate(['/devolver-material'], { state: { material } });
  }

  receberMaterial(material: any) {
    this.router.navigate(['/receber-material'], { state: { material } });
  }
}
