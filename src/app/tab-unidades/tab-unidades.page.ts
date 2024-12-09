import { Component} from '@angular/core';
import { ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { userNameMask, cpfMask, telefoneMask  } from './../masks';
import { MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-tab-unidades',
  templateUrl: './tab-unidades.page.html',
  styleUrls: ['./tab-unidades.page.scss'],
})
export class TabUnidadesPage {

  readonly userNameMask = userNameMask;
  readonly cpfMask = cpfMask;
  readonly telefoneMask = telefoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  nome: string = '';
  unidade: string = '';
  email: string = '';
  cpf : string = '';
  telefone: string = '';
  perfil : string = '';
  senha : string = '';
  confirmarSenha : string = '';

  constructor(
    private readonly provider: ApiService,
    private readonly toastController: ToastController,
    private readonly modalCtrl: ModalController,
    private readonly router: Router,
    private readonly loadingController: LoadingController,
    private readonly alertController: AlertController,
  ) { }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  back() {
    this.router.navigate(['/tabs/tab1']);
  }

  async confirmEquipamentos() {
    if (!this.nome) {
      this.presentAlert('Erro', 'Nome do equipamento é obrigatório');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adicionando equipamento...',
    });
    await loading.present();

    this.provider.addEquipamento(this.nome).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status === 'success' || res.ok) {
          this.presentAlert('Sucesso', 'Equipamento adicionado com sucesso');
          this.cancel();
          this.nome = '';
        } else {
          this.presentAlert('Erro', 'Erro ao adicionar equipamento. Tente novamente!');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      console.error('Erro ao adicionar equipamento:', error);
      this.presentAlert('Erro', 'Erro ao conectar-se ao servidor. Tente novamente!');
    });
  }

  async confirmInsumos() {
    if (!this.nome || !this.unidade) {
      this.presentAlert('Erro', 'Nome e unidade são obrigatórios');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adicionando insumo...',
    });
    await loading.present();

    this.provider.addInsumo(this.nome, this.unidade).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status === 'success' || res.ok) {
          this.presentAlert('Sucesso', 'Insumo adicionado com sucesso');
          this.cancel();
          this.nome = '';
          this.unidade = '';
        } else {
          this.presentAlert('Erro', 'Erro ao adicionar insumo. Tente novamente!');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      console.error('Erro ao adicionar insumo:', error);
      this.presentAlert('Erro', 'Erro ao conectar-se ao servidor. Tente novamente!');
    });
  }

  async confirmarUsuario(){
    if (!this.nome || !this.cpf || !this.telefone || !this.email || !this.senha || !this.confirmarSenha) {
      await this.Alerta('danger','Por favor, preencha todos os campos');
      return;
    }

    const cpfValido = this.validarCPF(this.cpf); 
    if (!cpfValido) {
      await this.Alerta('danger','CPF inválido');
      return;
    }

    if (this.telefone.length < 11) {
      await this.Alerta('danger', 'Número de telefone inválido');
      return;
    }

    const emailValido = this.validarEmail(this.email); 
    if (!emailValido) {
      await this.Alerta('danger', 'E-mail inválido');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      await this.Alerta('danger','As senhas não coincidem');
      return;
    }

    if (this.senha.length < 10) {
      await this.Alerta('danger','A senha deve ter no mínimo 10 caracteres' );
      return;
    }

    if (this.contemNumerosSequenciais(this.senha)) {
      await this.Alerta( 'danger', 'A senha não deve conter números sequenciais simples como "12345".');
      return;
    }

    if (this.contemCaracteresRepetidos(this.senha)) {
      await this.Alerta('danger', 'A senha não deve conter todos os caracteres iguais, como "1111111111".');
      return;
    }

    this.provider.registrarUsuario(this.cpf, this.nome, this.email, this.senha, this.telefone, this.perfil, 1).then(
      async (res: any) => {
        if (res.status === 'success' || res.status === 'ok') {
          this.Alerta('Sucesso', 'Usuário adicionado com sucesso');
          this.limpar();
          this.cancel();
        } else {
          this.presentAlert('Erro', 'Erro ao adicionar usuário. Tente novamente!');
        }
      }
    ).catch(async (error) => {
      console.error('Erro ao adicionar usuário:', error);
      this.presentAlert('Erro', 'Erro ao conectar-se ao servidor. Tente novamente!');
    });
  }


  limpar() {
    this.nome = '';
    this.email = '';
    this.cpf = '';
    this.telefone = '';
    this.perfil = '';
    this.senha = '';
    this.confirmarSenha = '';
    this.perfil = '';
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.toastController.create({
      header,
      message,
      buttons: ['OK'],
    });

    setTimeout(() => {
      alert.dismiss();
    }, 1500);
    await alert.present();
  }

  async Alerta(cor: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : cor === 'warning' ? 'Atenção' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
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


}
