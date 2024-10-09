import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { IonicModule } from '@ionic/angular';

import { TabGraficosPageRoutingModule } from './tab-graficos-routing.module';

import { TabGraficosPage } from './tab-graficos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    TabGraficosPageRoutingModule
  ],
  declarations: [TabGraficosPage]
})
export class TabGraficosPageModule {}
