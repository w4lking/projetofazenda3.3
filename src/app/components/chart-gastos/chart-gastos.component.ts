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
export class ChartGastosComponent  implements OnInit {

  date = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];

  public chartOptions: ChartOptions | any;
  constructor(
    private provider: ApiService,
  ) { }

  ngOnInit() {
    

    this.chartOptions = {
      series: [
        {
          name: "Gastos",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        },
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.date // Use o array de meses aqui
      },
      yaxis: {
        title: {
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
      }
    };
  }


}
