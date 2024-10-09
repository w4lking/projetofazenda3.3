import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../services/api.service';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { userNameMask } from './../masks';
import { cpfMask } from './../masks';
import { telefoneMask } from './../masks';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  readonly userNameMask=userNameMask;

  readonly cpfMask=cpfMask;

  readonly telefoneMask=telefoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  nome : string = "";
  cpf : string = "";
  telefone : string = "";
  email : string = "";
  senha : string = "";
  confirmarSenha : string = "";
  perfil : string = "PROPRIETARIO";
  autenticado = 0;
  bloqueado = 0;
  antigo: string = "";
  antigo2: string = "";
  antigo3: string = "";

  constructor(
    private router:Router,
    private provider:ApiService,
    private actRouter:ActivatedRoute,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  backInicio(){
    this.router.navigate(['inicial']);
  }

  async mensagem(mensagem:any, cor:string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }



  async cadastrarUsuario(){
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });

    await loading.present();

    return new Promise(resolve => {
      let dados = {
        nome : this.nome,
        cpf : this.cpf,
        email : this.email,
        telefone : this.telefone,
        senha : this.senha,
        confirmarSenha : this.confirmarSenha,
        autenticado : this.autenticado,
        bloqueado : this.bloqueado,
        antigo : this.antigo,
        antigo2 : this.antigo2,
        antigo3 : this.antigo3,
        perfil : this.perfil,
      }
      this.provider.dadosApi(dados, 'cadastro/cadastro.php').subscribe
      (async (data: any) => {
        await loading.dismiss(); 
        
        if(data.ok == true){
          this.router.navigate(['/login']);
          this.mensagem(data.mensagem, 'success');
          this.limpar()
        }
        else{
          this.mensagem(data.mensagem, 'danger');
        }
      });
    });
  }

  limpar(){
    this.nome = "";
    this.cpf = "";
    this.telefone = "";
    this.email = "";
    this.senha = "";
    this.confirmarSenha = "";
  }

}
