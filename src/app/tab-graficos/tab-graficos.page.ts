import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular'; // Adicione AlertController
@Component({
  selector: 'app-tab-graficos',
  templateUrl: './tab-graficos.page.html',
  styleUrls: ['./tab-graficos.page.scss'],
})
export class TabGraficosPage implements OnInit {
 danger: string = 'danger';

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController // Adicione esta linha
  ) { }

  ngOnInit() {
  }

  async mensagem(mensagem:any){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'EM BREVE',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }


}
