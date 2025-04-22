
import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ItemRegComponent } from './item-reg/item-reg.component';
import { GrnComponent } from './grn/grn.component';


export const RegistrationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employee',
        component: EmployeeComponent,
      },
      {
        path: 'item',
        component: ItemRegComponent,
      },
      {
        path: 'grn',
        component: GrnComponent,
      }
    ],
  }
];
