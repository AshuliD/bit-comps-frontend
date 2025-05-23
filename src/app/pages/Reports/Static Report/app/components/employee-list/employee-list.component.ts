import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
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
  ) {}

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
      },
      error: (err) => {
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
        console.error('Error fetching employees:', err);
      }
    });
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = this.employees;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee =>
      employee.name.toLowerCase().includes(term)||
      employee.age.toString() .includes(term)||
      employee.phoneNumber.toString().includes(term) ||
      employee.salary.toString().includes(term)||
       employee.id.toString().includes(term)
    );
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredEmployees = [...this.filteredEmployees].sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return this.sortDirection === 'asc' ? comparison : -comparison;
      } else {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return '↕';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  printReport(): void {
    this.printService.printEmployeeReport(this.filteredEmployees);
  }

  getDate(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }
}
