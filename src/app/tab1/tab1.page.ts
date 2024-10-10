import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, ViewWillEnter {

  itens:any[] = [];

  constructor(
    private router: Router,
    private provider: ApiService,
    private actRouter: ActivatedRoute,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.obterUsuariosDesautenticados();
  }

  ionViewWillEnter() {
    this.obterUsuariosDesautenticados();
  }
  
  async obterUsuariosDesautenticados() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.provider.obterUsuariosDesautenticados().then(async (data: any) => {
        await loading.dismiss();
        if (data.length > 0) {  // Aqui verificamos se existem usuários retornados
            this.itens = data; // Atribuímos os dados retornados diretamente
        } else {
            this.mensagem('Nenhuma solicitação de usuário encontrada', 'warning');
        }
    }).catch(async (error) => {
        await loading.dismiss();
        this.mensagem('Erro ao carregar solicitações de autenticação', 'danger');
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
        if (res.ok) {
          console.log('Usuário autenticado com sucesso:', usuario);
          this.mensagem('Usuário autenticado com sucesso!', 'success');
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

  atualizarListaUsuarios() {
    this.provider.obterUsuariosDesautenticados().then(
      (usuarios: any) => {
        this.itens = usuarios;  // Atualiza a lista de usuários
      }
    ).catch((error: any) => {
      console.log('Erro ao buscar usuários:', error);
      this.mensagem('Erro ao atualizar a lista de usuários', 'danger');
    });
  }

  rejeitarUsuario(usuario: any) {
    console.log('Rejeitar usuário:', usuario);
    // Lógica para rejeitar o usuário
    // Por exemplo, você pode chamar um método de API aqui para rejeitar
  }
  
  sair() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('perfil');
    sessionStorage.clear();
    console.log('Sessão encerrada ADMINISTRADOR');
  }

  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }
}
