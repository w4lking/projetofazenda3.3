import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';
import { ApiService } from 'src/app/services/api.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart-usuarios',
  templateUrl: './chart-usuarios.component.html',
  styleUrls: ['./chart-usuarios.component.scss'],
})
export class ChartUsuariosComponent implements OnInit {
  date: string[] = []; // Array para armazenar os meses formatados
  quantidade: number[] = []; // Array para armazenar as quantidades
  idUsuario: number = Number(sessionStorage.getItem('id')); // ID do usuário logado
  currentYear: number = new Date().getFullYear(); // Ano atual
  loading: boolean = true; // Estado de carregamento

  public chartOptions: ChartOptions | any; // Opções do gráfico

  constructor(private readonly provider: ApiService) {}

  ngOnInit() {
    this.carregarDadosPorMes(this.currentYear); // Carrega os dados para o gráfico
  }

  carregarDadosPorMes(year: number) {
    this.provider
      .obterUsuariosCadastradosPorMes(year)
      .then((data: any[]) => {
        if (!Array.isArray(data)) {
          throw new Error('Dados inválidos recebidos da API.');
        }

        const meses: string[] = [];
        const quantidades: number[] = [];

        for (const item of data) {
          const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(
            new Date(`${item.mes_registro}-01`) // Converte "YYYY-MM" em uma data válida
          );
          meses.push(mes);
          quantidades.push(item.quantidade);
        }

        this.date = meses;
        this.quantidade = quantidades;

        if (this.quantidade.length === 0) {
          this.chartOptions = {
            series: [],
            chart: {
              height: 350,
              type: 'line',
            },
            xaxis: {
              categories: [],
            },
            title: { text: 'Sem dados disponíveis', align: 'center' },
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: 'Quantidade',
                data: this.quantidade,
              },
            ],
            chart: {
              height: 350,
              type: 'line',
              zoom: { enabled: false },
            },
            xaxis: { categories: this.date },
            title: { text: 'Usuários Cadastrados Mensalmente', align: 'left' },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
          };
        }

        this.loading = false;
      })
      .catch((error) => {
        console.error('Erro ao carregar os dados do gráfico:', error);
        this.loading = false;

        alert('Não foi possível carregar os dados do gráfico. Tente novamente mais tarde.');
      });
  }
}

