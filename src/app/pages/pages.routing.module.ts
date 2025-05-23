import { RegistrationModule } from './registration/registration.module';
import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { EmployeeListComponent } from './Reports/Static Report/app/components/employee-list/employee-list.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'formDemo',
        component: FormDemoComponent,
      },
      {
        path: 'empList',
        component: EmployeeListComponent,
      }
    ],
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./registration/registration.module').then((m) => m.RegistrationModule),
  },
];
