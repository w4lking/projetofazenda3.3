import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, ViewWillEnter {

  usuarios: any[] = [];
  funcionarios: any[] = [];
  tipo: any = "usuarios";
  prot: any[] = [];

  constructor(
    private router: Router,
    private provider: ApiService,
    private actRouter: ActivatedRoute,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.atualizarDados();
  }

  ionViewWillEnter() {
    this.atualizarDados();
  }

  // getNome(idUsuario: number | null): string {
  //   const user = this.usuarios.find((u: { idusuarios: number }) => Number(u.idusuarios) === Number(idUsuario));
  //   return user ? user.nome : 'user não encontrada';
  // }


  async carregarDados() {
    const loading = await this.loadingController.create({
      message: 'Carregando Dados...',
    });
    await loading.present();
    this.obterUsuariosDesautenticados();
    this.obterFuncionariosDesautenticados();
    await loading.dismiss();
  }


  atualizarDados() {
    if (this.tipo == "usuarios") {
      this.carregarDados();
    }
    if (this.tipo == "funcionarios") {
      this.carregarDados();
    }
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


  async obterFuncionariosDesautenticados() {

    this.provider.obterFuncionariosDesautenticados().then(async (data: any) => {
      if (data.length > 0) {
        this.funcionarios = data;
      } else {
        // this.Alerta('Nenhuma solicitação de autenticação encontrada', 'warning');
      }
    }).catch(async (error) => {
      // this.Alerta('Erro ao carregar solicitações de autenticação', 'danger');
    });
  }



  async aceitarUsuario(usuario: any) {
    const loading = await this.loadingController.create({
      message: 'Autenticando usuário...',
    });
    await loading.present();

    console.log('Aceitar usuário:', usuario);
    this.provider.autenticarUsuario(usuario.idusuarios).then(
      async (res: any) => {
        await loading.dismiss();
        console.log('Resposta da API:', res);  // Verificar a resposta completa aqui
        if (res.status == 'success') {
          console.log('Usuário autenticado com sucesso:', usuario);
          this.mensagem('Usuário autenticado com sucesso!', 'success');
          this.atualizarListaUsuarios();  // Atualizar a lista de usuários após sucesso
        } else {
          console.log('Falha ao autenticar usuário:', res);
          this.mensagem('Falha ao autenticar usuário', 'danger');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      console.log('Erro ao autenticar usuário:', error);
      this.mensagem('Erro ao autenticar usuário', 'danger');
    });
  }

  atualizarListaUsuarios() {
    this.provider.obterUsuariosDesautenticados().then(
      (usuarios: any) => {
        this.usuarios = usuarios;  // Atualiza a lista de usuários
      }
    ).catch((error: any) => {
      console.log('Erro ao buscar usuários:', error);
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
            this.aceitarUsuario(usuario); // Chama a função de exclusão se o usuário confirmar
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
            this.rejeitarUsuario(usuario); // Chama a função de exclusão se o usuário confirmar
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
    console.log('Rejeitar usuário:', usuario);
    this.provider.deletarUsuario(usuario.idusuarios).then(
      async (res: any) => {
        await loading.dismiss();
        console.log('Resposta da API:', res);  // Verificar a resposta completa aqui
        if (res.status == 'success' || res.ok === true) {
          console.log('Usuário rejeitado com sucesso:', usuario);
          this.mensagem('Usuário rejeitado com sucesso!', 'success');
          this.atualizarListaUsuarios();  // Atualizar a lista de usuários após sucesso
        } else {
          console.log('Falha ao autenticar usuário:', res.mensagem);
          this.mensagem('Falha ao autenticar usuário', 'danger');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      console.log('Erro ao autenticar usuário:', error);
      this.mensagem('Erro ao autenticar usuário', 'danger');
    });
  }


  sair() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('perfil');
    sessionStorage.clear();
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
}
