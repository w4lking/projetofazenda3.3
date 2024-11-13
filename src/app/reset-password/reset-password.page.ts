import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email: string = "";
  perfil: string = "";
  senha: string = "";
  token: string = "";
  confirmarSenha: string = "";

  constructor(
    public toastController: ToastController,
    private router: Router,
    private provider: ApiService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Obter o token e outros parâmetros da URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.perfil = params['perfil'];
      this.token = params['token'];

      if (this.token) {
        this.provider.verificarToken(this.token).then((data: any) => {
          if (data.ok) {
            this.Alerta("Token found", 'primary');
          } else {
            this.Alerta(data.mensagem, 'danger');
            this.router.navigate(['/login']);
          }
        }).catch(error => {
          this.Alerta('Erro ao verificar o token', 'danger');
          this.router.navigate(['/login']);
        });
      }
    });
  }

  backInicio() {
    this.router.navigate(['/login']);
  }

  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
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

  resetPass() {
    // Verificar se as senhas coincidem
    if (this.senha !== this.confirmarSenha) {
      this.exibirAlerta('As senhas não coincidem', 'danger');
      return;
    }

    // Verificar o comprimento da senha com base no perfil
    if (this.perfil === 'FUNCIONARIO' && this.senha.length < 8) {
      this.exibirAlerta('A senha deve ter pelo menos 8 caracteres para funcionários', 'danger');
      return;
    } else if (this.perfil === 'PROPRIETARIO' && this.senha.length < 10) {
      this.exibirAlerta('A senha deve ter pelo menos 10 caracteres para proprietários', 'danger');
      return;
    }

    // Continuar com a redefinição de senha se todas as condições forem atendidas
    this.provider.resetPassword(this.email, this.perfil, this.token, this.senha).then((data: any) => {
      if (data.ok) {
        this.exibirAlerta(data.mensagem, 'primary');
        this.router.navigate(['/login']);
      } else {
        this.exibirAlerta(data.mensagem, 'danger');
      }
    }).catch(error => {
      console.error('Erro ao redefinir senha:', error);
      this.exibirAlerta('Erro ao redefinir a senha', 'danger');
    });
  }
}
