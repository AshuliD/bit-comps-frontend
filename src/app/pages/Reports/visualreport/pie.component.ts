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
export class PieComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: ChartType = 'pie';

  public barChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Age', backgroundColor: ['red','green' ,'orange'] }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
  //   x: {
  //   type: 'category',
  //   title: { display: false, text: 'Employees', color: '#666' },
  //   grid: { display: false }
  // },
  // y: {
  //   type: 'linear',
  //   beginAtZero: true,
  //   min: 0,
  //   max: 100,
  //   title: { display: false, text: 'Age', color: '#666' },
  //   ticks: { stepSize: 10, color: '#333' }
  // }
    },
    plugins: {
     legend: {
    display: true,
    position: 'bottom',
    align: 'center',
    labels: { boxWidth: 20, font: { size: 14 }, color: '#333' }
  },
  title: {
    display: true,
    text: 'Employee Age Distribution',
    position: 'top',
    font: { size: 16, weight: 'bold' }
  },
  tooltip: {
    enabled: true,
    backgroundColor: 'rgba(0,0,0,0.8)',
    callbacks: {
      label: (context) => `${context.dataset.label}: ${context.raw} years`
    }
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
    //declare services
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
