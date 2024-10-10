import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from './../services/api.service';
import { userNameMask } from './../masks';
import { cpfMask } from './../masks';
import { telefoneMask } from './../masks';
import { MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  readonly userNameMask = userNameMask;
  readonly cpfMask = cpfMask;
  readonly telefoneMask = telefoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  nome: string = "";
  cpf: string = "";
  telefone: string = "";
  email: string = "";
  senha: string = "";
  confirmarSenha: string = "";
  perfil: string = "ADMINISTRADOR";

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {}

  backInicio() {
    this.router.navigate(['inicial']);
  }

  async mensagem(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  async cadastrarUsuario() {
    // Verifica se todos os campos estão preenchidos
    if (!this.nome || !this.cpf || !this.telefone || !this.email || !this.senha || !this.confirmarSenha) {
      this.mensagem('Por favor, preencha todos os campos', 'danger');
      return;
    }
  
    // Verifica se o CPF tem o formato correto
    const cpfValido = this.validarCPF(this.cpf); // Crie um método para validar CPF
    if (!cpfValido) {
      this.mensagem('CPF inválido', 'danger');
      return;
    }
  
    // Verifica se o telefone tem o formato correto (pode-se usar regex ou um método de validação)
    if (this.telefone.length < 10) {
      this.mensagem('Número de telefone inválido', 'danger');
      return;
    }
  
    // Verifica se o e-mail é válido
    const emailValido = this.validarEmail(this.email); // Crie um método para validar e-mail
    if (!emailValido) {
      this.mensagem('E-mail inválido', 'danger');
      return;
    }
  
    // Verifica se as senhas coincidem
    if (this.senha !== this.confirmarSenha) {
      this.mensagem('As senhas não coincidem', 'danger');
      return;
    }
  
    // Verifica se a senha tem comprimento mínimo (por exemplo, 6 caracteres)
    if (this.senha.length < 6) {
      this.mensagem('A senha deve ter no mínimo 6 caracteres', 'danger');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });
    await loading.present();
  
    // Chama o método do ApiService para registrar o usuário
    this.provider.registrarUsuario(this.cpf, this.nome, this.email, this.senha, this.telefone, this.perfil)
      .subscribe(
        async (data: any) => {
          console.log('Resposta da API:', data); // Adicione isto para ver a resposta
          await loading.dismiss();
          if (data.status === 'ok') {
            this.router.navigate(['/login']);
            this.mensagem('Usuário cadastrado com sucesso!', 'success');
            this.limpar();
          } else {
            this.mensagem(data.message || 'Erro ao cadastrar usuário', 'danger');
          }
        },
        async (error: any) => {
          await loading.dismiss();
          this.mensagem('Erro ao processar a solicitação', 'danger');
          console.error('Erro na solicitação:', error);
        }
      );
  }
  
  // Método para validar CPF (simples, pode ser aprimorado)
  validarCPF(cpf: string): boolean {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
  }
  
    // Método para validar e-mail
    validarEmail(email: string): boolean {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }
  

  limpar() {
    this.nome = "";
    this.cpf = "";
    this.telefone = "";
    this.email = "";
    this.senha = "";
    this.confirmarSenha = "";
  }

}
