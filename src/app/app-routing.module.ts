import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ServiceLoginComponent } from './service-login/service-login.component';
import { SubAdminLoginComponent } from './sub-admin-login/sub-admin-login.component';
import { ServiceAdminComponent } from './service-admin/service-admin.component';
import { BreakdownservicePdfComponent } from '../../src/app/service-admin/components/breakdownservice-pdf/breakdownservice-pdf.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login', },
{ path: '', pathMatch: 'full', redirectTo: 'service-login', },
{ path: 'login', component: LoginComponent, },
  { path: 'home', component: HomeComponent, },
  { path: 'service-login', component: ServiceLoginComponent, },
  { path: 'sub-admin-login', component: SubAdminLoginComponent, },
  { path: 'Breakdownservice-Pdf', component: BreakdownservicePdfComponent, },
  {
    path: 'service-admin', component: ServiceAdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import(`./service-admin/service.module`).then(m => m.ServiceModule)
      },
    ]
  },
  {
    path: 'admin', component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule)
      },
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
