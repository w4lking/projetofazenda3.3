import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tab-registro',
  templateUrl: './tab-registro.page.html',
  styleUrls: ['./tab-registro.page.scss'],
})
export class TabRegistroPage implements OnInit {
  consumos: any[] = [];
  insumos: any = [];
  equipamentos: any = [];
  fazendas: any = [];
  funcionarios: any = [];

  tipo: any = 'insumos';


  idUsuario = Number(sessionStorage.getItem('id'));
  perfil = sessionStorage.getItem('perfil');

  idFarm: any;
  nomeFazenda: string = '';
  nomeFuncionario: string = '';

  constructor(
    private readonly provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private readonly alertController: AlertController
  ) { }

  ngOnInit() {
    this.obterFuncionario();
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.obterFuncionario();
    this.carregarDados();
  }

  carregarDados() {
    this.obterInsumo();
    this.obterEquipamento();
  }

  get consumosFiltrados() {
    return this.consumos.filter(consumo => consumo.tipo === this.tipo);
  }

  getNomeInsumo(idInsumo: number | null): string {
    const insumo = this.insumos.find((i: { idinsumosCadastrados: number | null }) => i.idinsumosCadastrados == idInsumo);
    return insumo ? insumo.nome : 'Insumo não encontrado';
  }

  getNomeFuncionario(idFuncionario: number | null): string {
    const funcionario = this.funcionarios.find((f: { idfuncionarios: number | null }) => f.idfuncionarios == idFuncionario);
    return funcionario ? funcionario.nome : 'Funcionário não encontrado';
  }

  getNomeEquipamento(idEquipamento: number | null): string {
    const equipamento = this.equipamentos.find((e: { idequipamentosCadastrados: number | null }) => e.idequipamentosCadastrados == idEquipamento);
    return equipamento ? equipamento.nome : 'Equipamento não encontrado';
  }

  getNomeFazenda(idFazenda: number | null): string {
    const fazenda = this.fazendas.find((f: { idfazendas: number | null }) => f.idfazendas == idFazenda);
    return fazenda ? fazenda.nome : 'Fazenda não encontrada';
  }


  formatarData(data: string): string {
    return formatDate(data, 'dd/MM/yyyy HH:mm:ss', 'pt-BR');
  }

  async obterFuncionario() {
    try {
      const data = await this.provider.obterFuncionario(this.idUsuario);

      if (data.status === 'success' && data.usuario) {
        this.funcionarios = [data.usuario];
        this.idFarm = data.usuario.fazendas_idfazendas;
        this.obterConsumo();
        this.obterFazendas();
      } else {

      }
    } catch (error) {
      this.exibirAlerta('Erro ao carregar fazendas', 'danger');
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

  async obterInsumo() {
    try {
      const data = await this.provider.obterInsumos();
      this.insumos = (data.status === 'success' && data.insumos.length > 0) ? data.insumos : [];
    } catch (error) {
    }
  }

  async obterEquipamento() {
    try {
      const data = await this.provider.obterEquipamentos();
      this.equipamentos = (data.status === 'success' && data.equipamentos.length > 0) ? data.equipamentos : [];
    } catch (error) {
    }
  }


  async obterConsumo() {
    try {
      const data = await this.provider.obterConsumo(this.idFarm);
      this.consumos = (data.status === 'success' && data.consumo.length > 0) ? data.consumo : [];
    } catch (error) {
      this.exibirAlerta('Erro ao carregar consumo', 'danger');
    }
  }

  async exibirAlerta(mensagem: string, cor: string, segundos: number = 3, titulo: string = '') {
    const alert = await this.alertController.create({
      header: titulo || (cor === 'danger' ? 'Erro' : 'Sucesso'),
      message: mensagem,
      cssClass: cor,
      backdropDismiss: false,
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, segundos * 1000);
  }
}
