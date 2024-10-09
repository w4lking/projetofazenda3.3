import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabFazendasPageRoutingModule } from './tab-fazendas-routing.module';

import { TabFazendasPage } from './tab-fazendas.page';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    MaskitoDirective,
    TabFazendasPageRoutingModule
  ],
  declarations: [TabFazendasPage]
})
export class TabFazendasPageModule {}
