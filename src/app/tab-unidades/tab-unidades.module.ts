import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabUnidadesPageRoutingModule } from './tab-unidades-routing.module';

import { TabUnidadesPage } from './tab-unidades.page';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabUnidadesPageRoutingModule,
    MaskitoDirective
  ],
  declarations: [TabUnidadesPage]
})
export class TabUnidadesPageModule {}
