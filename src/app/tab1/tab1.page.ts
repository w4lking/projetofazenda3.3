import { Component, inject, OnInit } from '@angular/core';
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


  itens : any = [];

  constructor(
    private router: Router,
    private provider:ApiService,
    private actRouter:ActivatedRoute,
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
      const loading = await this.loadingController.create({
        message: 'Carregando solicitações...',
      });
      await loading.present();
    
      this.provider.obterUsuariosDesautenticados().subscribe(
        async (data: any) => {
          if (data.ok) {
            this.itens = data.ok;
          } else {
            // this.mensagem('Nenhuma solicitação de usuário encontrada', 'warning');
          }
          await loading.dismiss();
        },
        async (error) => {
          await loading.dismiss();
          this.mensagem('Erro ao carregar solicitações de autenticação', 'danger');
        }
      );
    }

    async aceitarUsuario(usuario: any) {

      const loading = await this.loadingController.create({
        message: 'Carregando solicitações...',
      });
      await loading.present();

      console.log('Aceitar usuário:', usuario);
      this.provider.altenticarUsuario(usuario.idusuarios).subscribe(
       async (res: any) => {
          if (res.ok) {
            console.log('Usuário autenticado com sucesso:', usuario);
            this.mensagem('Usuário autenticado com sucesso!', 'success');
            await loading.dismiss();
            // Atualizar a lista de usuários ou chamar uma função que busca os usuários novamente
            this.atualizarListaUsuarios();
          } else {
            console.log('Falha ao autenticar usuário:', res.mensagem);
            this.mensagem('Falha ao autenticar usuário', 'danger');
          }
        },
        async (error) => {
          console.log('Erro ao autenticar usuário:', error);
          this.mensagem('Erro ao autenticar usuário', 'danger');
          await loading.dismiss();
        }
      );
    }
    
    // Função para atualizar a lista de usuários
    atualizarListaUsuarios() {
      this.provider.obterUsuariosDesautenticados().subscribe(
        (usuarios: any[]) => {
          this.itens = usuarios; // Atualizar a lista com os novos dados
        },
        (error: any) => {
          console.log('Erro ao buscar usuários:', error);
        }
      );
    }
    

    rejeitarUsuario(usuario: any) {
      console.log('Rejeitar usuário:', usuario);
      // Lógica para rejeitar o usuário
    }
    

  sair() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('perfil');
    sessionStorage.clear();
    console.log('Sessão encerrada ADMINISTRADOR');
  }
  

  async mensagem(mensagem:any, cor:string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

}
