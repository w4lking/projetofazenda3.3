import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabVizualizarPage } from './tab-vizualizar.page';

const routes: Routes = [
  {
    path: '',
    component: TabVizualizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabVizualizarPageRoutingModule {}
