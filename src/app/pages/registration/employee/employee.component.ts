import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Assuming no specific service for now, will use mock data or skip service interaction.
// import { EmployeeService } from './employee.service'; // Example if a service existed
// import { MessageServiceService } from 'src/app/services/message-service.service'; // Example

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'] // Corrected styleUrl to styleUrls
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  employeeForm: FormGroup;
  displayedColumns: string[] = ['name', 'age', 'birthDate', 'salary', 'phoneNumber', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      age: new FormControl(null), // Assuming age is numeric, no specific validator for now
      birthDate: new FormControl(null),
      salary: new FormControl(null), // Assuming salary is numeric
      phoneNumber: new FormControl('') // No specific validator for now
    });
  }

  ngOnInit(): void {
    // In a real app, you might load data from a service here
    // For now, we can initialize with empty data or mock data
    // this.loadEmployees();
    this.dataSource.data = []; // Initialize with empty data
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      console.log('Form Submitted:', this.employeeForm.value);
      // Here you would typically add or update data
      // For example, add to dataSource and refresh
      // const newEmployee = this.employeeForm.value;
      // this.dataSource.data = [...this.dataSource.data, newEmployee];
      // this.resetForm();
    }
  }

  editData(employeeData: any): void {
    this.employeeForm.patchValue(employeeData);
  }

  deleteData(employeeId: any): void {
    console.log('Delete employee ID:', employeeId);
    // Filter out the employee to delete
    // this.dataSource.data = this.dataSource.data.filter(emp => emp.id !== employeeId);
  }

  resetForm(): void {
    this.employeeForm.reset();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Placeholder for loading data, if you were using a service
  // loadEmployees() {
  //   // this.employeeService.getEmployees().subscribe(data => {
  //   //   this.dataSource.data = data;
  //   // });
  // }
}
