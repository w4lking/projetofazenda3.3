import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-admin-grafico',
  templateUrl: './admin-grafico.page.html',
  styleUrls: ['./admin-grafico.page.scss'],
})
export class AdminGraficoPage implements OnInit {

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
