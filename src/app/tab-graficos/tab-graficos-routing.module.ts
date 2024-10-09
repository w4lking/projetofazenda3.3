import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabGraficosPage } from './tab-graficos.page';

const routes: Routes = [
  {
    path: '',
    component: TabGraficosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabGraficosPageRoutingModule {}
