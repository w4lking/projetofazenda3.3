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
export class Tab3Page implements OnInit, ViewWillEnter {

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

  ionViewWillEnter() {
    this.obterUsuario();
  }
  
  async obterUsuario() {
    const loading = await this.loadingController.create({
      message: 'Carregando usuario...',
    });
    await loading.present();
    const email = sessionStorage.getItem('email');

    if (email) {
      this.provider.obterUsuarioWithEmail(email).subscribe(
      async (data: any) => {
        if (data.ok) {
          this.usuarios = data.usuarios[0]; // Supondo que o array tenha apenas um usuário
          this.nome = this.usuarios.nome;
        } else {
          this.mensagem('Nenhum usuário encontrado', 'warning');
        }
        await loading.dismiss();
      },
      async (error) => {
        await loading.dismiss();
        this.mensagem('Erro ao carregar autenticação', 'danger');
      }
    );
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


  
  sair() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('perfil');
    sessionStorage.clear();
    console.log('Sessão encerrada PROPRIETÁRIO');
  }

}
