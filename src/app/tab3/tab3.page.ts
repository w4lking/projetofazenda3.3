import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuarios: any = {};
  nome : any = "";
  email : any = "";
  telefone : any = "";

  constructor(
    private router: Router,
    private provider:ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.obterUsuario();
  }

  // ionViewWillEnter() {
  //   this.obterUsuario();
  // }
  

  async obterUsuario() {
    const loading = await this.loadingController.create({
      message: 'Carregando dados ...',
    });
    await loading.present();
    const email = sessionStorage.getItem('email');
    const id = sessionStorage.getItem('id');
  
    if (id) {
      this.provider.obterUsuario(id).then(
        async (data: any) => {
          // Verifica se o status da resposta é 'success'
          if (data.status === 'success') {
            this.usuarios = data.usuario; // Acessa os dados do usuário corretamente
            this.nome = this.usuarios.nome;
            this.email = this.usuarios.email;
            this.telefone = this.usuarios.telefone;
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
  

  fecharMenu() {
    this.menu.close();
  }

  async mensagem(mensagem:any, cor:string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  sair() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('perfil');
    sessionStorage.clear();
    console.log('Sessão encerrada PROPRIETÁRIO');
  }

}
