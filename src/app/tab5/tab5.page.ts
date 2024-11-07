import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

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

  nomeInsumo: string = '';
  nomeEquipamento: string = '';
  type: string = '';


  //arrays para pegar os dados das fazendas, insumos e equipamentos
  fazendas: any[] = [];
  insumos: any = [];
  equipamentos: any = [];

  idTab:any;

  //
  insumosfazendas: any = [];
  equipamentosfazendas: any = [];

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

  //
  idUsuario: any;
  quantidadeConsumida: any;
  valorConsumo: any;
  idFazendaConsumo: any;
  idInsumoOrEquipamentoConsumo: any;
  custo : any = 0.0;

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

  ModalConsumo = false;


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

  formatarData(data: string): string {
    return formatDate(data, 'dd/MM/yyyy HH:mm:ss', 'pt-BR');
  }

  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda);
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }

  // getNomeFuncionario(idFuncionario: number | null): string {
  //   const funcionario = this.funcionarios.find((f: { idfuncionarios: number | null }) => f.idfuncionarios == idFuncionario);
  //   return funcionario ? funcionario.nome : 'Funcionário não encontrado';
  // }

  getNomeInsumo(idInsumo: number | null): string {
    const insumo = this.insumos.find((i: { idinsumosCadastrados: number | null }) => i.idinsumosCadastrados == idInsumo);
    return insumo ? insumo.nome : 'Insumo não encontrado';
  }

  getNomeEquipamento(idEquipamento: number | null): string {
    const equipamento = this.equipamentos.find((e: { idequipamentosCadastrados: number | null }) => e.idequipamentosCadastrados == idEquipamento);
    return equipamento ? equipamento.nome : 'Equipamento não encontrado';
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
    }
    if (this.tipo == "2") {
      this.listarSolicEquipamentos();
    }
    if (this.tipo == "3") {
      this.obterInsumosFazenda();
    }
    if (this.tipo == "4") {
      this.obterEquipamentosFazenda();
    }
  }

  setSolicInsumoModalOpen(isOpen: boolean) {
    this.isSolicInsumoModalOpen = isOpen;
    if (!isOpen) this.limpar();
  }


  setModalConsumoOpen(isOpen: boolean) {
    this.ModalConsumo = isOpen;
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
        this.listarSolicEquipamentos();
        this.setSolicEquipamentoModalOpen(false);
      } else {
        this.exibirAlerta(data.console.error(), 'danger');
      }
    } catch (error) {
      this.exibirAlerta(String(error), 'danger');
    }
  }

  async listarSolicInsumos() {
    try {
      const data = await this.provider.listarSolicitacoesInsumo(this.fazendas[0].idfazendas);
      this.solicitacoesInsumos = (data.status === 'success' && data.solicitacoes.length > 0) ? data.solicitacoes : [];
    } catch (error) {
      // this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async listarSolicEquipamentos() {
    try {
      const data = await this.provider.listarSolicitacoesEquipamento(this.fazendas[0].idfazendas);
      this.solicitacoesEquipamentos = (data.status === 'success' && data.solicitacoes.length > 0) ? data.solicitacoes : [];
    } catch (error) {
      // this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }


  async obterInsumosFazenda() {
    try {
      const data = await this.provider.obterInsumosProprietario(this.funcionarios.fazendas_usuarios_idusuarios);
      this.insumosfazendas = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
      // this.exibirAlerta('Erro ao carregar insumos', 'danger');
    }
  }

  async obterEquipamentosFazenda() {
    try {
      const data = await this.provider.obterEquipamentosProprietario(this.funcionarios.fazendas_usuarios_idusuarios);
      this.equipamentosfazendas = (data.status === 'success' && data.equipamentos.length > 0) ? data.equipamentos : [];
    } catch (error) {
      // this.exibirAlerta('Erro ao carregar equipamentos', 'danger');
    }
  }


  async editarSolicitacaoInsumo(quantidade: number, valor: number, idFazenda: number, idFuncionario: number, idInsumo: number, idSolicitacao: number) {
    this.quantidade = quantidade;
    this.valor = valor;
    this.idFazenda = idFazenda;
    this.idFuncionario = idFuncionario;
    this.idInsumo = idInsumo;
    this.solicitacaoId = idSolicitacao;
    this.setSolicInsumoModalOpen(true);
  }

  setModalConsumo(isOpen: boolean, id:number = 0 ,quantidade: number = 0, valor: number = 0, idFazenda: number = 0, idUsuario: number = 0, idInsumoOrEquipamento: number = 0, type: string = '') {
    this.ModalConsumo = isOpen;

    if (isOpen) {
        this.idTab = id;
        this.quantidade = quantidade;
        this.valor = valor;
        this.idFazenda = idFazenda;
        this.idUsuario = idUsuario;
        this.idInsumoOrEquipamentoConsumo = idInsumoOrEquipamento;
        this.type = type;

        if (type === 'equipamentos') {
            this.nomeEquipamento = this.getNomeEquipamento(idInsumoOrEquipamento);
            this.nomeInsumo = ''; // Limpar o nome do insumo
        } else if (type === 'insumos') {
            this.nomeInsumo = this.getNomeInsumo(idInsumoOrEquipamento);
            this.nomeEquipamento = ''; // Limpar o nome do equipamento
        }
    }
}

  async salvarConsumo() {

    if (!this.quantidadeConsumida || !this.valor || !this.idFazenda || !this.idFuncionario || !this.idUsuario || !this.idInsumoOrEquipamentoConsumo) {
      this.Alerta('Digite a quantidade a ser consumida', 'danger');
      return;
    }

    if (this.quantidadeConsumida <= 0) {
      this.Alerta('A quantidade a ser consumida deve ser maior que zero!', 'danger');
      return;
    }
    else if (this.quantidadeConsumida > this.quantidade) {
      this.Alerta('A quantidade consumida não pode ser maior que a quantidade em estoque!', 'danger');
      return;
    }
    this.quantidade = this.quantidade - this.quantidadeConsumida;
    this.custo = this.quantidadeConsumida * this.valor;
    try {
      const res = await this.provider.salvarConsumo(this.idTab, this.quantidadeConsumida, this.valor, this.quantidade, this.custo ,this.idFazenda, this.idFuncionario ,this.idUsuario, this.idInsumoOrEquipamentoConsumo, this.type);
      if (res.status === 'success') {
        this.exibirAlerta('Consumo registrado com sucesso', 'success');
        this.atualizarDados();
        this.limparConsumo();
      } else {
        this.exibirAlerta('Erro ao registrar consumo', 'danger');
      }
      this.setModalConsumo(false);  // Fecha o modal após salvar
    } catch (error) {
      this.exibirAlerta('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
    }
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

  async editarSolicitacaoEquipamento(quantidade: number, valor: number, idFazenda: number, idFuncionario: number, idEquipamento: number, idSolicitacao: number) {
    this.quantidade = quantidade;
    this.valor = valor;
    this.idFazenda = idFazenda;
    this.idFuncionario = idFuncionario;
    this.solicitacaoId = idSolicitacao;
    this.idEquipamento = idEquipamento;
    this.setSolicEquipamentoModalOpen(true);
  }

  async salvarEquipamento() {
    if (this.solicitacaoId) {
      try {
        const res = await this.provider.editarSolicitacaoEquipamento(
          this.quantidade,
          this.valor,
          this.idFazenda,
          this.idFuncionario,
          this.idEquipamento,
          this.solicitacaoId
        );
        if (res.status === 'success') {
          this.exibirAlerta('Equipamento atualizado com sucesso', 'success');
          this.limpar();
          this.listarSolicEquipamentos();
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

  async confirmarExclusaoEquipamento(idSolicitacao: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Solicitação de Equipamento',
      message: 'Deseja realmente excluir esta solicitação?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Excluir', handler: () => this.excluirEquipamento(idSolicitacao) }
      ]
    });
    await alert.present();
  }

  async excluirEquipamento(idSolicitacao: number) {
    try {
      const data = await this.provider.excluirSolicitacaoEquipamento(idSolicitacao);
      if (data.status === 'success') {
        this.exibirAlerta('Equipamento excluído com sucesso', 'success');
        this.listarSolicEquipamentos();
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

  limparConsumo() {
    this.quantidadeConsumida = 0;
    this.valorConsumo = 0.0;
    this.idFazendaConsumo = null;
    this.idInsumoOrEquipamentoConsumo = null;
  }


  async exibirAlerta(mensagem: string, cor: string, segundos: number = 3, titulo: string = '') {
    const alert = await this.alertController.create({
      header: titulo || (cor === 'danger' ? 'Erro' : 'Sucesso'),
      message: mensagem,
      cssClass: cor,
      backdropDismiss: false, // Impede que o usuário feche o alerta clicando fora dele
    });

    await alert.present();

    // Fechar automaticamente após o tempo especificado (em milissegundos)
    setTimeout(() => {
      alert.dismiss();
    }, 1000);
  }

  async Alerta(mensagem: string, cor: string) {
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
    console.log('Sessão encerrada Funcionário');
  }

}
