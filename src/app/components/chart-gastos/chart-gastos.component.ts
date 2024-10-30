import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-chart-gastos',
  templateUrl: './chart-gastos.component.html',
  styleUrls: ['./chart-gastos.component.scss'],
})
export class ChartGastosComponent implements OnInit {
  date: any[] = []; // Array para armazenar os meses no formato abreviado
  insumosTotal: any[] = [];
  equipamentosTotal: any[] = [];
  idUsuario = Number(sessionStorage.getItem('id'));
  currentYear: number = new Date().getFullYear(); // Ano atual
  loading: boolean = true; // Variável de controle de loading

  public chartOptions: ChartOptions | any;

  constructor(private provider: ApiService) { }

  ngOnInit() {
    this.chartOptions = {
      series: [
        { name: "Insumos", data: this.insumosTotal },
        { name: "Equipamentos", data: this.equipamentosTotal },
      ],
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { horizontal: false, columnWidth: "45%" } },
      xaxis: { categories: [] },
      yaxis: {},
      fill: { opacity: 1 },
    };
    this.fetchExpensesData();
  }

  fetchExpensesData() {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let completedRequests = 0;

    for (let month = 1; month <= 12; month++) {
      this.provider.obterGastosPorMes(this.idUsuario, month, this.currentYear).then((res: any) => {
        completedRequests++;

        if (res.status === "success" && (res.insumosTotal > 0 || res.equipamentosTotal > 0)) {
          this.insumosTotal.push(res.insumosTotal);
          this.equipamentosTotal.push(res.equipamentosTotal);
          this.date.push(months[month - 1]); // Adiciona apenas o nome abreviado do mês
        }

        if (completedRequests === 12) {
          this.loading = false;
          this.updateChart();
        }
      }).catch(() => {
        completedRequests++;
        if (completedRequests === 12) {
          this.loading = false;
          this.updateChart();
        }
      });
    }
  }

  updateChart() {
    this.chartOptions = {
      series: [
        { name: "Insumos", data: this.insumosTotal },
        { name: "Equipamentos", data: this.equipamentosTotal },
      ],
      chart: { type: "bar", height: 350 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%", // Ajuste da largura das colunas
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false,
        formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val) // Formata como moeda
      },
      tooltip: {
        y: {
          formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val) // Formata como moeda no tooltip
        }
      },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: this.date,
        labels: {
          rotate: -45, // Rotaciona os rótulos do eixo X para melhorar a legibilidade
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val) // Formata como moeda no eixo Y
        }
      },
      fill: { opacity: 1 },
      legend: {
        show: true,
        position: 'top',
        formatter: () => `Ano: ${this.currentYear}`, // Exibe o ano na legenda
      }
    };
  }
}
