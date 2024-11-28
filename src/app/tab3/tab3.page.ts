import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController, MenuController  } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {


  tipo : any = "";
  insumType = "insumos";
  equipType = "equipamentos";

  fazendas: any[] = [];
  insumos: any = [];
  equipamentos: any = [];
  funcionarios : any = [];

  // listar insumos/equipamentos do proprietário
  insumosProprietario: any = [];
  equipamentosProprietario: any = [];
  // listar solicitações de insumos/equipamentos
  solicitacoesInsumos: any = [];
  solicitacoesEquipamentos: any = [];


  idUsuario = Number(sessionStorage.getItem('id'));
  usuarios: any = {};
  nome: string = "";
  email: string = "";
  telefone: string = "";
  idFazenda: any;

  // id do insumo/equipamento selecionado na lista
  idInsumo: any;
  idEquipamento: any;
  // id do insumo/equipamento gerado auto incremento
  insumoId: any;
  equipamentoId: any;

  quantidade = 0;
  valor = 0.0;
  isInsumoModalOpen = false;
  isEquipamentoModalOpen = false;

  constructor(
    private readonly router: Router,
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly menu: MenuController,
    private readonly alertController: AlertController
  ) {}

  ngOnInit() {
    this.atualizarDados();
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.carregarDados();
  }

    
  formatarData(data: string): string {
    return formatDate(data, 'dd/MM/yyyy HH:mm:ss', 'pt-BR');
  }

  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda);
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }

  getNomeFuncionario(idFuncionario: number | null): string {
    const funcionario = this.funcionarios.find((u: { idfuncionarios: number | null }) => u.idfuncionarios == idFuncionario);
    return funcionario ? funcionario.nome : 'Funcionário não encontrado';
  }

  getNomeInsumo(idInsumo: number | null): string {
    const insumo = this.insumos.find((i: { idinsumosCadastrados: number | null }) => i.idinsumosCadastrados == idInsumo);
    return insumo ? insumo.nome : 'Insumo não encontrado';
  }

  getNomeEquipamento(idEquipamento: number | null): string {
    const equipamento = this.equipamentos.find((e: { idequipamentosCadastrados: number | null }) => e.idequipamentosCadastrados == idEquipamento);
    return equipamento ? equipamento.nome : 'Equipamento não encontrado';
  }

  async carregarDados() {
    const loading = await this.loadingController.create({
      message: 'Carregando Dados...',
    });
    await loading.present();
    this.obterUsuario();
    this.obterInsumo();
    this.obterEquipamento();
    this.obterFazendas();
    this.obterFuncionarios();
    await loading.dismiss();
  }

  atualizarDados() {
    if (this.tipo == "1") {
      this.obterInsumo();
      this.obterProprietarioInsumos();
    }
    if (this.tipo == "2") {
      this.obterEquipamento();
      this.obterProprietarioEquipamentos();
    }
    if (this.tipo == "3") {
      this.obterFazendas();
      this.listarSolicInsumos();
    }
    if (this.tipo == "4") {
      this.obterFazendas();
      this.listarSolicEquipamentos();
    }
  }

  setInsumoModalOpen(isOpen: boolean) {
    this.isInsumoModalOpen = isOpen;
    if (!isOpen) this.limpar();
  }

  setEquipamentoModalOpen(isOpen: boolean) {
    this.isEquipamentoModalOpen = isOpen;
    if (!isOpen) this.limpar();
  }

  async obterInsumo() {
    try {
      const data = await this.provider.obterInsumos();
      this.insumos = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
      //
    }
  }

  async obterEquipamento() {
    try {
      const data = await this.provider.obterEquipamentos();
      this.equipamentos = (data.status === 'success' && data.equipamentos.length > 0) ? data.equipamentos : [];
    } catch (error) {
      // 
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
          // 
        }
      }
    } catch (error) {
      // 
    }
  }

  async obterFazendas() {
    try {
      const data = await this.provider.obterFazenda(this.idUsuario);
      this.fazendas = (data.status === 'success' && data.fazendas.length > 0) ? data.fazendas : [];
    } catch (error) {
      //
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
        this.setInsumoModalOpen(false);
      } else {
        this.exibirAlerta('Erro ao adicionar insumo', 'danger');
      }
    } catch (error) {
      this.exibirAlerta('Erro ao adicionar insumo', 'danger');
    }
  }

  async adicionarEquipamentos() {
    if (!this.idEquipamento || !this.idFazenda || this.quantidade <= 0 || this.valor <= 0) {
      this.exibirAlerta('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    try {
      const data = await this.provider.adicionarEquipamentos(this.quantidade, this.valor, this.idFazenda, this.idUsuario, this.idEquipamento);
      if (data.status === 'success') {
        this.exibirAlerta('Equipamento adicionado com sucesso', 'success');
        this.limpar();
        this.obterProprietarioEquipamentos();
        this.setEquipamentoModalOpen(false);
      } else {
        this.exibirAlerta('Erro ao adicionar equipamento', 'danger');
      }
    } catch (error) {
      this.exibirAlerta('Erro ao adicionar equipamento', 'danger');
    }
  }

  async obterProprietarioInsumos() {
    try {
      const data = await this.provider.obterInsumosProprietario(this.idUsuario);
      this.insumosProprietario = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
      //
    }
  }

  async obterProprietarioEquipamentos() {
    try {
      const data = await this.provider.obterEquipamentosProprietario(this.idUsuario);
      this.equipamentosProprietario = (data.status === 'success' && data.equipamentos.length > 0) ? data.equipamentos : [];
    } catch (error) {
      //
    }
  }

   async listarSolicInsumos() {
    try {
      const data = await this.provider.listarSolicitacoesInsumo(this.fazendas[0].idfazendas);
      this.solicitacoesInsumos = (data.status === 'success' && data.solicitacoes.length > 0) ? data.solicitacoes : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async obterFuncionarios() {
    try {
      const data = await this.provider.obterFuncionarios(this.idUsuario);
      this.funcionarios = (data.status === 'success' && data.funcionarios.length > 0) ? data.funcionarios : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar funcionários', 'danger');
    }
  }

  async listarSolicEquipamentos() {
    try {
      const data = await this.provider.listarSolicitacoesEquipamento(this.fazendas[0].idfazendas);
      this.solicitacoesEquipamentos = (data.status === 'success' && data.solicitacoes.length > 0) ? data.solicitacoes : [];
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
    this.setInsumoModalOpen(true);
  }

  async salvarInsumo() {
    if (this.insumoId) {
      try {
        const res = await this.provider.editarInsumo(this.quantidade, this.valor, this.insumoId, this.idFazenda, this.idUsuario, this.idInsumo);
        if (res.status === 'success') {
          this.exibirAlerta('Insumo atualizado com sucesso', 'success');
          this.limpar();
          this.obterProprietarioInsumos(); 
        } else {
          this.exibirAlerta('Erro ao atualizar insumo', 'danger');
        }
        this.setInsumoModalOpen(false);
      } catch (error) {
        this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    } else {
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
      this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    }
  }

  async editarEquipamento(id: number, quantidade:number, valor:number, idFazenda: number,idEquipamento:number) {
    
    this.quantidade = quantidade;
    this.valor = valor;
    this.equipamentoId = id;
    this.idFazenda = idFazenda;
    this.idEquipamento = idEquipamento;
    this.setEquipamentoModalOpen(true);
  }

  async salvarEquipamento() {
    if (this.equipamentoId) {
      try {
        const res = await this.provider.editarEquipamento(this.quantidade, this.valor,this.equipamentoId, this.idFazenda, this.idUsuario, this.idEquipamento);
        if (res.status === 'success') {
          this.exibirAlerta('Equipamento atualizado com sucesso', 'success');
          this.limpar();
          this.obterProprietarioEquipamentos(); 
        } else {
          this.exibirAlerta('Erro ao atualizar equipamento', 'danger');
        }
        this.setEquipamentoModalOpen(false);
      } catch (error) {
        this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    } else {
      this.adicionarEquipamentos();
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

  async confirmarSolicitacao(idSolicitacao: number, quantidade: number, valor: number, idFazenda: number, idusuario: number, idInsumoOuEquipamento: number, tipo: string) {

    const alert = await this.alertController.create({
      header: 'Aceitar Solicitação',
      message: 'Deseja realmente aceitar esta solicitação?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Aceitar', handler: () => this.aceitarSolicitacao( 
          idSolicitacao, quantidade, valor, idFazenda, idusuario, idInsumoOuEquipamento, tipo
         ) }
      ]
    });
    await alert.present();
  }

  async aceitarSolicitacao(idSolicitacao: number, quantidade: number, valor: number, idFazenda: number, idusuario: number, idInsumoOuEquipamento: number, tipo: string) {
  
  try {
    const data = await this.provider.aceitarSolicitacao(idSolicitacao, quantidade, valor, idFazenda, idusuario, idInsumoOuEquipamento, tipo);

    if (data.status === 'success') {
      this.exibirAlerta('Solicitação aceita com sucesso', 'success');
      if (tipo === 'insumo') {
        this.listarSolicInsumos();
      } else {
        this.listarSolicEquipamentos();
      }
    } else {
      this.exibirAlerta(data.message || 'Erro ao aceitar solicitação', 'danger');
    }

  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao conectar-se ao servidor. Tente novamente!';
    this.exibirAlerta(errorMessage, 'danger');
  }
}


  async confirmarRecusoDeSolicitacao(idInsumoOuEquipamento: number, tipo: string) {
    const alert = await this.alertController.create({
      header: 'Recusar Solicitação',
      message: 'Deseja realmente recusar esta solicitação?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Excluir', handler: () => this.recusarSolicitacao(idInsumoOuEquipamento, tipo) }
      ]
    });
    await alert.present();
  }

  async recusarSolicitacao(idInsumoOuEquipamento: number, tipo: string) {
    try {
      const data = await this.provider.recusarSolicitacao(idInsumoOuEquipamento);
      if (data.status === 'success') {
        this.exibirAlerta('Solicitação recusada com sucesso', 'success');
        if(tipo === 'insumo') {
          this.listarSolicInsumos();
        }
        else {
          this.listarSolicEquipamentos();
        }
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

  goConfiguration() {
    this.router.navigate(['/configuracoes']);
  }

  sair() {
    this.router.navigate(['/login']);
    sessionStorage.clear();
    console.log('Sessão encerrada PROPRIETÁRIO');
  }
}
