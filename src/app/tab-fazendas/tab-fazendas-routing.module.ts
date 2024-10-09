import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabFazendasPage } from './tab-fazendas.page';

const routes: Routes = [
  {
    path: '',
    component: TabFazendasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabFazendasPageRoutingModule {}
