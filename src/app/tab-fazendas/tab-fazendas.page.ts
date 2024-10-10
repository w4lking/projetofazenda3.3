import { cepMask } from './../masks';
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

@Component({
  selector: 'app-tab-fazendas',
  templateUrl: './tab-fazendas.page.html',
  styleUrls: ['./tab-fazendas.page.scss'],
})
export class TabFazendasPage implements OnInit, ViewWillEnter {

  readonly cepMask = cepMask;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  fazendas: any = [];
  id = sessionStorage.getItem('id');
  nome: string = "";
  cep: string = "";
  endereco: string = "";
  valor = 0.0;
  idFazenda: number | null = null;  // Armazena o id da fazenda para edição

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
    this.obterFazendas();
  }

  ionViewWillEnter() {
    this.obterFazendas();
    this.cdr.detectChanges(); 
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  

  async obterFazendas() {
    const loading = await this.loadingController.create({
      message: 'Carregando Fazendas...',
    });
    await loading.present();

    this.provider.obterFazenda(this.id).then(
      async (data: any) => {
        if (data.ok) {
          this.fazendas = data.ok;
        } else {
          this.fazendas = [];
        }
        await loading.dismiss();
      }
    ).catch(async (error) => {
      await loading.dismiss();
      this.mensagem('Erro ao carregar Fazendas', 'danger');
    });
  }

  editarFazenda(nome: any, cep: any, endereco: any, valor: number, idFazenda: number) {
    console.log('Dados a serem editados:', {nome, cep, endereco, valor, idFazenda});
    this.nome = nome;
    this.cep = cep;
    this.endereco = endereco;
    this.valor = valor;
    this.idFazenda = idFazenda;
  
    this.setOpen(true);  // Abre o modal para edição
  }
  

  async salvarFazenda() {
    // Verifica se estamos editando ou adicionando uma nova fazenda
    if (this.idFazenda) {
      console.log('Editando fazenda:', this.fazendas);
      // Editar fazenda existente
      this.provider.editarFazenda(this.nome, this.cep, this.endereco, this.valor, this.idFazenda).then(
        async (res: any) => {
          if (res.ok) {
            this.exibirAlerta('Fazenda atualizada com sucesso', 'success');
            this.limpar();
            this.obterFazendas();  // Atualiza a lista
          } else {
            this.exibirAlerta('Erro ao atualizar fazenda', 'danger');
          }
          this.setOpen(false); // Fecha o modal
        }
      ).catch((error) => {
        console.error('Erro ao editar fazenda:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      });
    } else {
      // Adicionar nova fazenda
      this.adicionarFazenda();
    }
  }

  async adicionarFazenda() {
    if (this.nome === '' || this.cep === '' || this.endereco === '') {
      this.presentToast();
    } else {
      const loading = await this.loadingController.create({
        message: 'Adicionando fazenda...',
      });
      await loading.present();

      this.provider.addFazenda(this.nome, this.cep, this.endereco, this.valor, this.id).then(
        async (res: any) => {
          if (res.ok) {
            this.exibirAlerta('Fazenda adicionada com sucesso', 'success');
            this.limpar();
            this.obterFazendas();  // Atualiza a lista
          } else {
            this.mensagem('Erro ao adicionar fazenda. Tente novamente!', 'danger');
          }
          await loading.dismiss();
        }
      ).catch(async (error) => {
        await loading.dismiss();
        console.error('Erro na requisição:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      });
    }
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Preencha os requisitos para adicionar uma fazenda!',
      duration: 2000
    });
    toast.present();
  }

  limpar() {
    this.nome = '';
    this.cep = '';
    this.endereco = '';
    this.valor = 0.0;
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
  async confirmarExclusaofazenda(id: number) {
  
    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir esta fazenda?',
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
            this.excluirfazenda(id); // Chama a função de exclusão se o usuário confirmar
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  // Função de exclusão
  excluirfazenda(id: number) {
    console.log('ID da Fazenda: ', id, 'Tipo do ID: ', typeof id);
    this.provider.deletarFazenda(id).then(
      (res: any) => {
        if (res.ok) {
          console.log('Fazenda excluída com sucesso:', id);
          this.exibirAlerta(res.mensagem, 'primary');
          this.obterFazendas(); // Atualiza a lista de fazendas
        } else {
          console.log('Falha ao excluir a Fazenda:', res.mensagem);
          this.mensagem('Erro ao excluir a Fazenda. Tente novamente!', 'danger');
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
