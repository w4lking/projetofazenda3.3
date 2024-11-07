import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { people } from 'ionicons/icons';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {


  idUsuario = sessionStorage.getItem('id');
  perfil = sessionStorage.getItem('perfil');

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    this.idUsuario = sessionStorage.getItem('id');
    this.perfil = sessionStorage.getItem('perfil');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }

  async presentAlertConfirm(id: any, perfil: any) {
    const action = perfil === "FUNCIONARIO" ? 'bloquear' : 'excluir';
    const alert = await this.alertController.create({
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} conta`,
      message: `Tem certeza que deseja ${action} sua conta de ${perfil}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          handler: () => {
            this.excluirConta(id, perfil);
          }
        }
      ]
    });

    await alert.present();
  }


  excluirConta(id: any, perfil: any) {
    this.provider.excluirConta(id, perfil).then(async data => {
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Requisição feita com sucesso!',
        buttons: ['OK']
      });
      await alert.present();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  back() {
    if (this.perfil == "PROPRIETARIO") {
      this.router.navigate(['/tabs/tab3']);
    }
    else if (this.perfil == "FUNCIONARIO") {
      this.router.navigate(['/tabs/tab5']);
    }
    else if (this.perfil == "ADMINISTRADOR") {
      this.router.navigate(['/tabs/tab1']);
    }
  }

}
