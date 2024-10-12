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
  id: string = "";
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
  ) {}

  ngOnInit() {}

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

    return new Promise(resolve => {
      let dados = {
        email: this.emailReset,
        perfil: this.perfilReset,
        antigo: this.antigo,
      };
      this.provider.dadosApi(dados, 'email/sendResetEmail')  // Novo endpoint na API Node.js
        .then(async (data: any) => {
          await loading.dismiss();

          if (data.ok === true) {
            this.mensagem(data.mensagem, 'primary');
            localStorage.getItem('email');
            this.resetlimpar();
            this.cancel();
          } else {
            this.mensagem(data.mensagem, 'danger');
          }
        })
        .catch(async (error: any) => {
          await loading.dismiss();
          this.mensagem('Erro ao enviar o e-mail. Tente novamente mais tarde.', 'danger');
          console.error('Erro ao enviar o e-mail:', error);
        });
    });
  }

  async login() {
    if (!this.email || !this.senha) {
        this.exibirAlerta('Por favor, preencha o e-mail e a senha', 'danger');
        return;
    }

    try {
        const id = await this.provider.obterUsuarioWithEmail(this.email);
        const perfil = await this.provider.getTipoDeUsuario(this.email);

        const dados = {
            email: this.email,
            senha: this.senha,
            perfil,
            sessionId: this.generateUniqueId(),
        };

        const response = await this.provider.dadosApi(dados, 'user/login');

        // Log da resposta da API
        console.log('Resposta da API:', response);

        // Verificação se a resposta é ok
        if (response && response.ok) {
            console.log('Login realizado com sucesso!');
            console.log(response.perfil);

            this.handleLoginSuccess(dados, response.perfil, id);
            sessionStorage.setItem('id', id);
            sessionStorage.setItem('token', response.token);
            console.log('token:', response.token);
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
  private handleLoginSuccess(dados: any, perfil: string, id : number) {
    this.Alerta(dados.mensagem, 'primary');
    this.provider.armazenarUsuario(dados.email);
    sessionStorage.setItem('sessionId', dados.sessionId);
    sessionStorage.setItem('perfil', perfil);
    console.log('sessionId', dados.sessionId);
    
    
    if (perfil === "ADMINISTRADOR") {
      console.log('Redirecionando para a página do administrador...');
      this.router.navigate(['tabs']);
    } else if (perfil === "PROPRIETARIO") {
      console.log('Redirecionando para a página do proprietário...');
      this.router.navigate(['tabs/tab3']);
    }
  }


  // Método para gerar um identificador único
  generateUniqueId(): string {
    return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
      return Math.floor(Math.random() * 9).toString();
    });
  }
}
