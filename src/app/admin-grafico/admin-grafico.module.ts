import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminGraficoPageRoutingModule } from './admin-grafico-routing.module';

import { AdminGraficoPage } from './admin-grafico.page';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartUsuariosComponent } from '../components/chart-usuarios/chart-usuarios.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminGraficoPageRoutingModule,
    NgApexchartsModule,
  ],
  declarations: [AdminGraficoPage, ChartUsuariosComponent]
})
export class AdminGraficoPageModule {}
