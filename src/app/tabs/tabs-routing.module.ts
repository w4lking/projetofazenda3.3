import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { RedirectGuardGuard } from '../guards/redirect-guard.guard';
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
        canActivate: [RedirectGuardGuard], // Aplique o guard aqui
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
        canActivate: [RedirectGuardGuard], // Aplique o guard aqui
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
        canActivate: [RedirectGuardGuard], // Aplique o guard aqui
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule),
        canActivate: [RedirectGuardGuard], // Aplique o guard aqui
      },
      {
        path: 'tabGraficos',
        loadChildren: () => import('../tab-graficos/tab-graficos.module').then( m => m.TabGraficosPageModule),
        canActivate: [RedirectGuardGuard], // Aplique o guard aqui
      },
      {
        path: 'tabFazendas',
        loadChildren: () => import('../tab-fazendas/tab-fazendas.module').then( m => m.TabFazendasPageModule),
        canActivate: [RedirectGuardGuard], // Aplique o guard aqui
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
