import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminGraficoPageRoutingModule } from './admin-grafico-routing.module';

import { AdminGraficoPage } from './admin-grafico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminGraficoPageRoutingModule
  ],
  declarations: [AdminGraficoPage]
})
export class AdminGraficoPageModule {}
