import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {


  fazendas: any[] = [];
  insumos : any = {};
  insumosProprietario: any = {};
  idUsuario = Number(sessionStorage.getItem('id'));
  usuarios: any = {};
  nome : any = "";
  email : any = "";
  telefone : any = "";
  idFazenda: any;
  idInsumo: any;

  quantidade = 0;
  valor = 0.0;


  constructor(
    private router: Router,
    private provider:ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.obterUsuario();
    this.obterInsumo();
    this.obterFazendas();
    this.obterProprietarioInsumos();
  }

  ionViewWillEnter() {
    this.obterUsuario();
    this.obterInsumo();
    this.obterFazendas();
    this.obterProprietarioInsumos();
  }

  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda);
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }

  getNomeInsumo(idInsumo: number | null): string {
    const insumo = this.insumos.find((i: { idinsumosCadastrados: number | null }) => i.idinsumosCadastrados == idInsumo);
    return insumo ? insumo.nome : 'Insumo não encontrado';
  }
  
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async obterInsumo(){
    // const loading = await this.loadingController.create({
    //   message: 'Carregando insumos...',
    // });
    // await loading.present();
    this.provider.obterInsumos().then(async (data: any) => {
      // await loading.dismiss();
      if (data.status === 'success' && data.insumos.length > 0) {
        this.insumos = data.insumos;
      }
      else {
        this.insumos = [];
      }
    }).catch(async (error) => {
      // await loading.dismiss();
      this.mensagem('Erro ao carregar insumos', 'danger');
    });
  }

  async obterUsuario() {
    // const loading = await this.loadingController.create({
    //   message: 'Carregando dados ...',
    // });
    // await loading.present();
    const email = sessionStorage.getItem('email');
  
    if (this.idUsuario) {
      this.provider.obterUsuario(this.idUsuario).then(
        async (data: any) => {
          // Verifica se o status da resposta é 'success'
          if (data.status === 'success') {
            this.usuarios = data.usuario; // Acessa os dados do usuário corretamente
            this.nome = this.usuarios.nome;
            this.email = this.usuarios.email;
            this.telefone = this.usuarios.telefone;
          } else {
            this.mensagem('Nenhum usuário encontrado', 'warning');
          }
          // await loading.dismiss();
        }).catch(async (error) => {
          // await loading.dismiss();
          this.mensagem('Erro ao carregar autenticação', 'danger');
        });
    }
  }

  async obterFazendas() {
    // const loading = await this.loadingController.create({
    //   message: 'Carregando Fazendas...',
    // });
    // await loading.present();

    this.provider.obterFazenda(this.idUsuario).then(async (data: any) => {
      // await loading.dismiss();
      if (data.status === 'success' && data.fazendas.length > 0) { // Verifica o status e se há fazendas
        this.fazendas = data.fazendas;
      } else {
        this.fazendas = [];
      }
    }).catch(async (error) => {
      // await loading.dismiss();
      this.mensagem('Erro ao carregar fazendas', 'danger');
    });
  }

  adicionarInsumos() {
    console.log(this.quantidade, this.valor, this.idFazenda, this.idUsuario, this.idInsumo)
    this.provider.adicionarInsumos(this.quantidade, this.valor, this.idFazenda, this.idUsuario, this.idInsumo).then(
      async (data: any) => {
        if (data.status === 'success') {
          this.mensagem('Insumo adicionado com sucesso', 'success');
          this.limpar();
        } else {
          this.mensagem('Erro ao adicionar ele', 'danger');
          console.log(data.status);
        }
      }
    ).catch(async (error) => {
      this.mensagem('Erro ao adicionar insumo', 'danger');
    });
  }

  async obterProprietarioInsumos() {
    const loading = await this.loadingController.create({
      message: 'Carregando Fazendas...',
    });
    await loading.present();
    this.provider.obterInsumosProprietario(this.idUsuario).then(
      async (data: any) => {
        if (data.status === 'success' && data.insumos.length > 0) {
          this.insumosProprietario = data.insumos;
          await loading.dismiss();
        } else {
          this.insumosProprietario = [];
          await loading.dismiss();
        }
      }
    ).catch(async (error) => {
      this.mensagem('Erro ao carregar insumos', 'danger');
      await loading.dismiss();
    });
  }

  limpar() {
    this.quantidade = 0;
    this.valor = 0.0;
    this.idFazenda = null;
    this.idInsumo = null;
  }
  

  fecharMenu() {
    this.menu.close();
  }

  async mensagem(mensagem:any, cor:string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  sair() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('perfil');
    sessionStorage.clear();
    console.log('Sessão encerrada PROPRIETÁRIO');
  }

}
