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
  selector: 'app-chart-solicitacoes',
  templateUrl: './chart-solicitacoes.component.html',
  styleUrls: ['./chart-solicitacoes.component.scss'],
})
export class ChartSolicitacoesComponent implements OnInit {
  date: any[] = [];
  solicitacoesAceitas: any[] = [];
  consumoRealizado: any[] = [];
  idUsuario = Number(sessionStorage.getItem('id'));
  currentYear: number = new Date().getFullYear();
  loading: boolean = true;

  public chartOptions: ChartOptions | any;

  constructor(private provider: ApiService) { }

  ngOnInit() {
    this.fetchExpensesData();
  }

 fetchExpensesData() {
  this.provider.obterSolicitacaoConsumoEstoque(this.idUsuario, this.currentYear).then((res: any) => {
    if (res.status === "success") {
      const solicitacoesData = res.data
        .map((item: any) => ({
          month: item.month,
          totalSolicitacoes: item.totalSolicitacoes,
          totalConsumo: item.totalConsumo
        }))
        // Filtra apenas os meses com valores maiores que zero
        .filter((item: any) => item.totalSolicitacoes > 0 || item.totalConsumo > 0);

      this.date = solicitacoesData.map((item: any) => 
        new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(this.currentYear, item.month - 1))
      );
      this.solicitacoesAceitas = solicitacoesData.map((item: any) => item.totalSolicitacoes);
      this.consumoRealizado = solicitacoesData.map((item: any) => item.totalConsumo);

      this.loading = false;
      this.updateChart();
    }
  }).catch((error) => {
    console.error("Erro ao obter dados:", error);
    this.loading = false;
  });
}

  updateChart() {
    this.chartOptions = {
      series: [
        { name: "Quantidade de Solicitações aceitas", data: this.solicitacoesAceitas },
        { name: "Consumo Realizado", data: this.consumoRealizado }
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
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toString()
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
          formatter: (val: number) => val.toString()
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
