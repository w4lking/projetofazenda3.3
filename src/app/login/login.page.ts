import { ApiService } from '../services/api.service';  // Serviço atualizado para Node.js
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  senha: string = "";
  perfil: string = "";
  id: any;
  autenticado: string = "";
  bloqueado: string = "";
  emailReset: string = "";
  perfilReset: string = "";
  antigo: string = "";

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  backInicio() {
    this.router.navigate(['inicial']);
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async exibirAlerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async Alerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
    });
    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 1500);
  }

  resetlimpar() {
    this.emailReset = "";
    this.perfilReset = "";
  }

  async enviarEmail() {
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });

    await loading.present();

    try {
      const data = await this.provider.enviarResetEmail(this.emailReset, this.perfilReset);
      await loading.dismiss();

      if (data.ok === true) {
        this.exibirAlerta(data.mensagem, 'primary');
        this.resetlimpar(); 
        this.cancel(); 
      } else {
        this.exibirAlerta(data.mensagem, 'danger');
      }
    } catch (error) {
      await loading.dismiss();
      this.exibirAlerta('Erro ao enviar o e-mail. Tente novamente mais tarde.', 'danger');
      console.error('Erro ao enviar o e-mail:', error);
    }
  }


  async login() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await loading.dismiss();
    if (!this.email || !this.senha) {
      this.exibirAlerta('Por favor, preencha o e-mail e a senha', 'danger');
      return;
    }

    else if (this.senha.length >= 10) {
      const id = await this.provider.obterUsuarioWithEmail(this.email);
      const perfil = await this.provider.getTipoDeUsuario(this.email);
      this.id = id;
      this.perfil = perfil;
    }
    else {
      const idFunc = await this.provider.obterFuncionarioWithEmail(this.email);
      const perfilFunc = await this.provider.getTipoDeFuncionario(this.email);
      this.id = idFunc;
      this.perfil = perfilFunc;
    }
    try {
      const dados = {
        email: this.email,
        senha: this.senha,
        perfil: this.perfil,
        sessionId: this.generateUniqueId(),
      };


      const response = await this.provider.dadosApi(dados, 'user/login');
      if (response && response.ok) {
        console.log('Login realizado com sucesso!');
        this.handleLoginSuccess(dados, response.perfil, this.id);
        sessionStorage.setItem('id', this.id);
        sessionStorage.setItem('token', response.token);
      } else {
        const message = response.message || 'Erro no login';
        console.warn('Falha no login:', message);
        this.exibirAlerta(message, 'danger');
      }
    } catch (error) {
      console.error('Erro ao tentar realizar o login:', error);
      this.exibirAlerta('Erro ao tentar realizar o login. Tente novamente mais tarde.', 'danger');
    }
  }




  // Método separado para tratar sucesso no login
  private handleLoginSuccess(dados: any, perfil: string, id: number) {
    this.Alerta(dados.mensagem, 'primary');
    this.provider.armazenarUsuario(dados.email);
    sessionStorage.setItem('sessionId', dados.sessionId);
    sessionStorage.setItem('perfil', perfil);


    if (perfil === "ADMINISTRADOR") {
      console.log('Redirecionando para a página do administrador...');
      this.router.navigate(['tabs']);
    } else if (perfil === "PROPRIETARIO") {
      console.log('Redirecionando para a página do proprietário...');
      this.router.navigate(['tabs/tab3']);
    } else if (perfil === "FUNCIONARIO") {
      console.log('Redirecionando para a página do funcionário...');
      this.router.navigate(['tabs/tab5']);
    }
  }


  // Método para gerar um identificador único
  generateUniqueId(): string {
    return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
      return Math.floor(Math.random() * 9).toString();
    });
  }
}
