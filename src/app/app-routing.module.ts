// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { AuthGuard } from './auth.guard';

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
        loadComponent: () => import('./project/lista-materiais/lista-materiais.component').then(m => m.ListaMateriaisComponent)
      },
      {
        path: 'cadastro-militar',
        loadComponent: () => import('./project/cadastro-militares/cadastro-militares.component').then(m => m.CadastroMilitaresComponent)
      },
      {
        path: 'cadastro-material',
        loadComponent: () => import('./project/cadastro-material/cadastro-material.component').then(m => m.CadastroMaterialComponent)
      },
      // {
      //   path: 'cautelar-material',
      //   loadComponent: () => import('./project/cautelar-materiais/cautelar-materiais.component').then(m => m.CautelarMateriaisComponent)
      // },
      {
        path: 'cautelar-material',
        loadComponent: () => import('./project/cautelar-material/cautelar-material.component').then(m => m.CautelarMaterialComponent)
      },

      {
        path: 'listar-materiais',
        loadComponent: () => import('./project/lista-materiais/lista-materiais.component').then(m => m.ListaMateriaisComponent)
      },
      {
        path: 'devolver-material',
        loadComponent: () => import('./project/devolver-material/devolver-material.component').then(m => m.DevolverMaterialComponent)
      },
      {
        path: 'relatorio',
        loadComponent: () => import('./project/relatorio/relatorio.component').then(m => m.RelatorioComponent)
      },
      {
        path: 'materiais-cautelados',
        loadComponent: () => import('./project/materiais-cautelados/materiais-cautelados.component').then(m => m.MateriaisCauteladosComponent)
      },
      {
        path: 'breadcrumb',
        loadComponent: () => import('./demo/component/breadcrumb/breadcrumb.component')
      },
      {
        path: 'spinner',
        loadComponent: () => import('./demo/component/spinner/spinner.component')
      },
      {
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
        loadComponent: () => import('./project/authentication/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
