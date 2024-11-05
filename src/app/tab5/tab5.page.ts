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
  equipType = "equipamentos"
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
  solicitacoesEquipamentos: any = [];

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
  solicitacaoId: any;
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
      this.listarSolicEquipamentos();
      // this.obterProprietarioEquipamentos();
    }
  }

  setSolicInsumoModalOpen(isOpen: boolean) {
    this.isSolicInsumoModalOpen = isOpen;
    if (!isOpen) this.limpar(); 
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
        this.listarSolicInsumos();
        this.setSolicInsumoModalOpen(false);
      } else {
        this.exibirAlerta(data.console.error(), 'danger');
      }
    } catch (error) {
      this.exibirAlerta(String(error), 'danger');
    }
  }

  async solicitarEquipamentos() {
    console.log(this.quantidade, this.valor, this.idFuncionario, this.idFazenda, this.funcionarios.fazendas_usuarios_idusuarios, this.equipType, this.idEquipamento);
    if (!this.idFazenda || !this.idEquipamento || this.quantidade <= 0 || this.valor <= 0) {
      this.exibirAlerta('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    try {
      const data = await this.provider.solicitarEquipamentos(this.quantidade, this.valor, this.idFuncionario, this.idFazenda, this.funcionarios.fazendas_usuarios_idusuarios, this.equipType, this.idEquipamento);
      if (data.status === 'success') {
        this.exibirAlerta('Solicitação adicionada com sucesso', 'success');
        this.limpar();
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

  async listarSolicEquipamentos() {
    console.log(this.fazendas.length > 0 ? this.fazendas[0].idfazendas : 'No fazendas available');
    try {
      const data = await this.provider.listarSolicitacoesEquipamento(this.fazendas[0].idfazendas);
      this.solicitacoesEquipamentos = (data.status === 'success' && data.solicitacoes.length > 0) ? data.solicitacoes : [];
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

  async editarSolicitacaoInsumo(quantidade: number, valor: number, idFazenda: number, idFuncionario:number ,idInsumo: number, idSolicitacao: number) {
    this.quantidade = quantidade;
    this.valor = valor;
    this.idFazenda = idFazenda;
    this.idFuncionario = idFuncionario;
    this.idInsumo = idInsumo;
    this.solicitacaoId = idSolicitacao;
    this.setSolicInsumoModalOpen(true);
  }

  async editarSolicitacaoEquipamento(quantidade: number, valor: number, idFazenda: number, idFuncionario:number ,idEquipamento: number, idSolicitacao: number) {
    this.quantidade = quantidade;
    this.valor = valor;
    this.idFazenda = idFazenda;
    this.idFuncionario = idFuncionario;
    this.idEquipamento = idEquipamento;
    this.solicitacaoId = idSolicitacao;
    this.setSolicEquipamentoModalOpen(true);
  }

  async salvarInsumo() {
    if (this.solicitacaoId) {
      try {
        const res = await this.provider.editarSolicitacaoInsumo(this.quantidade, this.valor, this.idFazenda, this.idFuncionario, this.idInsumo, this.solicitacaoId);
        if (res.status === 'success') {
          this.exibirAlerta('Solicitação atualizada com sucesso', 'success');
          this.limpar();
          this.listarSolicInsumos()
        } else {
          this.exibirAlerta('Erro ao atualizar solicitação', 'danger');
        }
        this.setSolicInsumoModalOpen(false);
      } catch (error) {
        this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    } else {
      this.solicitarInsumos();
    }
  }

  async confirmarExclusaoSolicInsumo(idSolicitacao: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Solicitação de Insumo',
      message: 'Deseja realmente excluir esta solicitação??',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Excluir', handler: () => this.excluirInsumo(idSolicitacao) }
      ]
    });
    await alert.present();
  }

  async excluirInsumo(idSolicitacao: number) {
    try {
      const data = await this.provider.excluirSolicitacaoInsumo(idSolicitacao);
      if (data.status === 'success') {
        this.exibirAlerta('Solicitação excluída com sucesso', 'success');
        this.listarSolicInsumos();
      } else {
        this.exibirAlerta('Erro ao excluir solicitação', 'danger');
      }
    } catch (error) {
      this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    }
  }

  async salvarEquipamento() {
    if (this.equipamentoId) {
      try {
        const res = await this.provider.editarSolicitacaoEquipamento(
          this.quantidade,
          this.valor,
          this.idFazenda,
          this.idFuncionario,
          this.idEquipamento,
          this.equipamentoId
        );
        if (res.status === 'success') {
          this.exibirAlerta('Equipamento atualizado com sucesso', 'success');
          this.limpar();
          this.obterProprietarioEquipamentos(); 
        } else {
          this.exibirAlerta('Erro ao atualizar equipamento', 'danger');
        }
        this.setSolicEquipamentoModalOpen(false);
      } catch (error) {
        this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    } else {
      this.solicitarEquipamentos();
    }
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
    this.solicitacaoId = null;
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
