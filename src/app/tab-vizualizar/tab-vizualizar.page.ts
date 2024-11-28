import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab-vizualizar',
  templateUrl: './tab-vizualizar.page.html',
  styleUrls: ['./tab-vizualizar.page.scss'],
})
export class TabVizualizarPage {

  constructor(
    private readonly modalCtrl: ModalController,
  ) { }


  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
