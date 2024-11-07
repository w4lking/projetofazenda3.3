import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular'; // Adicione AlertControllerimport { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-vizualizar',
  templateUrl: './tab-vizualizar.page.html',
  styleUrls: ['./tab-vizualizar.page.scss'],
})
export class TabVizualizarPage implements OnInit {

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
