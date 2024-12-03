import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  idUsuario = sessionStorage.getItem('id');
  perfil = sessionStorage.getItem('perfil');

  constructor(
    private readonly router: Router,
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly alertController: AlertController
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
      message: `Para confirmar, digite sua senha para ${action} sua conta de ${perfil}.`,
      inputs: [
        {
          name: 'senha',
          type: 'password',
          placeholder: 'Senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          handler: async (alertData) => {
            if (!alertData.senha) {
              this.presentToast('Por favor, insira sua senha.');
              return false;
            }
            const senhaValida = await this.verifyPassword(alertData.senha);
            if (senhaValida) {
              this.excluirConta(id, perfil);
              return true;
            } else {
              this.presentToast('Senha incorreta.');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async verifyPassword(senha: string): Promise<boolean> {
    try {
      const response = await this.provider.verifyPassword(this.idUsuario, senha, this.perfil);
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar a senha:', error);
      return false;
    }
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

  onKeydownEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.presentAlertConfirm(this.idUsuario, this.perfil);
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
