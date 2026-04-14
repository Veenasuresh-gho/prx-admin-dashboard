import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexResponsive,
  NgApexchartsModule
} from 'ng-apexcharts';

type ApexChartType =
  | 'bar'
  | 'horizontalBar'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'heatmap'
  | 'treemap'
  | 'polarArea'
  | 'radar'
  | 'scatter'
  | 'candlestick'
  | 'rangeBar';


@Component({
  selector: 'app-apex-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    @if (chart) {
      <apx-chart
        [chart]="chart"
        [series]="series"
        [xaxis]="xaxis"
        [labels]="labels"
        [plotOptions]="plotOptions"
        [dataLabels]="dataLabels"
        [responsive]="responsive">
      </apx-chart>
    }
`
})
export class ApexChartComponent implements OnChanges {

  @Input() chartType!: ApexChartType;
  @Input() apiData: any[] = [];

  chart!: ApexChart;
  series!: ApexAxisChartSeries | ApexNonAxisChartSeries;
  xaxis?: ApexXAxis;
  labels?: string[];
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  responsive?: ApexResponsive[];

  ngOnChanges(): void {
    if (!this.apiData?.length || !this.chartType) return;

    this.resetOptions();

    switch (this.chartType) {

      case 'bar':
        this.buildBarChart();
        break;

      case 'horizontalBar':
        this.buildHorizontalBarChart();
        break;

      case 'line':
        this.buildLineChart();
        break;

      case 'area':
        this.buildAreaChart();
        break;

      case 'pie':
        this.buildPieChart();
        break;

      case 'donut':
        this.buildDonutChart();
        break;

      case 'radialBar':
        this.buildRadialBarChart();
        break;

      case 'heatmap':
        this.buildHeatmapChart();
        break;

      case 'treemap':
        this.buildTreemapChart();
        break;

      case 'polarArea':
        this.buildPolarAreaChart();
        break;

      case 'radar':
        this.buildRadarChart();
        break;

      case 'scatter':
        this.buildScatterChart();
        break;

      case 'candlestick':
        this.buildCandlestickChart();
        break;

      case 'rangeBar':
        this.buildRangeBarChart();
        break;
    }
  }

  // ---------------- RESET ----------------
  private resetOptions() {
    this.labels = [];
    this.xaxis = undefined;
    this.plotOptions = undefined;
    this.responsive = undefined;
  }

  // ---------------- BAR ----------------
  private buildBarChart() {
    this.chart = { type: 'bar', height: 300 };
    this.series = [
      { name: 'Values', data: this.apiData.map(d => d.value) }
    ];
    this.xaxis = {
      categories: this.apiData.map(d => d.label)
    };
  }

  private buildHorizontalBarChart() {
    this.buildBarChart();
    this.plotOptions = {
      bar: { horizontal: true }
    };
  }

  // ---------------- LINE ----------------
  private buildLineChart() {
    this.chart = { type: 'line', height: 300 };
    this.series = [
      { name: 'Values', data: this.apiData.map(d => d.value) }
    ];
    this.xaxis = {
      categories: this.apiData.map(d => d.label)
    };
  }

  // ---------------- AREA ----------------
  private buildAreaChart() {
    this.chart = { type: 'area', height: 300 };
    this.series = [
      { name: 'Values', data: this.apiData.map(d => d.value) }
    ];
    this.xaxis = {
      categories: this.apiData.map(d => d.label)
    };
  }

  // ---------------- PIE ----------------
  private buildPieChart() {
    this.chart = { type: 'pie', height: 420 };
    this.series = this.apiData.map(d => d.value);
    this.labels = this.apiData.map(d => d.label);
  }

  // ---------------- DONUT ----------------
  private buildDonutChart() {
    this.chart = { type: 'donut', height: 420 };
    this.series = this.apiData.map(d => d.value);
    this.labels = this.apiData.map(d => d.label);
  }

  // ---------------- RADIAL ----------------
  private buildRadialBarChart() {
    this.chart = { type: 'radialBar', height: 350 };
    this.series = this.apiData.map(d => d.value);
    this.labels = this.apiData.map(d => d.label);
  }

  // ---------------- HEATMAP ----------------
  private buildHeatmapChart() {
    this.chart = { type: 'heatmap', height: 350 };
    this.series = [
      {
        name: 'Heat',
        data: this.apiData
      }
    ];
  }

  // ---------------- TREEMAP ----------------
  private buildTreemapChart() {
    this.chart = { type: 'treemap', height: 350 };
    this.series = [
      {
        data: this.apiData
      }
    ];
  }

  // ---------------- POLAR ----------------
  private buildPolarAreaChart() {
    this.chart = { type: 'polarArea', height: 350 };
    this.series = this.apiData.map(d => d.value);
    this.labels = this.apiData.map(d => d.label);
  }

  // ---------------- RADAR ----------------
  private buildRadarChart() {
    this.chart = { type: 'radar', height: 350 };
    this.series = [
      { name: 'Radar', data: this.apiData.map(d => d.value) }
    ];
    this.labels = this.apiData.map(d => d.label);
  }

  // ---------------- SCATTER ----------------
  private buildScatterChart() {
    this.chart = { type: 'scatter', height: 350 };
    this.series = [
      {
        name: 'Points',
        data: this.apiData // expects [{x,y}]
      }
    ];
  }

  // ---------------- CANDLE ----------------
  private buildCandlestickChart() {
    this.chart = { type: 'candlestick', height: 350 };
    this.series = [
      {
        data: this.apiData // expects [{x, y:[o,h,l,c]}]
      }
    ];
  }

  // ---------------- RANGE BAR ----------------
  private buildRangeBarChart() {
    this.chart = { type: 'rangeBar', height: 350 };
    this.series = [
      {
        data: this.apiData // expects [{x, y:[start,end]}]
      }
    ];
    this.plotOptions = {
      bar: { horizontal: true }
    };
  }
}
