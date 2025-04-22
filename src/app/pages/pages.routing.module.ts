import { RegistrationModule } from './registration/registration.module';
import { Routes } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'formDemo',
        component: FormDemoComponent,
      }
    ],
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./registration/registration.module').then((m) => m.RegistrationModule),
  },
];
