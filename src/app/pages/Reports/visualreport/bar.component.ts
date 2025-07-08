import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { PrintService } from '../Static Report/app/services/print.service';
import { Employee } from './models/employee.model';
import { StockServiceService } from 'src/app/services/stock/stock.service';
import { Stock } from './models/stock.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div style="display: block; width: 600px; height: 400px;">
      <div>Stock Quantity</div>
      <canvas baseChart
        [data]="barChartData"
        [options]="barChartOptions"
        [type]="barChartType">
      </canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
    }
  `]
})
export class BarComponents implements OnInit {
    employees: Employee[] = [];
  stock:Stock[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: ChartType = 'bar';

 public barChartData = {
  labels: this.stock?.map(stock => stock.stockItemName),
  datasets: [
    {
      data: this.stock?.map(stock => stock.qty),
      label: 'Quantity',
      backgroundColor: '#42A5F5'
    }
  ]
};

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };


  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;

  constructor(

    private printService: PrintService,
    private stockservice: StockServiceService
  ) { }

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock(): void {
    this.loading = true;
    this.stockservice.getStockData().subscribe({
      next: (data) => {
  console.log('Stock Data:', data);

        this.loading = false;

       // age y axis
        this.barChartData.datasets[0].data = this.stock.map(stock => stock.qty);
        // employee x axis
        this.barChartData.labels = this.stock.map(stock => stock.stockItemName); // Use a real label

        this.chart?.update();
      },
      error: (err) => {
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
        console.error('Error fetching employees:', err);
      }
    });
  }

}
