// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { LoginComponent} from './project/authentication/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'authentication/login',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component')
      },
      {
        path: 'cadastro-militar',
        loadComponent: () => import('./project/cadastro-militares/cadastro-militares.component').then(m => m.CadastroMilitaresComponent)
      },
      {
        path: 'cadastro-material',
        loadComponent: () => import('./project/cadastro-material/cadastro-material.component').then(m => m.CadastroMaterialComponent)
      },
      {
        path: 'cautelar-material',
        loadComponent: () => import('./project/cautelar-material/cautelar-material.component').then(m => m.CautelarMaterialComponent)
      },
      {
        path: 'cautelar-material/:tipo/:descricao',
        loadComponent: () => import('./project/cautelar-material/cautelar-material.component').then(m => m.CautelarMaterialComponent)
      },
      {
        path: 'listar-materiais',
        loadComponent: () => import('./project/lista-materiais/lista-materiais.component').then(m => m.ListaMateriaisComponent)
      },
      {
        path: 'devolver-material',
        loadComponent: () => import('./project/devolucao-material/devolucao-material.component').then(m => m.DevolucaoMaterialComponent)
      },
      {
        path: 'card',
        loadComponent: () => import('./demo/component/card/card.component')
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
    // redirectTo: 'authentication/login',
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
export class AppRoutingModule {}
