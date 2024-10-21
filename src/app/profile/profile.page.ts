import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usuario: any = {};

  constructor(
    private router: Router,
    private provider:ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.obterUsuario();
  }

  back() {
    this.router.navigate(['/tabs/tab3']);
  }

  async mensagem(mensagem:any, cor:string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
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


  async obterUsuario() {
    const loading = await this.loadingController.create({
      message: 'Carregando dados ...',
    });
    await loading.present();
    const id = sessionStorage.getItem('id');
  
    if (id) {
      this.provider.obterUsuario(id).then(
        async (data: any) => {
          // Verifica se o status da resposta é 'success'
          if (data.status === 'success') {
            this.usuario = data.usuario; // Acessa os dados do usuário corretamente
          } else {
            this.mensagem('Nenhum usuário encontrado', 'warning');
          }
          await loading.dismiss();
        }).catch(async (error) => {
          await loading.dismiss();
          this.mensagem('Erro ao carregar autenticação', 'danger');
        });
    }
  }

}
