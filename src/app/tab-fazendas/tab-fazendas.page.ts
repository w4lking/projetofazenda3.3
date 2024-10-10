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

  fazendas: any[] = [];
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
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async obterFazendas() {
    const loading = await this.loadingController.create({
      message: 'Carregando usuários...',
    });
    await loading.present();

    this.provider.obterFazenda(this.id).then(async (data: any) => {
      await loading.dismiss();
      if (data.status === 'success' && data.fazendas.length > 0) { // Verifica o status e se há fazendas
          this.fazendas = data.fazendas; // Atribui os dados retornados diretamente
      } else {
          this.mensagem('Nenhuma fazenda encontrada', 'danger');
      }
    }).catch(async (error) => {
      await loading.dismiss();
      this.mensagem('Erro ao carregar fazendas', 'danger');
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
    if (!this.nome || !this.cep || !this.endereco) {
        this.presentToast();
        return; // Adicionando retorno para evitar execução adicional
    }

    const loading = await this.loadingController.create({
        message: 'Adicionando fazenda...',
    });
    await loading.present();

    this.provider.addFazenda(this.nome, this.cep, this.endereco, this.valor, this.id).then(
        async (res: any) => {
            await loading.dismiss();
            if (res.status === 'success') {
                this.exibirAlerta('Fazenda adicionada com sucesso!', 'success');
                this.limpar();
                this.obterFazendas(); // Atualiza a lista
            } else {
                this.mensagem('Erro ao adicionar fazenda. Tente novamente!', 'danger');
            }
        }
    ).catch(async (error) => {
        await loading.dismiss();
        console.error('Erro na requisição ao adicionar fazenda:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    });
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
  async confirmarExclusaofazenda(idfazendas: number) {
  
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
            this.excluirfazenda(idfazendas); // Chama a função de exclusão se o usuário confirmar
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  // Função de exclusão
  excluirfazenda(idfazendas: number) {
    console.log('ID da Fazenda: ', idfazendas, 'Tipo do ID: ', typeof idfazendas);

    if (!idfazendas) {
        this.mensagem('ID inválido', 'danger');
        return;
    }

    this.provider.deletarFazenda(idfazendas).then(
        async (res: any) => {
            console.log('Resposta completa da API:', res); // Log detalhado para verificar o que está vindo da API

            // Certifique-se de que o res.status realmente está sendo recebido e verificado corretamente
            if (res && res.status === 'success') {
                console.log('Fazenda excluída com sucesso:', idfazendas);
                this.exibirAlerta('Fazenda excluída com sucesso!', 'success');
                this.obterFazendas(); // Atualiza a lista de fazendas
            } else {
                console.error('Erro ao excluir a fazenda, resposta:', res);
                this.mensagem('Erro ao excluir a Fazenda: ' + (res?.message || 'Resposta não recebida'), 'danger');
            }
        }
    ).catch((error) => {
        console.error('Erro na requisição ao excluir fazenda:', error);
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
