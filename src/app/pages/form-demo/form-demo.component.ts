import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FromDemoServiceService } from 'src/app/services/form-demo/from-demo-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

interface Jobs {
  id: number;
  role: string;
}

@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss'
})


export class FormDemoComponent implements OnInit {

  jobs: Jobs[] = [];

  displayedColumns: string[] = ['firstName', 'birthDate', 'age', 'gender', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>;
  demoForm: FormGroup;
  saveBtnLabel = 'Save';
  mode = 'Save';
  selectedData: any;
  isButtonDisabled: boolean | undefined;
  selectedRow: any = null;
  lastAddedRow: any = null;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: false }) inputField!: ElementRef; // Reference to the input element

  constructor(private fb: FormBuilder, private demoService: FromDemoServiceService, private msgService: MessageServiceService) {
    this.demoForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      age: new FormControl(''),
      email: new FormControl('', Validators.email),
      gender: new FormControl(''),
      birthDate: new FormControl(),
      role: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataPopulate();
    this.getJobRole();
  }

  dataPopulate(): void {

    try {
      this.demoService.getData().subscribe((response: any) => {
        console.log("get data Server Response", response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator; // Reassign paginator
        this.dataSource.sort = this.sort; // Reassign sort
      });
    } catch (error) {
      console.log(error);
    }
  }

  getJobRole(): void {
    this.demoService.getJobRole().subscribe({
      next: (response: any) => {
        console.log(response);
        this.jobs = response;

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit() {

    try {

      if (this.mode === 'edit') {

        // const originalDate = this.demoForm.value.birthDate; // Assuming it's a Date object
        // const formattedDate = originalDate.toISOString().split("T")[0]; // Extracts "2025-03-21"
        // this.demoForm.patchValue({ birthDate: formattedDate });

        this.demoService.editData(this.selectedData?.id, this.demoForm.value).subscribe({
          next: (response: any) => {
            console.log("put data Server Response", response);
            this.msgService.showSuccess("Record Successfully Edited");
            this.dataPopulate();
            setTimeout(() => {
              this.selectedRow = null;
            }, 2000);
          },
          error: (error) => {
            console.log(error);
            this.msgService.showError("Error in Edit Record" + error)
          }
        });

      } else if (this.mode === 'Save') {
         // const originalDate = this.demoForm.value.birthDate; // Assuming it's a Date object
        // const formattedDate = originalDate.toISOString().split("T")[0]; // Extracts "2025-03-21"

        // this.demoForm.patchValue({ birthDate: formattedDate }); // Ensures correct format
        console.log("Form Submitted");
        console.log(this.demoForm.value);

        this.demoService.serviceCall(this.demoForm.value).subscribe((response) => {
          this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
          this.dataSource.paginator = this.paginator; // Reassign paginator
          this.dataSource.sort = this.sort; // Reassign sort
          console.log("post data Server Response", response);
          this.msgService.showSuccess("Record Successfully Added");

          this.lastAddedRow = response; // Track the last added row
          console.log('Added new row:', response);

          setTimeout(() => {
            this.lastAddedRow = null;
          }, 3000);
        });
      }

      setTimeout(() => {
        // this.dataPopulate();
        this.isButtonDisabled = true;
        this.demoForm.disable();
        // this.resetData();
      }, 500);


    } catch (error) {
      console.log(error);
      this.msgService.showError("Error " + error);

    }

  }

  deleteData(data: any) {
    const id = data.id;
    this.demoService.deleteData(id).subscribe((response) => {
      console.log("post data Server Response", response);
      this.msgService.showSuccess("Record Successfully Deleted");
      this.dataPopulate();
    });
  }



  editData(data: any) {

    this.demoForm.patchValue(data);
    console.log(new Date(data.birthDate));

    this.demoForm.patchValue({birthDate:new Date(data.birthDate)})

    this.saveBtnLabel = 'edit';
    this.mode = 'edit';
    this.selectedData = data;
    this.demoForm.enable();
    this.isButtonDisabled = false;

    if (this.selectedRow && this.selectedRow.id === data.id) {
      // this.selectedRow = null; // Toggle off if clicked again
    } else {
      this.selectedRow = data; // Highlight the new row
    }
  }

  resetData(formDirective: FormGroupDirective) {
    this.demoForm.enable();
    formDirective.resetForm();
    this.demoForm.reset();
    this.saveBtnLabel = 'Save';
    this.mode = 'Save';
    this.isButtonDisabled = true;
    this.selectedRow = null;

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData() {
    this.selectedRow = null;
    if (this.inputField) {
      this.inputField.nativeElement.value = ''; // Clear the input field
    }
    this.dataSource.filter = ''; // Clear the filter on the dataSource
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page
    }
  }



}


