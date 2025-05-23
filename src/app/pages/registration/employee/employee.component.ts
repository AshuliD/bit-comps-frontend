import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms'; // Added NgForm
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/services/employee/employee.service'; // Verified path
import { MessageServiceService } from 'src/app/services/message-service/message-service.service'; // Verified path

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  employeeForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'age', 'birthDate', 'salary', 'phoneNumber', 'actions']; // Added 'id'
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formDirective') private formDirective!: NgForm; // For resetting form state

  // Mode and state management
  mode: 'Save' | 'Edit' = 'Save';
  saveBtnLabel: string = 'Save Employee';
  selectedData: any = null; // To store employee data for editing

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private messageService: MessageServiceService
  ) {
    this.employeeForm = this.fb.group({
      id: [null], // Added id field, might be useful, though not directly edited
      name: new FormControl('', [Validators.required]),
      age: new FormControl(null),
      birthDate: new FormControl(null),
      salary: new FormControl(null),
      phoneNumber: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    // Initial form state setup is done in constructor and resetForm
    this.resetForm(); // Ensures form is in a clean state initially
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        // Paginator and sort are set in ngAfterViewInit
        // If data loads before ngAfterViewInit, they will be applied once available
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        this.messageService.showError('Failed to load employees.');
      }
    });
  }

  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.messageService.showError('Please fill all required fields correctly.');
      return;
    }

    const employeeData = this.employeeForm.value;

    if (this.mode === 'Edit' && this.selectedData && this.selectedData.id) {
      // Update operation
      this.employeeService.updateEmployee(this.selectedData.id, employeeData).subscribe({
        next: (response) => {
          this.messageService.showSuccess('Employee updated successfully!');
          this.loadEmployees();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.messageService.showError('Failed to update employee.');
        }
      });
    } else {
      // Save (add) operation
      // Remove 'id' if it's null or undefined, as backend might auto-generate it
      const { id, ...dataWithoutId } = employeeData;
      const dataToSend = this.mode === 'Save' ? dataWithoutId : employeeData;


      this.employeeService.addEmployee(dataToSend).subscribe({
        next: (response) => {
          this.messageService.showSuccess('Employee added successfully!');
          this.loadEmployees();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          this.messageService.showError('Failed to add employee.');
        }
      });
    }
  }

  editData(employeeData: any): void {
    this.mode = 'Edit';
    this.saveBtnLabel = 'Update Employee';
    this.selectedData = employeeData;
    this.employeeForm.patchValue(employeeData);
    // If you have a form directive, you can mark controls as dirty if needed
    // if (this.formDirective) {
    //   Object.keys(this.employeeForm.controls).forEach(key => {
    //     this.employeeForm.controls[key].markAsDirty();
    //   });
    // }
  }

  deleteData(employeeId: string | number): void { // Changed parameter to employeeId
    if (!employeeId) {
      this.messageService.showError('Cannot delete employee without an ID.');
      return;
    }
    // Optional: Add a confirmation dialog here
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.messageService.showSuccess('Employee deleted successfully!');
        this.loadEmployees();
        if (this.selectedData && this.selectedData.id === employeeId) {
          this.resetForm(); // Reset form if the deleted item was being edited
        }
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.messageService.showError('Failed to delete employee.');
      }
    });
  }

  resetForm(): void {
    if (this.formDirective) {
      this.formDirective.resetForm(); // Resets form state, errors, touched, dirty
    }
    this.employeeForm.reset({ // Resets form values to initial (or specified) state
      name: '',
      age: null,
      birthDate: null,
      salary: null,
      phoneNumber: null,
      id: null
    });
    this.mode = 'Save';
    this.saveBtnLabel = 'Save Employee';
    this.selectedData = null;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
