import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabUnidadesPage } from './tab-unidades.page';

const routes: Routes = [
  {
    path: '',
    component: TabUnidadesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabUnidadesPageRoutingModule {}
