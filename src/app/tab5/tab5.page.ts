import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  tipo: any = "";
  insumType = "insumos"
  idFuncionario = Number(sessionStorage.getItem('id'));
  idFarm: any;
  fazendas: any[] = [];
  insumos: any = [];
  equipamentos: any = [];

  //
  insumosProprietario: any = [];
  equipamentosProprietario: any = [];

  //arrays de solicitações 
  solicitacoesInsumos: any = [];

  //
  funcionarios: any = {};
  nome: string = "";
  email: string = "";
  telefone: string = "";
  idFazenda: any;
  nomeFazenda: string = "";

  // id do insumo/equipamento selecionado na lista
  idInsumo: any;
  idEquipamento: any;
  // id do insumo/equipamento gerado auto incremento
  insumoId: any;
  equipamentoId: any;

  quantidade = 0;
  valor = 0.0;
  isSolicInsumoModalOpen = false;
  isSolicEquipamentoModalOpen = false;

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private menu: MenuController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.atualizarDados();
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.atualizarDados();
    this.carregarDados();
  }


  async carregarDados() {
    this.obterUsuario();
    const loading = await this.loadingController.create({
      message: 'Carregando Dados...',
    });
    await loading.present();
    this.obterInsumo();
    this.obterEquipamento();
    await loading.dismiss();
    this.obterFazendas();
  }

  atualizarDados() {
    if (this.tipo == "1") {
      this.listarSolicInsumos();
      // this.obterProprietarioInsumos();
    }
    if (this.tipo == "2") {
      this.obterEquipamento();
      // this.obterProprietarioEquipamentos();
    }
  }

  setSolicInsumoModalOpen(isOpen: boolean) {
    this.isSolicInsumoModalOpen = isOpen;
    if (!isOpen) this.limpar(); // Limpa campos ao fechar o modal
  }

  setSolicEquipamentoModalOpen(isOpen: boolean) {
    this.isSolicEquipamentoModalOpen = isOpen;
    if (!isOpen) this.limpar(); // Limpa campos ao fechar o modal
  }

  async obterInsumo() {
    try {
      const data = await this.provider.obterInsumos();
      this.insumos = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
      // this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async obterEquipamento() {
    try {
      const data = await this.provider.obterEquipamentos();
      this.equipamentos = (data.status === 'success' && data.equipamentos.length > 0) ? data.equipamentos : [];
    } catch (error) {
      // this.exibirAlerta('Erro ao carregar equipamentos', 'danger');
    }
  }

  async obterUsuario() {
    try {
      if (this.idFuncionario) {
        const data = await this.provider.obterFuncionario(this.idFuncionario);
        if (data.status === 'success') {
          this.funcionarios = data.usuario;
          this.idFarm = this.funcionarios.fazendas_idfazendas; 
          this.nome = this.funcionarios.nome;
          this.email = this.funcionarios.email;
          this.telefone = this.funcionarios.telefone;
        } else {
          // Exibir alerta caso não encontre o usuário
          this.exibirAlerta('Nenhum usuário encontrado', 'warning');
        }
      }
    } catch (error) {
      // Exibir alerta em caso de erro
      this.exibirAlerta('Erro ao carregar autenticação', 'danger');
    }
  }


  async obterFazendas() {
    try {
      const data = await this.provider.obterFazendaFuncionario(this.idFarm);
      this.fazendas = (data.status === 'success' && data.fazendas.length > 0) ? data.fazendas : [];

      if (this.fazendas.length > 0) {
        this.nomeFazenda = this.fazendas[0].nome;
      }
    } catch (error) {
      this.exibirAlerta('Erro ao carregar fazendas', 'danger');
    }
  }

 // tudo enviando certinho, Fazer funcionar amanhã
  async solicitarInsumos() {
    console.log(this.quantidade, this.valor, this.idFuncionario, this.idFazenda, this.funcionarios.fazendas_usuarios_idusuarios, this.insumType, this.idInsumo);
    if (!this.idFazenda || !this.idInsumo || this.quantidade <= 0 || this.valor <= 0) {
      this.exibirAlerta('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    try {
      const data = await this.provider.solicitarInsumo(this.quantidade, this.valor, this.idFuncionario, this.idFazenda, this.funcionarios.fazendas_usuarios_idusuarios, this.insumType, this.idInsumo);
      if (data.status === 'success') {
        this.exibirAlerta('Solicitação adicionada com sucesso', 'success');
        this.limpar();
        this.obterProprietarioInsumos();
        this.setSolicInsumoModalOpen(false);
      } else {
        this.exibirAlerta(data.console.error(), 'danger');
      }
    } catch (error) {
      this.exibirAlerta(String(error), 'danger');
    }
  }

  async listarSolicInsumos() {
    console.log(this.fazendas.length > 0 ? this.fazendas[0].idfazendas : 'No fazendas available');
    try {
      const data = await this.provider.listarSolicitacoesInsumo(this.fazendas[0].idfazendas);
      this.solicitacoesInsumos = (data.status === 'success' && data.solicitacoes.length > 0) ? data.solicitacoes : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async adicionarEquipamentos() {
    // if (!this.idEquipamento || !this.idFazenda) {
    //   this.exibirAlerta('Preencha todos os campos obrigatórios!', 'warning');
    //   return;
    // }

    // try {
    //   const data = await this.provider.adicionarEquipamentos(this.quantidade, this.valor, this.idFazenda, this.idUsuario, this.idEquipamento);
    //   if (data.status === 'success') {
    //     this.exibirAlerta('Equipamento adicionado com sucesso', 'success');
    //     this.limpar();
    //     this.obterProprietarioEquipamentos();
    //     this.setEquipamentoModalOpen(false);
    //   } else {
    //     this.exibirAlerta('Erro ao adicionar equipamento', 'danger');
    //   }
    // } catch (error) {
    //   this.exibirAlerta('Erro ao adicionar equipamento', 'danger');
    // }
  }

  async obterProprietarioInsumos() {
    // try {
    //   const data = await this.provider.obterInsumosProprietario(this.idUsuario);
    //   this.insumosProprietario = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    // } catch (error) {
    //   // this.exibirAlerta('Erro ao carregar insumos', 'danger');
    // }
  }

  async obterProprietarioEquipamentos() {
    // try {
    //   const data = await this.provider.obterEquipamentosProprietario(this.idUsuario);
    //   this.equipamentosProprietario = (data.status === 'success' && data.equipamentos.length > 0) ? data.equipamentos : [];
    // } catch (error) {
    //   // this.exibirAlerta('Erro ao carregar equipamentos', 'danger');
    // }
  }

  async editarInsumo(id: number, quantidade: number, valor: number, idFazenda: number, idInsumo: number) {
    // this.quantidade = quantidade;
    // this.valor = valor;
    // this.idFazenda = idFazenda;
    // this.idInsumo = idInsumo;
    // this.insumoId = id;
    // this.setInsumoModalOpen(true);
  }

  async salvarInsumo() {
    if (this.insumoId) {
      try {
        const res = await this.provider.editarInsumo(this.quantidade, this.valor, this.insumoId, this.idFazenda, this.idFuncionario, this.idInsumo);
        if (res.status === 'success') {
          this.exibirAlerta('Insumo atualizado com sucesso', 'success');
          this.limpar();
          this.obterProprietarioInsumos(); 
        } else {
          this.exibirAlerta('Erro ao atualizar insumo', 'danger');
        }
        this.setSolicInsumoModalOpen(false);
      } catch (error) {
        this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    } else {
      this.solicitarInsumos();
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
      this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    }
  }

  async editarEquipamento(id: number, quantidade: number, valor: number, idFazenda: number, idEquipamento: number) {

    this.quantidade = quantidade;
    this.valor = valor;
    // this.equipamentoId = id;
    // this.idFazenda = idFazenda;
    // this.idEquipamento = idEquipamento;
    this.setSolicEquipamentoModalOpen(true);
  }

  async salvarEquipamento() {
    // if (this.equipamentoId) {
    //   try {
    //     const res = await this.provider.editarEquipamento();
    //     if (res.status === 'success') {
    //       this.exibirAlerta('Equipamento atualizado com sucesso', 'success');
    //       this.limpar();
    //       this.obterProprietarioEquipamentos(); 
    //     } else {
    //       this.exibirAlerta('Erro ao atualizar equipamento', 'danger');
    //     }
    //     this.setEquipamentoModalOpen(false);
    //   } catch (error) {
    //     this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    //   }
    // } else {
    //   this.adicionarEquipamentos();
    // }
  }

  async confirmarExclusaoEquipamento(idEquipamento: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Equipamento',
      message: 'Deseja realmente excluir este equipamento?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Excluir', handler: () => this.excluirEquipamento(idEquipamento) }
      ]
    });
    await alert.present();
  }

  async excluirEquipamento(idEquipamento: number) {
    try {
      const data = await this.provider.deletarEquipamento(idEquipamento);
      if (data.status === 'success') {
        this.exibirAlerta('Equipamento excluído com sucesso', 'success');
        this.obterProprietarioEquipamentos();
      } else {
        this.exibirAlerta('Erro ao excluir equipamento', 'danger');
      }
    } catch (error) {
      this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    }
  }



  limpar() {
    this.quantidade = 0;
    this.valor = 0.0;
    this.idFazenda = null;
    this.idInsumo = null;
    this.idEquipamento = null;
    this.insumoId = null;
    this.equipamentoId = null;
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
    console.log('Sessão encerrada Funcionário');
  }

}