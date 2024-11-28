import { Component} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-admin-grafico',
  templateUrl: './admin-grafico.page.html',
  styleUrls: ['./admin-grafico.page.scss'],
})
export class AdminGraficoPage {
  private readonly modalCtrl: ModalController;

  constructor(modalCtrl: ModalController) {
    this.modalCtrl = modalCtrl;
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
