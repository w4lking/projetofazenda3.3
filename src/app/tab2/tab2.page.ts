import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController, ViewWillEnter  } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, ViewWillEnter  {
  usuarios: any[] = [];
  funcionarios: any[] = [];
  tipo = "usuarios";

  constructor(
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly alertController: AlertController 
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

  async exibirAlerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async carregarDados() {
    const loading = await this.loadingController.create({
      message: 'Carregando Dados...',
    });
    await loading.present();
    this.obterUsuarios();
    await loading.dismiss();
  }

  async obterUsuarios() {

    this.provider.obterUsuarios().then(async (data: any) => {
      if (data.length > 0) {
        this.usuarios = data;
      } else {
        //
      }
    }).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }


  editarUsuario(usuario: any) {
    console.log('Editar usuário:', usuario);
  }

  async alterarBloqueio(usuario: any) {
    if (usuario.idusuarios === 1) {
      await this.exibirAlerta('O administrador não pode ser bloqueado!', 'danger');
      return;
    }
    usuario.bloqueado = usuario.bloqueado == 1 ? 0 : 1;

    this.provider.alterarBloqueio(usuario.idusuarios, usuario.bloqueado).then(
      async (res: any) => {
        if (res.status === 'success' || res.ok === true) {
          await this.exibirAlerta('Bloqueio atualizado com sucesso!', 'success');
        } else {
          await this.exibirAlerta('Erro ao atualizar o bloqueio. Tente novamente!', 'danger');
        }
      }
    ).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }

  async confirmarExclusaoUsuario(usuario: any) {
    if (usuario.idusuarios === 1) {
      await this.exibirAlerta('O administrador não pode ser excluído!', 'danger');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir este usuário?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Exclusão cancelada');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluirUsuario(usuario.idusuarios);
          }
        }
      ]
    });

    await alert.present();
  }

  async excluirUsuario(id: any) {
    this.provider.deletarUsuario(id).then(
      async (res: any) => {
        if (res.status === 'success' || res.ok === true) {
          await this.exibirAlerta('Usuário excluído com sucesso!', 'success');
          this.obterUsuarios();
        } else {
          await this.exibirAlerta('Erro ao excluir o usuário. Tente novamente!', 'danger');
        }
      }
    ).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }
}
