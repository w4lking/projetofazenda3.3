import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController, ViewWillEnter } from '@ionic/angular';
import { userNameMask, cpfMask, telefoneMask  } from './../masks';
import { MaskitoElementPredicate } from '@maskito/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, ViewWillEnter {


  readonly userNameMask = userNameMask;
  readonly cpfMask = cpfMask;
  readonly telefoneMask = telefoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();


  usuarios: any = {};
  idUsuario = sessionStorage.getItem('id');

  id: any = '';
  nome: string = '';
  cpf: string = '';
  email: string = '';
  telefone: string = '';
  perfil: string = '';

  isModalOpen = false;

  constructor(
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly alertController: AlertController
  ) { }

  ngOnInit() {
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) this.limpar();
  }

  limpar() {
    this.nome = '';
    this.cpf = '';
    this.email = '';
    this.telefone = '';
  }

  async exibirAlerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async carregarDados() {
    const loading = await this.loadingController.create({
      message: 'Carregando Dados...',
    });
    await loading.present();
    this.obterUsuarios();
    await loading.dismiss();
  }

  async obterUsuarios() {

    this.provider.obterUsuarios(Number(this.idUsuario)).then(async (data: any) => {
      if (data.length > 0) {
        this.usuarios = data;
      } else {
        //
      }
    }).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }


  async editar(id: number ,nome: string, cpf: string, email: string, telefone: string, perfil: string) {

    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.telefone = telefone;
    this.perfil = perfil;
    this.setModalOpen(true);
    if (id === 1) {
      this.exibirAlerta('O administrador principal não pode ser editado!', 'danger');
      this.setModalOpen(false);
    }
  }


  async editarUsuario() {
    const loading = await this.loadingController.create({
      message: 'Atualizando dados ...',
    });

    if (this.nome == '' || this.cpf == '' || this.email == '' || this.telefone == '') {
      this.exibirAlerta('Preencha todos os campos', 'danger');
      return;
    } else if (
      this.nome === this.usuarios.nome &&
      this.cpf === this.usuarios.cpf &&
      this.email === this.usuarios.email &&
      this.telefone === this.usuarios.telefone &&
      this.perfil === this.usuarios.perfil
    ) {
      this.exibirAlerta('Nenhum dado foi alterado', 'danger');
      this.setModalOpen(false);
      return;
    }

    if (!this.validarCPF(this.cpf)) {
      this.exibirAlerta('CPF inválido', 'danger');
      return;
    }

    await loading.present();

    this.provider.editarUsuario(
      this.id,
      this.nome,
      this.cpf,
      this.email,
      this.telefone,
      this.perfil
    ).then(
      async (data: any) => {
        if (data.status === 'success') {
          this.exibirAlerta('Dados atualizados com sucesso', 'success');
          this.setModalOpen(false);
          this.obterUsuarios();
        } else {
          this.exibirAlerta(data.message || 'Erro ao atualizar dados', 'danger');
        }
        await loading.dismiss();
      }
    ).catch(async (error) => {
      await loading.dismiss();

      if (error.status === 409) {
        // Tratamento de duplicidade
        this.exibirAlerta(error.error.message, 'warning');
      } else {
        this.exibirAlerta('Erro ao atualizar dados', 'danger');
      }
    });
  }

  async alterarBloqueio(usuario: any) {
    if (usuario.idusuarios === 1) {
      await this.exibirAlerta('O administrador não pode ser bloqueado!', 'danger');
      return;
    }
    usuario.bloqueado = usuario.bloqueado == 1 ? 0 : 1;

    this.provider.alterarBloqueio(usuario.idusuarios, usuario.bloqueado).then(
      async (res: any) => {
        if (res.status === 'success' || res.ok === true) {
          await this.exibirAlerta('Bloqueio atualizado com sucesso!', 'success');
        } else {
          await this.exibirAlerta('Erro ao atualizar o bloqueio. Tente novamente!', 'danger');
        }
      }
    ).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }

  async confirmarExclusaoUsuario(usuario: any) {
    if (usuario.idusuarios === 1) {
      await this.exibirAlerta('O administrador não pode ser excluído!', 'danger');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir este usuário?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Exclusão cancelada');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluirUsuario(usuario.idusuarios);
          }
        }
      ]
    });

    await alert.present();
  }

  async excluirUsuario(id: any) {
    this.provider.deletarUsuario(id).then(
      async (res: any) => {
        if (res.status === 'success' || res.ok === true) {
          await this.exibirAlerta('Usuário excluído com sucesso!', 'success');
          this.obterUsuarios();
        } else {
          await this.exibirAlerta('Erro ao excluir o usuário. Tente novamente!', 'danger');
        }
      }
    ).catch(async (error) => {
      console.error('Erro na requisição:', error);
      await this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
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
}
