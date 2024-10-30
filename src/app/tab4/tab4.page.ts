import { cpfMask } from './../masks';
import { telefoneMask } from './../masks';
import { salarioMask } from './../masks';
import { userNameMask } from './../masks';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular'; // Adicione AlertController
import { addIcons } from 'ionicons';
import { add, thumbsUpSharp } from 'ionicons/icons';
import { ViewWillEnter } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

import {
  chevronDownCircle,
  chevronForwardCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe,
} from 'ionicons/icons';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit, ViewWillEnter {

  readonly userNameMask = userNameMask;

  readonly cpfMask = cpfMask;

  readonly telefoneMask = telefoneMask;

  readonly salarioMask = salarioMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();



  funcionarios: any[] = [];
  fazendas: any[] = [];
  idUsuario = Number(sessionStorage.getItem('id'));
  nome: string = "";
  cpf: string = "";
  email: string = "";
  telefone: string = "";
  senha: string = "";
  perfil = "FUNCIONARIO";
  salario = maskitoTransform('R$ 0,00', salarioMask);

  idfuncionario: any;  // Armazena o id do funcionario para edição
  idFazenda: any; // Armazena o id da fazenda para edição

  constructor(
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe, add });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Carregando Funcionários...',
    });
    await loading.present();
    this.carregarDados();
    await loading.dismiss();
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    this.obterFazendas();
    this.obterfuncionarios();
    this.cdr.detectChanges();
  }

  isModalOpen = false;
  editando = false;

  setOpen(isOpen: boolean) {
    if (!isOpen) this.limpar();
    this.isModalOpen = isOpen;
  }

  fecharModal() {
    this.setOpen(false);
  }

  abrirModalAdicionar() {
    this.editando = false;
    this.nome = '';
    this.cpf = '';
    this.email = '';
    this.telefone = '';
    this.senha = '';
    this.salario = maskitoTransform('R$ 0,00', salarioMask);
    this.idFazenda;
    this.setOpen(true);
  }

  abrirModalEditar(idfuncionarios: number, nome: string, cpf: string, email: string, telefone: string, salario: number, fazendas_idfazenda: number) {
    this.editando = true;
    this.idfuncionario = idfuncionarios;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.telefone = telefone;
    this.salario = salario.toString();
    this.idFazenda = fazendas_idfazenda;

    console.log('idFazenda ao editar:', this.idFazenda); // Verifique se o valor é correto aqui

    this.setOpen(true);
  }


  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda);
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }




  async obterFazendas() {
    this.provider.obterFazenda(this.idUsuario).then(async (data: any) => {

      if (data.status === 'success' && data.fazendas.length > 0) { // 
        this.fazendas = data.fazendas;
      } else {
        this.fazendas = [];
      }
    }).catch(async (error) => {
      // this.mensagem('Erro ao carregar fazendas', 'danger');
    });
  }

  async obterfuncionarios() {

    this.provider.obterFuncionarios(this.idUsuario).then(
      async (data: any) => {
        if (data.status === 'success' && data.funcionarios.length > 0) {
          this.funcionarios = data.funcionarios;
        } else {
          this.funcionarios = [];
        }
      }
    ).catch(async (error) => {
      // this.mensagem('Erro ao carregar funcionários', 'danger');
    });
  }

  editarfuncionarios(idfuncionario: any, nome: any, email: any, cpf: any, telefone: any, salario: any, idfazendas: any) {
    this.idfuncionario = idfuncionario;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.telefone = telefone;
    this.salario = salario;
    this.idFazenda = idfazendas;  // Certifique-se de que o nome está correto

    this.setOpen(true);  // Abre o modal para edição
  }


  async salvarFuncionario() {
    if (this.editando) {

      console.log('Dados enviados:', this.nome, this.cpf, this.email, this.telefone, this.salario, this.senha, this.idFazenda, this.idUsuario);
      if (!this.validarCPF(this.cpf)) {
        this.exibirAlerta('CPF inválido. Preencha corretamente!', 'danger');
        return;
      }
      if (!this.validarEmail(this.email)) {
        this.exibirAlerta('E-mail inválido. Preencha corretamente!', 'danger');
        return;
      }

      this.provider.editarFuncionarios(
        this.idfuncionario,
        this.nome,
        this.cpf,
        this.email,
        this.telefone,
        this.salario,
        this.idFazenda // Certifique-se de que está correto
      ).then(async (res: any) => {
        if (res.status === 'success') {
          this.exibirAlerta('Funcionário atualizado com sucesso', 'success');
          this.limpar();
          this.obterfuncionarios();
        } else {
          this.exibirAlerta('Erro ao atualizar funcionário, alguns não foram preenchidos...', 'danger');
        }
        this.setOpen(false);
      }).catch((error) => {
        console.error('Erro ao editar funcionário:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      });
    } else {
      this.adicionarFuncionario();
    }
  }




  async adicionarFuncionario() {
    console.log('Dados enviados:', this.nome, this.cpf, this.email, this.telefone, this.salario, this.senha, this.idFazenda, this.idUsuario);
    if (!this.validarCPF(this.cpf)) {
      this.exibirAlerta('CPF inválido. Preencha corretamente!', 'danger');
      return;
    }
    if (!this.validarEmail(this.email)) {
      this.exibirAlerta('E-mail inválido. Preencha corretamente!', 'danger');
      return;
    }

    if (this.senha.length < 8 || this.senha.length > 8) {
      await this.exibirAlerta('A senha deve ter 8 caracteres', 'danger');
      return;
    }

    // Verifica se a senha contém números sequenciais simples
    if (this.contemNumerosSequenciais(this.senha)) {
      await this.exibirAlerta(`A senha não deve conter números sequenciais simples como ${this.senha}.`, 'danger');
      return;
    }

    // Verifica se a senha contém caracteres repetidos
    if (this.contemCaracteresRepetidos(this.senha)) {
      await this.exibirAlerta(`A senha não deve conter todos os caracteres iguais, como ${this.senha}.`, 'danger');
      return;
    }


    const loading = await this.loadingController.create({
      message: 'Adicionando funcionário...',
    });
    await loading.present();

    this.provider.addFuncionarios(
      this.nome,
      this.cpf,
      this.email,
      this.telefone,
      this.salario,
      this.senha,
      this.idFazenda,
      Number(this.idUsuario)  // Aqui garantir que idUsuario é um número
    ).then(async (res: any) => {
      await loading.dismiss();
      if (res.status === 'success') {
        this.exibirAlerta('Funcionario adicionado com sucesso!', 'success');
        this.limpar();
        this.obterfuncionarios(); // Atualiza a lista
      } else {
        this.mensagem('Erro ao adicionar funcionario. Tente novamente!', 'danger');
      }
    }
    ).catch(async (error) => {
      await loading.dismiss();
      this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });

    this.setOpen(false);
  }




  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Preencha os requisitos para adicionar um Funcionário!',
      duration: 2000
    });
    toast.present();
  }

  limpar() {
    this.nome = '';
    this.cpf = '';
    this.email = '';
    this.telefone = '';
    this.senha = '';
    this.salario = maskitoTransform('R$ 0,00', salarioMask);
    this.idfuncionario = null;
    this.idFazenda = null;
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
      message: mensagem,
    });

    await alert.present();

    // Fechar o alerta automaticamente após 3 segundos (3000 ms)
    setTimeout(() => {
      alert.dismiss();
    }, 500);
  }


  // Função de confirmação para excluir o usuário
  async confirmarExclusaofuncionario(id: number) {

    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir este Funcionário?',
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
            this.excluirFuncionario(id); // Chama a função de exclusão se o usuário confirmar
          }
        }
      ]
    });

    await alert.present();
  }


  // Função de exclusão
  excluirFuncionario(id: number) {
    console.log('ID do Funcionário: ', id, 'Tipo do ID: ', typeof id);
    this.provider.deletarFuncionarios(id).then(
      (res: any) => {
        console.log('Resposta da API:', res);
        if (res.status === 'success') {
          console.log('Funcionário excluída com sucesso:', id);
          this.exibirAlerta(res.mensagem, 'primary');
          this.obterfuncionarios(); // Atualiza a lista de funcionarios
        } else {
          console.log('Falha ao excluir a Funcionário:', res.mensagem);
          this.mensagem('Erro ao excluir a Funcionário. Tente novamente!', 'danger');
        }
      }
    ).catch((error) => {
      console.error('Erro na requisição:', error);
      this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
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

  validarEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
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


  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

}

