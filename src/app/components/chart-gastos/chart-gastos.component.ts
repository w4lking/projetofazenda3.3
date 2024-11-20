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
  date: any[] = [];
  insumosTotal: any[] = [];
  equipamentosTotal: any[] = [];
  idUsuario = Number(sessionStorage.getItem('id'));
  currentYear: number = new Date().getFullYear(); 
  loading: boolean = true;

  public chartOptions: ChartOptions | any;

  constructor(private provider: ApiService) { }

  ngOnInit() {
    this.fetchExpensesData();
  }

  fetchExpensesData() {
    this.provider.obterGastosMensais(this.idUsuario, this.currentYear).then((res: any) => {
      if (res.status === "success") {
        res.data.forEach((item: any) => {
          // Verifica se o mês tem despesas para insumos ou equipamentos
          if (item.totalInsumos > 0 || item.totalEquipamentos > 0) {
            this.insumosTotal.push(item.totalInsumos);
            this.equipamentosTotal.push(item.totalEquipamentos);
            this.date.push(
              new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(this.currentYear, item.month - 1))
            );
          }
        });
        this.loading = false;
        this.updateChart();
      }
    }).catch((error) => {
      console.error("Erro ao obter gastos mensais:", error);
      this.loading = false;
    });
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
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false,
        formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
      },
      tooltip: {
        y: {
          formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
        }
      },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: this.date,
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
        }
      },
      fill: { opacity: 1 },
      legend: {
        show: true,
        position: 'bottom'
      }
    };
  }
}
