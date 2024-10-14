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
  cpf : string = "";
  email: string = "";
  telefone: string = "";
  senha: string = "";
  perfil = "FUNCIONARIO";
  salario = maskitoTransform('R$ 0,00', salarioMask);

  idfuncionario: any;  // Armazena o id do funcionario para edição
  idFazenda: any // Armazena o id da fazenda para edição

  constructor(
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe, add });
  }

  ngOnInit() {
    this.obterFazendas();  // Primeiro, carregar fazendas
    this.obterfuncionarios();  // Em seguida, carregar funcionários
    this.cdr.detectChanges();
  }

  ionViewWillEnter() {
    this.obterFazendas();  // Primeiro, carregar fazendas
    this.obterfuncionarios();  // Em seguida, carregar funcionários
    this.cdr.detectChanges();
  }

  isModalOpen = false;
  editando = false;

  setOpen(isOpen: boolean) {
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

  abrirModalEditar(funcionario: { idfuncionarios: number; nome: string; cpf: string; email: string; telefone: string; salario: number; fazendas_idfazenda: number}) {
    this.editando = true;
    this.idfuncionario = funcionario.idfuncionarios;
    this.nome = funcionario.nome;
    this.cpf = funcionario.cpf;
    this.email = funcionario.email;
    this.telefone = funcionario.telefone;
    this.salario = funcionario.salario.toString();
    this.idFazenda = funcionario.fazendas_idfazenda;
    this.setOpen(true);
  }

  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda); // Usando "==" para comparar diferentes tipos
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }
  
  
  

  async obterFazendas() {
    const loading = await this.loadingController.create({
      message: 'Carregando Fazendas...',
    });
    await loading.present();

    this.provider.obterFazenda(this.idUsuario).then(async (data: any) => {
      await loading.dismiss();
      if (data.status === 'success' && data.fazendas.length > 0) { // Verifica o status e se há fazendas
          this.fazendas = data.fazendas; // Atribui os dados retornados diretamente
      } else {
          this.fazendas = [];
      }
    }).catch(async (error) => {
      await loading.dismiss();
      this.mensagem('Erro ao carregar fazendas', 'danger');
  });
  }

  async obterfuncionarios() {
    const loading = await this.loadingController.create({
      message: 'Carregando funcionarios...',
    });
    await loading.present();

    this.provider.obterFuncionarios(this.idUsuario).then(
      async (data: any) => {
        if (data.status === 'success' && data.funcionarios.length > 0) {
          this.funcionarios = data.funcionarios;
        } else {
          this.funcionarios = [];
        }
        await loading.dismiss();
      }
    ).catch(async (error) => {
      await loading.dismiss();
      this.mensagem('Erro ao carregar funcionarios', 'danger');
    });
  }

  editarfuncionarios(idfuncionario: any, nome: any, cpf: any, telefone: any, salario: any) {
    this.idfuncionario = idfuncionario;
    this.nome = nome;
    this.cpf = cpf;
    this.telefone = telefone;
    this.salario = salario;
  
    this.setOpen(true);  // Abre o modal para edição
  }
  

  async salvarFuncionario() {
    console.log(this.idFazenda);
    if (this.editando) {
        console.log('Editando funcionário:', this.funcionarios);
        // Editar funcionário existente
        this.provider.editarFuncionarios(
            this.idfuncionario,
            this.nome,
            this.cpf,
            this.email,
            this.telefone,
            this.salario
        ).then(
            async (res: any) => {
                if (res.ok) {
                    this.exibirAlerta('Funcionário atualizado com sucesso', 'success');
                    this.limpar();
                    this.obterfuncionarios();  // Atualiza a lista
                } else {
                    this.exibirAlerta('Erro ao atualizar funcionário', 'danger');
                }
                this.setOpen(false); // Fecha o modal
            }
        ).catch((error) => {
            console.error('Erro ao editar funcionário:', error);
            this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
        });
    } else {
        // Adicionar novo funcionário
        this.adicionarFuncionario();
    }
    this.setOpen(false); // Fecha o modal
}


async adicionarFuncionario() {
  console.log('Dados enviados:', this.nome, this.cpf, this.email, this.telefone, this.salario, this.senha, this.idFazenda, this.idUsuario);
  console.log('Tipo do idFazenda:', typeof this.idFazenda);
  console.log('Tipo do idUsuario:', typeof this.idUsuario);
  if (this.nome === '' || this.cpf === '' || this.email === '') {
      this.presentToast();
  } else {
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
        console.error('Erro na requisição ao adicionar funcionario:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
  }
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
    this.idfuncionario;
    this.idFazenda;
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
        if (res.ok) {
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
  

  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

}

