import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 import { RegistrationRoutes } from './registration.routing.module';
import { EmployeeComponent } from './employee/employee.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(RegistrationRoutes)
  ]
})
export class RegistrationModule { }
