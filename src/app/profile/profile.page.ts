import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { userNameMask, cpfMask, telefoneMask  } from './../masks';
import { MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, ViewWillEnter {

  readonly userNameMask = userNameMask;
  readonly cpfMask = cpfMask;
  readonly telefoneMask = telefoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  usuario: any = {};
  idUsuario = sessionStorage.getItem('id');
  perfil = sessionStorage.getItem('perfil');
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  nome: string = '';
  cpf: string = '';
  email: string = '';
  telefone: string = '';

  isModalOpen = false;

  constructor(
    private readonly router: Router,
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.perfil == "PROPRIETARIO") {
      this.obterUsuario();
    }
    else if (this.perfil == "FUNCIONARIO") {
      this.obterFunc();
    }
  }

  ionViewWillEnter() {
    if (this.perfil == "PROPRIETARIO" || this.perfil == "ADMINISTRADOR") {
      this.obterUsuario();
    }
    else if (this.perfil == "FUNCIONARIO") {
      this.obterFunc();
    }
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) this.limpar();
  }


  back() {
    if (this.perfil == "PROPRIETARIO") {
      this.router.navigate(['/tabs/tab3']);
    }
    else if (this.perfil == "FUNCIONARIO") {
      this.router.navigate(['/tabs/tab5']);
    }
    else if (this.perfil == "ADMINISTRADOR") {
      this.router.navigate(['/tabs/tab1']);
    }
  }

  limpar() {

  }

  async editar(nome: string, cpf: string, email: string, telefone: string) {

    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.telefone = telefone;
    this.setModalOpen(true);
  }

  async alterarSenha() {
    if (this.senhaAtual === '' || this.novaSenha === '' || this.confirmarSenha === '') {
      this.Alerta('Preencha todos os campos', 'warning');
    } else if (this.novaSenha !== this.confirmarSenha) {
      this.Alerta('As senhas não conferem', 'warning');
    } else if (this.novaSenha.length < 10) {
      this.Alerta('A senha deve conter no mínimo 10 caracteres', 'warning');
    } else if (this.contemNumerosSequenciais(this.novaSenha)) {
      await this.Alerta(`A nova Senha não deve conter números sequenciais simples como ${this.novaSenha}.`, 'warning');
      return;
    } else if (this.contemCaracteresRepetidos(this.novaSenha)) {
      await this.Alerta(`A nova Senha não deve conter todos os caracteres iguais, como ${this.novaSenha}.`, 'warning');
      return;
    } else if (this.senhaAtual === this.novaSenha) {
      this.Alerta('A nova senha deve ser diferente da senha atual', 'warning');
    }
    else {
      const loading = await this.loadingController.create({
        message: 'Alterando senha ...',
      });
      await loading.present();
      this.provider.alterarSenha(this.idUsuario, this.senhaAtual, this.novaSenha).then(
        async (data: any) => {
          if (data.status === 'success') {
            this.Alerta('Senha alterada com sucesso', 'success');
            this.limparCampos();
          } else {
            this.Alerta('Senha incorreta', 'danger');
          }
          await loading.dismiss();
        }).catch(async (error) => {
          await loading.dismiss();
          this.Alerta('Erro ao alterar senha', 'danger');
        });
    }
  }

  async alterarSenhaFunc() {
    if (this.senhaAtual === '' || this.novaSenha === '' || this.confirmarSenha === '') {
      this.Alerta('Preencha todos os campos', 'warning');
    } else if (this.novaSenha !== this.confirmarSenha) {
      this.Alerta('As senhas não conferem', 'warning');
    } else if (this.novaSenha.length < 8) {
      this.Alerta('A senha deve conter 8 caracteres', 'warning');
    } else if (this.contemNumerosSequenciais(this.novaSenha)) {
      await this.Alerta(`A nova Senha não deve conter números sequenciais simples como ${this.novaSenha}.`, 'warning');
      return;
    } else if (this.contemCaracteresRepetidos(this.novaSenha)) {
      await this.Alerta(`A nova Senha não deve conter todos os caracteres iguais, como ${this.novaSenha}.`, 'warning');
      return;
    } else if (this.senhaAtual === this.novaSenha) {
      this.Alerta('A nova senha deve ser diferente da senha atual', 'warning');
    }
    else {
      const loading = await this.loadingController.create({
        message: 'Alterando senha ...',
      });
      await loading.present();
      this.provider.alterarSenhaFunc(this.idUsuario, this.senhaAtual, this.novaSenha).then(
        async (data: any) => {
          if (data.status === 'success') {
            this.Alerta('Senha alterada com sucesso', 'success');
            this.limparCampos();
          } else {
            this.Alerta('Senha incorreta', 'danger');
          }
          await loading.dismiss();
        }).catch(async (error) => {
          await loading.dismiss();
          this.Alerta('Erro ao alterar senha', 'danger');
        });
    }
  }

  async Alerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : cor === 'warning' ? 'Atenção' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }


  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'EM BREVE',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }


  async obterUsuario() {
    const loading = await this.loadingController.create({
      message: 'Carregando dados ...',
    });
    await loading.present();
    const id = sessionStorage.getItem('id');

    if (id) {
      this.provider.obterUsuario(id).then(
        async (data: any) => {
          if (data.status === 'success') {
            this.usuario = data.usuario;
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

  async editarUsuario() {
    const loading = await this.loadingController.create({
      message: 'Atualizando dados ...',
    });

    if (this.nome == '' || this.cpf == '' || this.email == '' || this.telefone == '') {
      this.Alerta('Preencha todos os campos', 'warning');
      return;
    } else if (
      this.nome === this.usuario.nome &&
      this.cpf === this.usuario.cpf &&
      this.email === this.usuario.email &&
      this.telefone === this.usuario.telefone
    ) {
      this.Alerta('Nenhum dado foi alterado', 'warning');
      this.setModalOpen(false);
      return;
    }

    if (!this.validarCPF(this.cpf)) {
      this.Alerta('CPF inválido', 'warning');
      return;
    }

    await loading.present();

    this.provider.editarUsuario(
      Number(this.idUsuario),
      this.nome,
      this.cpf,
      this.email,
      this.telefone,
      String(this.perfil)
    ).then(
      async (data: any) => {
        if (data.status === 'success') {
          this.Alerta('Dados atualizados com sucesso', 'success');
          this.setModalOpen(false);
          this.obterUsuario();
        } else {
          this.Alerta(data.message || 'Erro ao atualizar dados', 'danger');
        }
        await loading.dismiss();
      }
    ).catch(async (error) => {
      await loading.dismiss();

      if (error.status === 409) {
        // Tratamento de duplicidade
        this.Alerta(error.error.message, 'warning');
      } else {
        this.Alerta('Erro ao atualizar dados', 'danger');
      }
    });
  }


  async obterFunc() {
    const loading = await this.loadingController.create({
      message: 'Carregando dados ...',
    });
    await loading.present();
    const id = sessionStorage.getItem('id');

    if (id) {
      this.provider.obterFuncionario(id).then(
        async (data: any) => {
          if (data.status === 'success') {
            this.usuario = data.usuario;
          } else {
            this.mensagem('Nenhum usuário do tipo funcionario encontrado', 'warning');
          }
          await loading.dismiss();
        }).catch(async (error) => {
          await loading.dismiss();
          this.mensagem('Erro ao carregar autenticação', 'danger');
        });
    }
  }

  limparCampos() {
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
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

}
