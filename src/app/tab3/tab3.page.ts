import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  fazendas: any[] = [];
  insumos: any = [];
  insumosProprietario: any = [];
  idUsuario = Number(sessionStorage.getItem('id'));
  usuarios: any = {};
  nome: string = "";
  email: string = "";
  telefone: string = "";
  idFazenda: any;
  idInsumo: any;
  insumoId: any;
  quantidade = 0;
  valor = 0.0;
  isModalOpen = false;

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private menu: MenuController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda);
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }

  getNomeInsumo(idInsumo: number | null): string {
    const insumo = this.insumos.find((i: { idinsumosCadastrados: number | null }) => i.idinsumosCadastrados == idInsumo);
    return insumo ? insumo.nome : 'Insumo não encontrado';
  }


  carregarDados() {
    this.obterUsuario();
    this.obterInsumo();
    this.obterFazendas();
    this.obterProprietarioInsumos();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async obterInsumo() {
    try {
      const data = await this.provider.obterInsumos();
      this.insumos = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async obterUsuario() {
    try {
      if (this.idUsuario) {
        const data = await this.provider.obterUsuario(this.idUsuario);
        if (data.status === 'success') {
          this.usuarios = data.usuario;
          this.nome = this.usuarios.nome;
          this.email = this.usuarios.email;
          this.telefone = this.usuarios.telefone;
        } else {
          this.exibirAlerta('Nenhum usuário encontrado', 'warning');
        }
      }
    } catch (error) {
      this.exibirAlerta('Erro ao carregar autenticação', 'danger');
    }
  }

  async obterFazendas() {
    try {
      const data = await this.provider.obterFazenda(this.idUsuario);
      this.fazendas = (data.status === 'success' && data.fazendas.length > 0) ? data.fazendas : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar fazendas', 'danger');
    }
  }

  async adicionarInsumos() {
    if (!this.idFazenda || !this.idInsumo || this.quantidade <= 0 || this.valor <= 0) {
      this.exibirAlerta('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    try {
      const data = await this.provider.adicionarInsumos(this.quantidade, this.valor, this.idFazenda, this.idUsuario, this.idInsumo);
      if (data.status === 'success') {
        this.exibirAlerta('Insumo adicionado com sucesso', 'success');
        this.limpar();
        this.obterProprietarioInsumos();
      } else {
        this.exibirAlerta('Erro ao adicionar insumo', 'danger');
      }
    } catch (error) {
      this.exibirAlerta('Erro ao adicionar insumo', 'danger');
    }
  }

  async obterProprietarioInsumos() {
    try {
      const data = await this.provider.obterInsumosProprietario(this.idUsuario);
      this.insumosProprietario = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async editarInsumo(id: number, quantidade: number, valor:number, idFazenda:number, idInsumo:number) {
    this.quantidade = quantidade;
    this.valor = valor;
    this.idFazenda = idFazenda;
    this.idInsumo = idInsumo;
    this.insumoId = id;
    this.setOpen(true);
  
  }

  async salvarInsumo() {
    
    if (this.insumoId) {
      console.log('Editando:', this.insumoId);
      this.provider.editarInsumo( this.quantidade, this.valor, this.insumoId, this.idFazenda, this.idUsuario, this.idInsumo).then(
        async (res: any) => {
          if (res.status === 'success') {
            this.exibirAlerta('Fazenda atualizada com sucesso', 'success');
            this.limpar();
            this.obterProprietarioInsumos();  // Atualiza a lista
          } else {
            this.exibirAlerta('Erro ao atualizar fazenda', 'danger');
          }
          this.setOpen(false); // Fecha o modal
        }
      ).catch((error) => {
        console.error('Erro ao editar fazenda:', error);
        this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      });
    } else {
      // Adicionar nova fazenda
      this.adicionarInsumos();
    }
  }
  

  async confirmarExclusaoInsumo(idInsumo: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Insumo',
      message: 'Deseja realmente excluir este insumo?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Excluir', handler: () => this.excluirInsumo(idInsumo) }
      ]
    });
    await alert.present();
  }

  async excluirInsumo(idInsumo: number) {
    try {
      const data = await this.provider.deletarInsumo(idInsumo);
      if (data.status === 'success') {
        this.exibirAlerta('Insumo excluído com sucesso', 'success');
        this.obterProprietarioInsumos();
      } else {
        this.exibirAlerta('Erro ao excluir insumo', 'danger');
      }
    } catch (error) {
      this.exibirAlerta('Erro ao excluir insumo', 'danger');
    }
  }

  limpar() {
    this.quantidade = 0;
    this.valor = 0.0;
    this.idFazenda = null;
    this.idInsumo = null;
    this.insumoId = null;
  }

  async exibirAlerta(mensagem: string, cor: string) {
    const alert = await this.alertController.create({
      header: cor === 'danger' ? 'Erro' : 'Sucesso',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  fecharMenu() {
    this.menu.close();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  sair() {
    this.router.navigate(['/login']);
    sessionStorage.clear();
    console.log('Sessão encerrada PROPRIETÁRIO');
  }
}
