import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabRegistroPage } from './tab-registro.page';

const routes: Routes = [
  {
    path: '',
    component: TabRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabRegistroPageRoutingModule {}
