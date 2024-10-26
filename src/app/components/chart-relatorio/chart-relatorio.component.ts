import { Component, OnInit, ViewChild } from '@angular/core';

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
export class ChartRelatorioComponent  implements OnInit {

  salarioTotal: number = 0; // Variável para armazenar o salário total
  insumosTotal: number = 0;
  equipamentosTotal: number = 0;


  @ViewChild('chart') chart: ChartComponent | any;
  public chartOptions: ChartOptions | any;

  constructor() { }

  ngOnInit() {
    this.inicializarGrafico();
  }

  inicializarGrafico() {
    this.chartOptions = {
      series: [500, 300, 100],
      chart: {
        width: 500,
        type: "pie"
      },
      labels: ["Funcionários: ", "Insumos", "Equipamentos"],
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
