import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Employee, Sale, Inventory, SearchFilters, ReportItem, ReportSummary } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private employees: Employee[] = [
    { id: 1, name: 'John Smith', department: 'Engineering', position: 'Senior Developer', salary: 95000, hireDate: new Date(2019, 3, 15), performance: 4.2 },
    { id: 2, name: 'Sarah Johnson', department: 'Marketing', position: 'Marketing Director', salary: 88000, hireDate: new Date(2018, 7, 12), performance: 4.5 },
    { id: 3, name: 'Michael Brown', department: 'Sales', position: 'Sales Representative', salary: 65000, hireDate: new Date(2020, 1, 5), performance: 3.8 },
    { id: 4, name: 'Emily Davis', department: 'HR', position: 'HR Specialist', salary: 72000, hireDate: new Date(2021, 5, 23), performance: 4.0 },
    { id: 5, name: 'David Wilson', department: 'Engineering', position: 'Junior Developer', salary: 65000, hireDate: new Date(2022, 2, 10), performance: 3.5 },
    { id: 6, name: 'Lisa Martinez', department: 'Finance', position: 'Financial Analyst', salary: 78000, hireDate: new Date(2019, 11, 8), performance: 4.3 },
    { id: 7, name: 'Robert Taylor', department: 'Sales', position: 'Sales Manager', salary: 92000, hireDate: new Date(2017, 9, 19), performance: 4.7 },
    { id: 8, name: 'Amanda Thomas', department: 'Marketing', position: 'Content Specialist', salary: 68000, hireDate: new Date(2021, 1, 12), performance: 3.9 },
    { id: 9, name: 'James Anderson', department: 'Engineering', position: 'Software Architect', salary: 110000, hireDate: new Date(2016, 4, 2), performance: 4.8 },
    { id: 10, name: 'Jessica White', department: 'HR', position: 'Recruitment Specialist', salary: 69000, hireDate: new Date(2020, 8, 15), performance: 4.1 }
  ];

  private sales: Sale[] = [
    { id: 1, product: 'Laptop Pro', category: 'Electronics', quantity: 3, unitPrice: 1200, totalPrice: 3600, date: new Date(2023, 0, 15), customer: 'TechCorp Inc.' },
    { id: 2, product: 'Office Chair', category: 'Furniture', quantity: 10, unitPrice: 150, totalPrice: 1500, date: new Date(2023, 1, 3), customer: 'StartUp Ltd.' },
    { id: 3, product: 'Smartphone X', category: 'Electronics', quantity: 5, unitPrice: 800, totalPrice: 4000, date: new Date(2023, 1, 12), customer: 'Mobile Shop' },
    { id: 4, product: 'Desk Lamp', category: 'Furniture', quantity: 15, unitPrice: 45, totalPrice: 675, date: new Date(2023, 2, 7), customer: 'Home Goods Store' },
    { id: 5, product: 'Wireless Headphones', category: 'Electronics', quantity: 8, unitPrice: 120, totalPrice: 960, date: new Date(2023, 2, 25), customer: 'Audio World' },
    { id: 6, product: 'Ergonomic Keyboard', category: 'Electronics', quantity: 12, unitPrice: 85, totalPrice: 1020, date: new Date(2023, 3, 9), customer: 'Office Solutions' },
    { id: 7, product: 'Conference Table', category: 'Furniture', quantity: 2, unitPrice: 1500, totalPrice: 3000, date: new Date(2023, 3, 18), customer: 'Business Center' },
    { id: 8, product: 'External Hard Drive', category: 'Electronics', quantity: 20, unitPrice: 95, totalPrice: 1900, date: new Date(2023, 4, 2), customer: 'Data Storage Inc.' },
    { id: 9, product: 'Office Sofa', category: 'Furniture', quantity: 3, unitPrice: 750, totalPrice: 2250, date: new Date(2023, 4, 20), customer: 'Interior Design Co.' },
    { id: 10, product: 'Wireless Mouse', category: 'Electronics', quantity: 25, unitPrice: 35, totalPrice: 875, date: new Date(2023, 5, 8), customer: 'Tech Supplies Ltd.' }
  ];

  private inventory: Inventory[] = [
    { id: 1, product: 'Laptop Pro', category: 'Electronics', quantity: 45, location: 'Warehouse A', lastRestocked: new Date(2023, 4, 10), minimumRequired: 20 },
    { id: 2, product: 'Office Chair', category: 'Furniture', quantity: 32, location: 'Warehouse B', lastRestocked: new Date(2023, 3, 15), minimumRequired: 15 },
    { id: 3, product: 'Smartphone X', category: 'Electronics', quantity: 67, location: 'Warehouse A', lastRestocked: new Date(2023, 5, 5), minimumRequired: 30 },
    { id: 4, product: 'Desk Lamp', category: 'Furniture', quantity: 89, location: 'Warehouse C', lastRestocked: new Date(2023, 2, 20), minimumRequired: 40 },
    { id: 5, product: 'Wireless Headphones', category: 'Electronics', quantity: 53, location: 'Warehouse A', lastRestocked: new Date(2023, 4, 25), minimumRequired: 25 },
    { id: 6, product: 'Ergonomic Keyboard', category: 'Electronics', quantity: 41, location: 'Warehouse A', lastRestocked: new Date(2023, 3, 30), minimumRequired: 20 },
    { id: 7, product: 'Conference Table', category: 'Furniture', quantity: 12, location: 'Warehouse B', lastRestocked: new Date(2023, 5, 12), minimumRequired: 5 },
    { id: 8, product: 'External Hard Drive', category: 'Electronics', quantity: 78, location: 'Warehouse A', lastRestocked: new Date(2023, 4, 18), minimumRequired: 35 },
    { id: 9, product: 'Office Sofa', category: 'Furniture', quantity: 18, location: 'Warehouse B', lastRestocked: new Date(2023, 3, 5), minimumRequired: 10 },
    { id: 10, product: 'Wireless Mouse', category: 'Electronics', quantity: 94, location: 'Warehouse A', lastRestocked: new Date(2023, 5, 8), minimumRequired: 45 }
  ];

  constructor() { }

  getEmployees(filters?: SearchFilters): Observable<Employee[]> {
    let filteredEmployees = [...this.employees];
    
    if (filters) {
      if (filters.dateRange) {
        filteredEmployees = filteredEmployees.filter(employee => 
          employee.hireDate >= filters.dateRange!.start && 
          employee.hireDate <= filters.dateRange!.end
        );
      }
      
      if (filters.salaryRange) {
        filteredEmployees = filteredEmployees.filter(employee => 
          employee.salary >= filters.salaryRange!.min && 
          employee.salary <= filters.salaryRange!.max
        );
      }
      
      if (filters.departments && filters.departments.length > 0) {
        filteredEmployees = filteredEmployees.filter(employee => 
          filters.departments!.includes(employee.department)
        );
      }
      
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredEmployees = filteredEmployees.filter(employee => 
          employee.name.toLowerCase().includes(searchLower) || 
          employee.position.toLowerCase().includes(searchLower) ||
          employee.department.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Simulate network delay
    return of(filteredEmployees).pipe(delay(500));
  }

  getSales(filters?: SearchFilters): Observable<Sale[]> {
    let filteredSales = [...this.sales];
    
    if (filters) {
      if (filters.dateRange) {
        filteredSales = filteredSales.filter(sale => 
          sale.date >= filters.dateRange!.start && 
          sale.date <= filters.dateRange!.end
        );
      }
      
      if (filters.quantityRange) {
        filteredSales = filteredSales.filter(sale => 
          sale.quantity >= filters.quantityRange!.min && 
          sale.quantity <= filters.quantityRange!.max
        );
      }
      
      if (filters.priceRange) {
        filteredSales = filteredSales.filter(sale => 
          sale.totalPrice >= filters.priceRange!.min && 
          sale.totalPrice <= filters.priceRange!.max
        );
      }
      
      if (filters.categories && filters.categories.length > 0) {
        filteredSales = filteredSales.filter(sale => 
          filters.categories!.includes(sale.category)
        );
      }
      
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredSales = filteredSales.filter(sale => 
          sale.product.toLowerCase().includes(searchLower) || 
          sale.customer.toLowerCase().includes(searchLower) ||
          sale.category.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Simulate network delay
    return of(filteredSales).pipe(delay(500));
  }

  getInventory(filters?: SearchFilters): Observable<Inventory[]> {
    let filteredInventory = [...this.inventory];
    
    if (filters) {
      if (filters.dateRange) {
        filteredInventory = filteredInventory.filter(item => 
          item.lastRestocked >= filters.dateRange!.start && 
          item.lastRestocked <= filters.dateRange!.end
        );
      }
      
      if (filters.quantityRange) {
        filteredInventory = filteredInventory.filter(item => 
          item.quantity >= filters.quantityRange!.min && 
          item.quantity <= filters.quantityRange!.max
        );
      }
      
      if (filters.categories && filters.categories.length > 0) {
        filteredInventory = filteredInventory.filter(item => 
          filters.categories!.includes(item.category)
        );
      }
      
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredInventory = filteredInventory.filter(item => 
          item.product.toLowerCase().includes(searchLower) || 
          item.location.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Simulate network delay
    return of(filteredInventory).pipe(delay(500));
  }

  getAvailableCategories(): Observable<string[]> {
    const categories = new Set<string>();
    
    this.sales.forEach(sale => categories.add(sale.category));
    this.inventory.forEach(item => categories.add(item.category));
    
    return of(Array.from(categories)).pipe(delay(300));
  }

  getAvailableDepartments(): Observable<string[]> {
    const departments = new Set<string>();
    
    this.employees.forEach(employee => departments.add(employee.department));
    
    return of(Array.from(departments)).pipe(delay(300));
  }

  calculateReportSummary(items: ReportItem[], type: string): ReportSummary {
    const summary: ReportSummary = {
      count: items.length,
    };

    if (items.length === 0) {
      return summary;
    }

    if (type === 'employee') {
      const employees = items as Employee[];
      let totalSalary = 0;
      let totalPerformance = 0;
      
      employees.forEach(emp => {
        totalSalary += emp.salary;
        totalPerformance += emp.performance;
      });
      
      summary.averages = {
        salary: parseFloat((totalSalary / employees.length).toFixed(2)),
        performance: parseFloat((totalPerformance / employees.length).toFixed(2))
      };
      
      summary.totals = {
        salary: totalSalary
      };
    } 
    else if (type === 'sales') {
      const salesData = items as Sale[];
      let totalQuantity = 0;
      let totalRevenue = 0;
      
      salesData.forEach(sale => {
        totalQuantity += sale.quantity;
        totalRevenue += sale.totalPrice;
      });
      
      summary.averages = {
        quantity: parseFloat((totalQuantity / salesData.length).toFixed(2)),
        revenue: parseFloat((totalRevenue / salesData.length).toFixed(2))
      };
      
      summary.totals = {
        quantity: totalQuantity,
        revenue: totalRevenue
      };
    } 
    else if (type === 'inventory') {
      const inventoryData = items as Inventory[];
      let totalQuantity = 0;
      
      inventoryData.forEach(item => {
        totalQuantity += item.quantity;
      });
      
      summary.averages = {
        quantity: parseFloat((totalQuantity / inventoryData.length).toFixed(2))
      };
      
      summary.totals = {
        quantity: totalQuantity
      };
    }

    return summary;
  }
}