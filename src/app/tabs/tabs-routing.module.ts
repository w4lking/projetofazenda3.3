import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { RedirectGuardGuard } from '../guards/redirect-guard.guard';
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    // canActivate: [RedirectGuardGuard], // Aplica o guard para esta rota
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule),
      },
      {
        path: 'tabGraficos',
        loadChildren: () => import('../tab-graficos/tab-graficos.module').then( m => m.TabGraficosPageModule),
      },
      {
        path: 'tabFazendas',
        loadChildren: () => import('../tab-fazendas/tab-fazendas.module').then( m => m.TabFazendasPageModule),
      },
      {
        path:'tabRegistros',
        loadChildren: () => import('../tab-registro/tab-registro.module').then( m => m.TabRegistroPageModule),
      },
      {
        path: 'tab5',
        loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
