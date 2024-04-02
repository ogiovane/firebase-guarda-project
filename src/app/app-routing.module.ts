// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';
import { BaixarMaterialComponent } from './admin/baixar-material/baixar-material.component';
import { EditarMaterialComponent } from './admin/editar-material/editar-material.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./admin/materiais-cautelados/materiais-cautelados.component').then(m => m.MateriaisCauteladosComponent)
      },
      {
        path: 'cadastro-militar',
        loadComponent: () => import('./admin/cadastro-militares/cadastro-militares.component').then(m => m.CadastroMilitaresComponent)
      },
      {
        path: 'editar-cadastro/:id',
        loadComponent: () => import('./admin/editar-cadastro/editar-cadastro.component').then(m => m.CadastrosEditComponent)
      },
      {
        path: 'lista-cadastros',
        loadComponent: () => import('./admin/lista-cadastros/lista-cadastros.component').then(m => m.CadastrosListComponent)
      },
      {
        path: 'cadastro-material',
        loadComponent: () => import('./admin/cadastro-material/cadastro-material.component').then(m => m.CadastroMaterialComponent)
      },
      // {
      //   path: 'cautelar-material',
      //   loadComponent: () => import('./project/cautelar-materiais/cautelar-materiais.component').then(m => m.CautelarMateriaisComponent)
      // },
      {
        path: 'cautelar-material',
        loadComponent: () => import('./admin/cautelar-material/cautelar-material.component').then(m => m.CautelarMaterialComponent)
      },
      {
        path: 'receber-material',
        loadComponent: () => import('./admin/receber-material/receber-material.component').then(m => m.ReceberMaterialComponent)
      },

      {
        path: 'listar-materiais',
        loadComponent: () => import('./admin/lista-materiais/lista-materiais.component').then(m => m.ListaMateriaisComponent)
      },
      {
        path: 'devolver-material',
        loadComponent: () => import('./admin/devolver-material/devolver-material.component').then(m => m.DevolverMaterialComponent)
      },
      {
        path: 'relatorio',
        loadComponent: () => import('./admin/relatorio/relatorio.component').then(m => m.RelatorioComponent)
      },
      {
        path: 'historico-cautelas',
        loadComponent: () => import('./admin/historico-cautelas/historico-cautelas.component').then(m => m.HistoricoCautelasComponent)
      },
      {
        path: 'materiais-cautelados',
        loadComponent: () => import('./admin/materiais-cautelados/materiais-cautelados.component').then(m => m.MateriaisCauteladosComponent)
      },
      {
        path: 'upload-csv',
        loadComponent: () => import('./admin/upload-csv/upload-csv.component').then(m => m.UploadCsvComponent)
      },
      {
        path: 'editar-material/:id',
        loadComponent: () => import('./admin/editar-material/editar-material.component').then(m => m.EditarMaterialComponent)
      },
      {
        path: 'baixar-material/:id',
        loadComponent: () => import('./admin/baixar-material/baixar-material.component').then(m => m.BaixarMaterialComponent)
      },      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then(m => m.SamplePageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./public/authentication/login/login.component').then(m => m.LoginComponent),
        canActivate: [GuestGuard],
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
