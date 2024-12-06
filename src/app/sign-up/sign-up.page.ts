import { Component } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from './../services/api.service';
import { userNameMask, cpfMask, telefoneMask  } from './../masks';
import { MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {

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
    private readonly router: Router,
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly alertController: AlertController
  ) { }

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
    if (!this.nome || !this.cpf || !this.telefone || !this.email || !this.senha || !this.confirmarSenha) {
      await this.exibirAlerta('Por favor, preencha todos os campos', 'danger');
      return;
    }

    const cpfValido = this.validarCPF(this.cpf); 
    if (!cpfValido) {
      await this.exibirAlerta('CPF inválido', 'danger');
      return;
    }

    if (this.telefone.length < 11) {
      await this.exibirAlerta('Número de telefone inválido', 'danger');
      return;
    }

    const emailValido = this.validarEmail(this.email); 
    if (!emailValido) {
      await this.exibirAlerta('E-mail inválido', 'danger');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      await this.exibirAlerta('As senhas não coincidem', 'danger');
      return;
    }

    if (this.senha.length < 10) {
      await this.exibirAlerta('A senha deve ter no mínimo 10 caracteres', 'danger');
      return;
    }

    if (this.contemNumerosSequenciais(this.senha)) {
      await this.exibirAlerta('A senha não deve conter números sequenciais simples como "12345".', 'danger');
      return;
    }

    if (this.contemCaracteresRepetidos(this.senha)) {
      await this.exibirAlerta('A senha não deve conter todos os caracteres iguais, como "1111111111".', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });
    await loading.present();

    this.provider.registrarUsuario(this.cpf, this.nome, this.email, this.senha, this.telefone, this.perfil)
      .then(
        async (data: any) => {
          await loading.dismiss();
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

          if (error.status === 409) {
            await this.exibirAlerta(error.error.message, 'danger');
          } else {
            await this.exibirAlerta('Erro ao processar a solicitação', 'danger');
            console.error('Erro na solicitação:', error);
          }
        }
      );
  }

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

  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  contemNumerosSequenciais(senha: string): boolean {
    const sequencial = '0123456789';
    for (let i = 0; i <= senha.length - 5; i++) {
      if (sequencial.includes(senha.substring(i, i + 5))) {
        return true;
      }
    }
    return false;
  }

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
