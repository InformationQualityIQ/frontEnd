import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LogueoComponent } from './logueo/logueo.component';
import { CertificadosComponent } from './certificados/certificados.component';



const routes: Routes = [
  //{path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'', component: LogueoComponent},
  {path:'login', component: LogueoComponent},
  {path: 'dashboard', component:DashboardComponent,
    children: [
      {path: 'cliente', 
        loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule)
      },
      
      {
        path: 'certificadoCliente', component: CertificadosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
