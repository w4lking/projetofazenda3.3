import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usuario: any = {};
  idUsuario = sessionStorage.getItem('id');
  perfil = sessionStorage.getItem('perfil');
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private alertController: AlertController
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


  back() {
    if (this.perfil == "PROPRIETARIO"){
      this.router.navigate(['/tabs/tab3']);
    }
    else if (this.perfil == "FUNCIONARIO"){
      this.router.navigate(['/tabs/tab5']);
    }
    else if (this.perfil == "ADMINISTRADOR"){
      this.router.navigate(['/tabs/tab1']);
    }
  }

  async alterarSenha() {
    if (this.senhaAtual === '' || this.novaSenha === '' || this.confirmarSenha === '') {
      this.Alerta('Preencha todos os campos', 'warning');
    } else if (this.novaSenha !== this.confirmarSenha) {
      this.Alerta('As senhas não conferem', 'warning');
    } else if (this.novaSenha.length < 10) {
      this.Alerta('A senha deve conter no mínimo 10 caracteres', 'warning');
    }else if (this.contemNumerosSequenciais(this.novaSenha)) {
      await this.Alerta(`A nova Senha não deve conter números sequenciais simples como ${this.novaSenha}.`, 'warning');
      return;
    }else if (this.contemCaracteresRepetidos(this.novaSenha)) {
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
    }else if (this.contemNumerosSequenciais(this.novaSenha)) {
      await this.Alerta(`A nova Senha não deve conter números sequenciais simples como ${this.novaSenha}.`, 'warning');
      return;
    }else if (this.contemCaracteresRepetidos(this.novaSenha)) {
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
          // Verifica se o status da resposta é 'success'
          if (data.status === 'success') {
            this.usuario = data.usuario; // Acessa os dados do usuário corretamente
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

  async obterFunc() {
    const loading = await this.loadingController.create({
      message: 'Carregando dados ...',
    });
    await loading.present();
    const id = sessionStorage.getItem('id');

    if (id) {
      this.provider.obterFuncionario(id).then(
        async (data: any) => {
          // Verifica se o status da resposta é 'success'
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

}
