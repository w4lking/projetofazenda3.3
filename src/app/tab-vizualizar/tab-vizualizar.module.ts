import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabVizualizarPageRoutingModule } from './tab-vizualizar-routing.module';

import { TabVizualizarPage } from './tab-vizualizar.page';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartSolicitacoesComponent } from '../components/chart-solicitacoes/chart-solicitacoes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabVizualizarPageRoutingModule,
    NgApexchartsModule,
  ],
  declarations: [TabVizualizarPage, ChartSolicitacoesComponent]
})
export class TabVizualizarPageModule {}
