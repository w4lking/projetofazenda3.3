import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, ViewWillEnter  {
  usuarios: any[] = [];

  constructor(
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController 
  ) {}

  ngOnInit() {
    this.obterUsuarios();
  }

  ionViewWillEnter() {
    this.obterUsuarios();
  }

  async exibirAlerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async obterUsuarios() {
    const loading = await this.loadingController.create({
      message: 'Carregando usuários...',
    });
    await loading.present();

    this.provider.obterUsuarios().then(async (data: any) => {
      await loading.dismiss();
      if (data.length > 0) {
        this.usuarios = data;
      } else {
        await this.exibirAlerta('Nenhum usuário encontrado', 'danger');
      }
    }).catch(async (error) => {
      await loading.dismiss();
      await this.exibirAlerta('Erro ao carregar usuários', 'danger');
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
          console.log('Status de bloqueio alterado com sucesso no banco de dados:', usuario);
          await this.exibirAlerta('Bloqueio atualizado com sucesso!', 'success');
        } else {
          console.log('Falha ao alterar o status de bloqueio no banco de dados:', res.mensagem);
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
    console.log('Excluir usuário:', id);
    this.provider.deletarUsuario(id).then(
      async (res: any) => {
        if (res.status === 'success' || res.ok === true) {
          console.log('Usuário excluído com sucesso:', id);
          await this.exibirAlerta('Usuário excluído com sucesso!', 'success');
          this.obterUsuarios();
        } else {
          console.log('Falha ao excluir o usuário:', res.mensagem);
          await this.exibirAlerta('Erro ao excluir o usuário. Tente novamente!', 'danger');
        }
      }
    ).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }
}
