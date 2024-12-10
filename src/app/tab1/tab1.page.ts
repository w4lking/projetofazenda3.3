import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController, MenuController, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, ViewWillEnter {

  usuarios: any[] = [];
  funcionarios: any[] = [];
  tipo: any = "usuarios";

  constructor(
    private readonly router: Router,
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private readonly menu: MenuController,
  ) { }

  ngOnInit() {
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  goConfiguration() {
    this.router.navigate(['/configuracoes']);
  }


  async carregarDados() {
    const loading = await this.loadingController.create({
      message: 'Carregando Dados...',
    });
    await loading.present();
    this.obterUsuariosDesautenticados();
    await loading.dismiss();
  }

  async obterUsuariosDesautenticados() {
    this.provider.obterUsuariosDesautenticados().then(async (data: any) => {
      if (data.length > 0) {
        this.usuarios = data;
      } else {
      }
    }).catch(async (error) => {
    });
  }


  async aceitarUsuario(usuario: any) {
    const loading = await this.loadingController.create({
      message: 'Autenticando usuário...',
    });
    await loading.present();
    this.provider.autenticarUsuario(usuario.idusuarios).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status == 'success') {
          this.Alerta('Usuário autenticado com sucesso!', 'success');
          this.atualizarListaUsuarios(); 
        } else {
          this.Alerta('Falha ao autenticar usuário', 'danger');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      this.mensagem('Erro ao autenticar usuário', 'danger');
    });
  }


  atualizarListaUsuarios() {
    this.provider.obterUsuariosDesautenticados().then(
      (usuarios: any) => {
        this.usuarios = usuarios;
      }
    ).catch((error: any) => {
      this.mensagem('Erro ao atualizar a lista de usuários', 'danger');
    });
  }


  async confirmarUsuario(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Confirmação de Usuário',
      message: 'Tem certeza que deseja aceitar este usuário?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('confirmação cancelada');
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            this.aceitarUsuario(usuario);
          }
        }
      ]
    });

    await alert.present();
  }


  async confirmarExclusaoUsuario(usuario: any) {

    const alert = await this.alertController.create({
      header: 'Confirmação de rejeição',
      message: 'Tem certeza que deseja rejeitar este usuário?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('rejeição cancelada');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.rejeitarUsuario(usuario);
          }
        }
      ]
    });

    await alert.present();
  }

  async rejeitarUsuario(usuario: any) {
    const loading = await this.loadingController.create({
      message: 'Rejeitando usuário...',
    });
    await loading.present();
    this.provider.deletarUsuario(usuario.idusuarios).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status == 'success' || res.ok === true) {
          this.Alerta('Usuário rejeitado com sucesso!', 'success');
          this.atualizarListaUsuarios(); 
        } else {
          this.Alerta('Falha ao autenticar usuário', 'danger');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      this.Alerta('Erro ao autenticar usuário', 'danger');
    });
  }


  sair() {
    sessionStorage.setItem('id', '');
    sessionStorage.clear();
    this.router.navigate(['/login']);
    console.log('Sessão encerrada ADMINISTRADOR');
  }

  goUnidades() {
    this.router.navigate(['/tab-unidades']);
  }

  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  async Alerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'warning' ? 'Sucesso' : 'Erro',
      message: mensagem,
    });
    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 1200);
  }


  fecharMenu() {
    this.menu.close();
  }
}
