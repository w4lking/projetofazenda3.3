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

  salarioTotal: number = 1; // Variável para armazenar o salário total
  insumosTotal: number = 1;
  equipamentosTotal: number = 1;
  idUsuario = Number(sessionStorage.getItem('id'));


  @ViewChild('chart') chart: ChartComponent | any;
  public chartOptions: ChartOptions | any;

  constructor(
    private provider: ApiService,
  ) { }

  ngOnInit() {
    this.chartOptions = {
      series: [],
      chart: { width: 500, type: "pie" },
      labels: ["Equipamentos", "Insumos",  "Funcionários"],
      responsive: [{ breakpoint: 460, options: { chart: { width: 380 }, legend: { position: "bottom" } } }]
    };

    this.provider.obterGastos(this.idUsuario).then(
      (res: any) => {
        if (res.status === 'success') {
          this.salarioTotal = res.salarioTotal ?? 0;
          this.insumosTotal = res.insumosTotal ?? 0;
          this.equipamentosTotal = res.equipamentosTotal ?? 0;
          this.inicializarGrafico();
        }
      }
    ).catch((error) => {
      console.error('Erro ao obter gastos:', error);
    });
  }

  inicializarGrafico() {
    this.chartOptions = {
      series: [ this.equipamentosTotal,this.insumosTotal,this.salarioTotal ],
      chart: {
        width: 500,
        type: "pie"
      },
      labels: ["Equipamentos", "Insumos",  "Funcionários"],
      responsive: [
        {
          breakpoint: 460,
          options: {
            chart: {
              width: 380
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
