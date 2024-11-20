import { cepMask } from './../masks';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
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
  idFazenda: number | null = null;

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
      message: 'Carregando Fazendas...',
    });
    await loading.present();
    this.obterFazendas();
    await loading.dismiss();
  }

  ionViewWillEnter() {
    this.obterFazendas();
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    if (!isOpen) this.limpar();
    this.isModalOpen = isOpen;
  }

  async obterFazendas() {
    this.provider.obterFazenda(this.id).then(async (data: any) => {
      if (data.status === 'success' && data.fazendas.length > 0) {
        this.fazendas = data.fazendas;
      } else {
        this.fazendas = [];
      }
    }).catch(async (error) => {
      this.mensagem('Erro ao carregar fazendas', 'danger');
    });
  }


  editarFazenda(nome: any, cep: any, endereco: any, valor: number, idFazenda: number) {
    this.nome = nome;
    this.cep = cep;
    this.endereco = endereco;
    this.valor = valor;
    this.idFazenda = idFazenda;

    this.setOpen(true);
  }


  async salvarFazenda() {
    if (this.idFazenda) {
      this.provider.editarFazenda(this.nome, this.cep, this.endereco, this.valor, this.idFazenda).then(
        async (res: any) => {
          if (res.status === 'success') {
            this.exibirAlerta('Fazenda atualizada com sucesso', 'success');
            this.limpar();
            this.obterFazendas();
          } else {
            this.exibirAlerta('Erro ao atualizar fazenda', 'danger');
          }
          this.setOpen(false);
        }
      ).catch((error) => {
        console.error('Erro ao editar fazenda:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      });
    } else {
      this.adicionarFazenda();
    }
  }

  async adicionarFazenda() {
    if (!this.nome || !this.cep || !this.endereco) {
      this.presentToast();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adicionando fazenda...',
    });
    await loading.present();

    this.provider.addFazenda(this.nome, this.cep, this.endereco, this.valor, this.id).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status === 'success' || res.ok) {
          this.exibirAlerta('Fazenda adicionada com sucesso!', 'success');
          this.limpar();
          this.setOpen(false);
          this.obterFazendas();
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
    this.idFazenda = null;
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

    setTimeout(() => {
      alert.dismiss();
    }, 500);
  }


  async confirmarExclusaofazenda(idfazendas: number) {

    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir esta fazenda? Todos os dados serão perdidos. Inclusive funcionários e insumos relacionados a ela.',
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
            this.excluirfazenda(idfazendas);
          }
        }
      ]
    });

    await alert.present();
  }


  excluirfazenda(idfazendas: number) {
    if (!idfazendas) {
      this.mensagem('ID inválido', 'danger');
      return;
    }

    this.provider.deletarFazenda(idfazendas).then(
      async (res: any) => {
        if (res && res.status === 'success') {
          this.exibirAlerta('Fazenda excluída com sucesso!', 'success');
          this.obterFazendas();
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
