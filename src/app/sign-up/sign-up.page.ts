import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
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
  perfil: string = "PROPRIETARIO";

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  backInicio() {
    this.router.navigate(['inicial']);
  }

  async exibirAlerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async cadastrarUsuario() {
    // Verifica se todos os campos estão preenchidos
    if (!this.nome || !this.cpf || !this.telefone || !this.email || !this.senha || !this.confirmarSenha) {
      await this.exibirAlerta('Por favor, preencha todos os campos', 'danger');
      return;
    }

    // Verifica se o CPF tem o formato correto
    const cpfValido = this.validarCPF(this.cpf); 
    if (!cpfValido) {
      await this.exibirAlerta('CPF inválido', 'danger');
      return;
    }

    // Verifica se o telefone tem o formato correto
    if (this.telefone.length < 11) {
      await this.exibirAlerta('Número de telefone inválido', 'danger');
      return;
    }

    // Verifica se o e-mail é válido
    const emailValido = this.validarEmail(this.email); 
    if (!emailValido) {
      await this.exibirAlerta('E-mail inválido', 'danger');
      return;
    }

    // Verifica se as senhas coincidem
    if (this.senha !== this.confirmarSenha) {
      await this.exibirAlerta('As senhas não coincidem', 'danger');
      return;
    }

    // Verifica se a senha tem comprimento mínimo
    if (this.senha.length < 10) {
      await this.exibirAlerta('A senha deve ter no mínimo 10 caracteres', 'danger');
      return;
    }

    // Verifica se a senha contém números sequenciais simples
    if (this.contemNumerosSequenciais(this.senha)) {
      await this.exibirAlerta('A senha não deve conter números sequenciais simples como "12345".', 'danger');
      return;
    }

    // Verifica se a senha contém caracteres repetidos
    if (this.contemCaracteresRepetidos(this.senha)) {
      await this.exibirAlerta('A senha não deve conter todos os caracteres iguais, como "1111111111".', 'danger');
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
          console.log('Resposta da API:', data); 
          await loading.dismiss();

          // Verifica se o cadastro foi bem-sucedido
          if (data.status === 'ok') {
            this.router.navigate(['/login']);
            await this.exibirAlerta('Usuário cadastrado com sucesso!', 'success');
            this.limpar();
          } else if (data.status === 'error') {
            await this.exibirAlerta(data.message, 'danger');
          } else {
            await this.exibirAlerta('Erro ao cadastrar usuário', 'danger');
          }
        },
        async (error: any) => {
          await loading.dismiss();

          // Verifica se o erro é um conflito (409) e exibe a mensagem do back-end
          if (error.status === 409) {
            await this.exibirAlerta(error.error.message, 'danger');
          } else {
            await this.exibirAlerta('Erro ao processar a solicitação', 'danger');
            console.error('Erro na solicitação:', error);
          }
        }
      );
  }

  // Método aprimorado para validar CPF
  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    return resto === parseInt(cpf.charAt(10));
  }

  // Método para validar e-mail
  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  // Método para verificar números sequenciais simples
  contemNumerosSequenciais(senha: string): boolean {
    const sequencial = '0123456789';
    for (let i = 0; i <= senha.length - 5; i++) {
      if (sequencial.includes(senha.substring(i, i + 5))) {
        return true;
      }
    }
    return false;
  }

  // Método para verificar caracteres repetidos
  contemCaracteresRepetidos(senha: string): boolean {
    return /^(\d)\1+$/.test(senha);
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
