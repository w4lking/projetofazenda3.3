import { ApiService } from '../services/api.service';
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

  email : string = "";
  senha : string = "";
  perfil : string = "";
  id : string = "";
  autenticado : string = "";
  bloqueado : string = "";
  emailReset : string = "";
  perfilReset : string = "";
  antigo : string = "";


  constructor(
    private router:Router,
    private provider:ApiService,
    public toastController: ToastController,
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {

  }


  async mensagem(mensagem:any, cor:string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  backInicio(){
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
  
    // Fechar o alerta automaticamente após 3 segundos (3000 ms)
    setTimeout(() => {
      alert.dismiss();
    }, 1500);
  }
  

  resetlimpar(){
    this.emailReset = "";
    this.perfilReset = "";
  }

  async enviarEmail(){
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });

    await loading.present();

    return new Promise(resolve => {
      let dados = {
        email : this.emailReset,
        perfil : this.perfilReset,
        antigo : this.antigo,
      }
      this.provider.dadosApi(dados, 'login/enviarEmail.php').subscribe (async (data: any) => {
        await loading.dismiss();

        if(data.ok == true){
          this.mensagem(data.mensagem, 'primary');
          localStorage.getItem('email');
          this.resetlimpar();
          this.cancel();
        }
        else{
          this.mensagem(data.mensagem, 'danger');
        }
      });
    });
  }


  login() {
    if (!this.email || !this.senha) {
      this.exibirAlerta('Por favor, preencha o e-mail e a senha', 'danger');
      return;
    }
  
    let dados = {
      email: this.email,
      senha: this.senha,
      perfil: this.provider.getTipoDeUsuario(this.email),
      sessionId: this.generateUniqueId(), // ID único para sessão
      id: this.id,
    };
  
    // Obtendo o ID do usuário via serviço
    this.provider.getIdUsuario(this.email).subscribe(
      (id: any) => {
        dados.id = id; // Atribui o ID obtido
  
        this.provider.dadosApi(dados, 'login/login.php').subscribe(
          (data: any) => {
            if (data.ok) {
              this.Alerta(data.mensagem, 'primary');
  
              // Salvando o JWT no sessionStorage
              sessionStorage.setItem('token', data.dados.token);
              sessionStorage.setItem('id', dados.id.toString());
              sessionStorage.setItem('email', this.email);
              sessionStorage.setItem('perfil', data.dados.perfil);
              sessionStorage.setItem('sessionId', dados.sessionId);
              console.log(data.dados);
  
              // Redirecionar para o painel dependendo do perfil
              if (data.dados.perfil === 'ADMINISTRADOR') {
                this.router.navigate(['tabs']);
              } else if (data.dados.perfil === 'PROPRIETARIO') {
                this.router.navigate(['tabs/tab3']);
              }
            } else {
              this.exibirAlerta(data.mensagem, 'danger');
            }
          },
          (error: any) => {
            console.log('Erro na comunicação com a API:', error);
            this.exibirAlerta('Erro ao tentar realizar o login. Tente novamente mais tarde.', 'danger');
          }
        );
      },
      (error) => {
        console.log('Erro ao obter o usuário:', error);
        this.exibirAlerta('Erro ao tentar obter o ID e Usuário não encontrado. Tente novamente mais tarde.', 'danger');
      }
    );
  }
  
  

// Método para gerar um identificador único
generateUniqueId(): string {
    return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
        return Math.floor(Math.random() * 9).toString();
    });
}


}

