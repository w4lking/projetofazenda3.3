import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-admin-grafico',
  templateUrl: './admin-grafico.page.html',
  styleUrls: ['./admin-grafico.page.scss'],
})
export class AdminGraficoPage implements OnInit {

  constructor(
    private readonly modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
