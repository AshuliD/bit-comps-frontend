import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, Sale, Inventory, SearchFilters, ReportSummary, DateRange, NumberRange } from '../../models/report.model';
import { DataService } from '../../services/data.service';
import { PdfService } from '../../services/pdf.service';
import { RangeSelectorComponent } from '../../components/range-selector/range-selector.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { ReportTableComponent } from '../../components/report-table/report-table.component';
import { ReportSummaryComponent } from '../../components/report-summary/report-summary.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RangeSelectorComponent,
    SearchFiltersComponent,
    ReportTableComponent,
    ReportSummaryComponent
  ],
  template: `
    <div class="reports-page">
      <div class="page-header">
        <h1>Reports</h1>
      </div>

      <div class="report-selector card">
        <h2>Select Report Type</h2>
        <div class="report-type-selector">
          <div
            class="report-type-option"
            [class.active]="selectedReportType === 'employee'"
            (click)="selectReportType('employee')"
          >
            <span class="material-icons">people</span>
            <span>Employees</span>
          </div>
          <div
            class="report-type-option"
            [class.active]="selectedReportType === 'sales'"
            (click)="selectReportType('sales')"
          >
            <span class="material-icons">paid</span>
            <span>Sales</span>
          </div>
          <div
            class="report-type-option"
            [class.active]="selectedReportType === 'inventory'"
            (click)="selectReportType('inventory')"
          >
            <span class="material-icons">inventory_2</span>
            <span>Inventory</span>
          </div>
        </div>
      </div>

      <div class="reports-container">
        <div class="filters-column">
          <ng-container *ngIf="selectedReportType === 'employee'">
            <app-range-selector
              title="Date Range"
              type="date"
              (rangeChange)="onDateRangeChange($event)"
            ></app-range-selector>

            <app-range-selector
              title="Salary Range"
              type="number"
              [min]="60000"
              [max]="120000"
              [step]="1000"
              (rangeChange)="onSalaryRangeChange($event)"
            ></app-range-selector>
          </ng-container>

          <ng-container *ngIf="selectedReportType === 'sales'">
            <app-range-selector
              title="Date Range"
              type="date"
              (rangeChange)="onDateRangeChange($event)"
            ></app-range-selector>

            <app-range-selector
              title="Quantity Range"
              type="number"
              [min]="1"
              [max]="30"
              [step]="1"
              (rangeChange)="onQuantityRangeChange($event)"
            ></app-range-selector>

            <app-range-selector
              title="Price Range"
              type="number"
              [min]="0"
              [max]="5000"
              [step]="100"
              (rangeChange)="onPriceRangeChange($event)"
            ></app-range-selector>
          </ng-container>

          <ng-container *ngIf="selectedReportType === 'inventory'">
            <app-range-selector
              title="Date Range"
              type="date"
              (rangeChange)="onDateRangeChange($event)"
            ></app-range-selector>

            <app-range-selector
              title="Quantity Range"
              type="number"
              [min]="0"
              [max]="100"
              [step]="5"
              (rangeChange)="onQuantityRangeChange($event)"
            ></app-range-selector>
          </ng-container>

          <app-search-filters
            [showCategoryFilter]="selectedReportType !== 'employee'"
            [showDepartmentFilter]="selectedReportType === 'employee'"
            [availableCategories]="availableCategories"
            [availableDepartments]="availableDepartments"
            (filtersChanged)="onFiltersChanged($event)"
          ></app-search-filters>
        </div>

        <div class="results-column">
          <div *ngIf="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
          </div>

          <ng-container *ngIf="!isLoading">
            <app-report-summary
              *ngIf="reportSummary"
              [summary]="reportSummary"
              [reportType]="selectedReportType"
            ></app-report-summary>

            <ng-container *ngIf="selectedReportType === 'employee'">
              <app-report-table
                title="Employee Report"
                [data]="employeeData"
                reportType="employee"
                (generatePdf)="generateEmployeePdf()"
              ></app-report-table>
            </ng-container>

            <ng-container *ngIf="selectedReportType === 'sales'">
              <app-report-table
                title="Sales Report"
                [data]="salesData"
                reportType="sales"
                (generatePdf)="generateSalesPdf()"
              ></app-report-table>
            </ng-container>

            <ng-container *ngIf="selectedReportType === 'inventory'">
              <app-report-table
                title="Inventory Report"
                [data]="inventoryData"
                reportType="inventory"
                (generatePdf)="generateInventoryPdf()"
              ></app-report-table>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`.reports-page {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  color: #333;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.report-selector {
  background-color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.report-type-selector {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.report-type-option {
  flex: 1 1 150px;
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.report-type-option:hover {
  background-color: #e0e0e0;
}

.report-type-option.active {
  background-color: #3f51b5;
  color: #fff;
  font-weight: bold;
}

.report-type-option .material-icons {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.reports-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.filters-column {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-column {
  flex: 2 1 600px;
  min-width: 300px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3f51b5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .reports-container {
    flex-direction: column;
  }

  .report-type-selector {
    flex-direction: column;
  }
}
 `]
})
export class ReportsComponent implements OnInit {
  selectedReportType: 'employee' | 'sales' | 'inventory' = 'employee';

  employeeData: Employee[] = [];
  salesData: Sale[] = [];
  inventoryData: Inventory[] = [];

  availableCategories: string[] = [];
  availableDepartments: string[] = [];

  searchFilters: SearchFilters = {};

  isLoading: boolean = false;
  reportSummary: ReportSummary | null = null;

  constructor(
    private dataService: DataService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadDepartments();
    this.loadData();
  }

  selectReportType(type: 'employee' | 'sales' | 'inventory') {
    this.selectedReportType = type;
    this.searchFilters = {};
    this.loadData();
  }

  loadCategories() {
    this.dataService.getAvailableCategories().subscribe(categories => {
      this.availableCategories = categories;
    });
  }

  loadDepartments() {
    this.dataService.getAvailableDepartments().subscribe(departments => {
      this.availableDepartments = departments;
    });
  }

  loadData() {
    this.isLoading = true;

    if (this.selectedReportType === 'employee') {
      this.dataService.getEmployees(this.searchFilters).subscribe(data => {
        this.employeeData = data;
        this.reportSummary = this.dataService.calculateReportSummary(data, 'employee');
        this.isLoading = false;
      });
    }
    else if (this.selectedReportType === 'sales') {
      this.dataService.getSales(this.searchFilters).subscribe(data => {
        this.salesData = data;
        this.reportSummary = this.dataService.calculateReportSummary(data, 'sales');
        this.isLoading = false;
      });
    }
    else if (this.selectedReportType === 'inventory') {
      this.dataService.getInventory(this.searchFilters).subscribe(data => {
        this.inventoryData = data;
        this.reportSummary = this.dataService.calculateReportSummary(data, 'inventory');
        this.isLoading = false;
      });
    }
  }

onDateRangeChange(range: DateRange | NumberRange): void {
  if ('start' in range && 'end' in range) {
    this.searchFilters.dateRange = range;
    this.loadData();
  }
}

onSalaryRangeChange(range: DateRange | NumberRange): void {
  if ('min' in range && 'max' in range) {
    this.searchFilters.salaryRange = range;
    this.loadData();
  }
}

onQuantityRangeChange(range: DateRange | NumberRange): void {
  if ('min' in range && 'max' in range) {
    this.searchFilters.quantityRange = range;
    this.loadData();
  }
}

onPriceRangeChange(range: DateRange | NumberRange): void {
  if ('min' in range && 'max' in range) {
    this.searchFilters.priceRange = range;
    this.loadData();
  }
}


  onFiltersChanged(filters: SearchFilters) {
    this.searchFilters = {
      ...this.searchFilters,
      searchText: filters.searchText,
      categories: filters.categories,
      departments: filters.departments
    };
    this.loadData();
  }

  generateEmployeePdf() {
    if (this.employeeData.length === 0 || !this.reportSummary) return;

    const doc = this.pdfService.generateEmployeeReport(
      this.employeeData,
      this.reportSummary,
      'Employee Report'
    );

    doc.save('employee-report.pdf');
  }

  generateSalesPdf() {
    if (this.salesData.length === 0 || !this.reportSummary) return;

    const doc = this.pdfService.generateSalesReport(
      this.salesData,
      this.reportSummary,
      'Sales Report'
    );

    doc.save('sales-report.pdf');
  }

  generateInventoryPdf() {
    if (this.inventoryData.length === 0 || !this.reportSummary) return;

    const doc = this.pdfService.generateInventoryReport(
      this.inventoryData,
      this.reportSummary,
      'Inventory Report'
    );

    doc.save('inventory-report.pdf');
  }
}
