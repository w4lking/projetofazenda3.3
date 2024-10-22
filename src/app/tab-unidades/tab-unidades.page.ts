import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab-unidades',
  templateUrl: './tab-unidades.page.html',
  styleUrls: ['./tab-unidades.page.scss'],
})
export class TabUnidadesPage implements OnInit {

  constructor(
    private provider: ApiService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }


}
