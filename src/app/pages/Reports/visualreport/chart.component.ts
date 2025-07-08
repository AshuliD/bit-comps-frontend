import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { PrintService } from '../Static Report/app/services/print.service';
import { Employee } from './models/employee.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div style="display: block; width: 600px; height: 400px;">
      <div>Employee Age Comparison</div>
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
export class ChartComponentz implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Age', backgroundColor: '#42A5F5' }
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

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private printService: PrintService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.loading = false;

        // age y axis
        this.barChartData.datasets[0].data = this.employees.map(emp => emp.age);
        // employee x axis
        this.barChartData.labels = this.employees.map(emp => emp.name); // Use a real label

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
