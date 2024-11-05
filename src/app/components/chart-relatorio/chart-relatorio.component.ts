import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-chart-relatorio',
  templateUrl: './chart-relatorio.component.html',
  styleUrls: ['./chart-relatorio.component.scss'],
})
export class ChartRelatorioComponent implements OnInit {

  salarioTotal: number = 1;
  insumosTotal: number = 1;
  equipamentosTotal: number = 1;
  idUsuario = Number(sessionStorage.getItem('id'));
  dadosCarregados: boolean = false; // Controle de carregamento único

  @ViewChild('chart') chart: ChartComponent | any;
  public chartOptions: ChartOptions | any;

  constructor(private provider: ApiService) { }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    // Verifica se os dados já foram carregados
    if (!this.dadosCarregados) {
      this.provider.obterGastos(this.idUsuario).then(
        (res: any) => {
          if (res.status === 'success') {
            this.salarioTotal = res.salarioTotal ?? 0;
            this.insumosTotal = res.insumosTotal ?? 0;
            this.equipamentosTotal = res.equipamentosTotal ?? 0;
            this.inicializarGrafico();
            this.dadosCarregados = true; // Marca como carregado
          }
        }
      ).catch((error) => {
        console.error('Erro ao obter gastos:', error);
      });
    }
  }

  inicializarGrafico() {
    this.chartOptions = {
      series: [this.insumosTotal, this.equipamentosTotal, this.salarioTotal],
      chart: {
        width: 350,
        type: "pie"
      },
      labels: ["Insumos", "Equipamentos", "Funcionários"],
      responsive: [
        {
          breakpoint: 370,
          options: {
            chart: {
              width: 340
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
