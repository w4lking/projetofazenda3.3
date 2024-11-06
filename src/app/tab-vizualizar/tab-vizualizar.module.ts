import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabVizualizarPageRoutingModule } from './tab-vizualizar-routing.module';

import { TabVizualizarPage } from './tab-vizualizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabVizualizarPageRoutingModule
  ],
  declarations: [TabVizualizarPage]
})
export class TabVizualizarPageModule {}
