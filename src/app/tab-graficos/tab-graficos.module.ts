import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { IonicModule } from '@ionic/angular';

import { TabGraficosPageRoutingModule } from './tab-graficos-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TabGraficosPage } from './tab-graficos.page';
import { ChartRelatorioComponent } from '../components/chart-relatorio/chart-relatorio.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    TabGraficosPageRoutingModule,
    NgApexchartsModule,
  ],
  declarations: [TabGraficosPage, ChartRelatorioComponent]
})
export class TabGraficosPageModule {}
