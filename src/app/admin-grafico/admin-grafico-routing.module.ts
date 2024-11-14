import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGraficoPage } from './admin-grafico.page';

const routes: Routes = [
  {
    path: '',
    component: AdminGraficoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminGraficoPageRoutingModule {}
