import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { RegistrationModule } from './registration/registration.module';
import { MaterialComponentsModule } from '../material-component/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemRegComponent } from './registration/item-reg/item-reg.component';
import { GrnComponent } from './registration/grn/grn.component';
import { EmployeeComponent } from './registration/employee/employee.component';
import { E } from '@angular/cdk/keycodes';

@NgModule({
  declarations: [FormDemoComponent,ItemRegComponent,GrnComponent,EmployeeComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesRoutes),
    ReactiveFormsModule,
    RegistrationModule,
    MaterialComponentsModule,


  ],
  exports: [],
})
export class PagesModule {}
