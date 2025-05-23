import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialRoutes } from './material.routing';
import { ButtonsComponent } from './buttons/buttons.component';

import { GridComponent } from './grid/grid.component';
import { ListsComponent } from './lists/lists.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import {
  DialogComponent,
  DialogOverviewExampleDialogComponent
} from './dialog/dialog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatTooltipModule,
  MatSelectModule,
  CdkTableModule, // CdkTableModule was already there, keeping it
  DemoMaterialModule // DemoMaterialModule was already there, keeping it
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsComponent, // These seem to be custom components, not Angular Material modules directly
    GridComponent,    // Will keep them in imports but not typically in exports unless they are shared components
    ListsComponent,
    MenuComponent,
    TabsComponent,
    StepperComponent,
    ExpansionComponent,
    ChipsComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    ProgressComponent,
    DialogComponent,
    TooltipComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    ...materialModules
  ],
  exports: [
    ...materialModules
  ],
  providers: [],
})
export class MaterialComponentsModule {}
