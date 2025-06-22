import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilters } from '../../models/report.model';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-filters card">
      <div class="filter-header">
        <h3>Search Filters</h3>
        <div class="filter-actions">
          <button class="btn" (click)="resetFilters()">Reset</button>
          <button class="btn btn-primary" (click)="applyFilters()">Apply Filters</button>
        </div>
      </div>

      <div class="filter-section">
        <div class="form-group">
          <label class="form-label">Search Term</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search..." 
            [(ngModel)]="filters.searchText"
          />
        </div>
      </div>

      <div class="filter-section" *ngIf="showCategoryFilter">
        <h4>Categories</h4>
        <div class="checkbox-group">
          <div class="checkbox-item" *ngFor="let category of availableCategories">
            <input 
              type="checkbox" 
              [id]="'cat-' + category" 
              [checked]="isSelectedCategory(category)"
              (change)="toggleCategory(category)"
            />
            <label [for]="'cat-' + category">{{ category }}</label>
          </div>
        </div>
      </div>

      <div class="filter-section" *ngIf="showDepartmentFilter">
        <h4>Departments</h4>
        <div class="checkbox-group">
          <div class="checkbox-item" *ngFor="let department of availableDepartments">
            <input 
              type="checkbox" 
              [id]="'dept-' + department" 
              [checked]="isSelectedDepartment(department)"
              (change)="toggleDepartment(department)"
            />
            <label [for]="'dept-' + department">{{ department }}</label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-filters {
      margin-bottom: var(--spacing-md);
    }
    
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .filter-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .filter-actions {
      display: flex;
      gap: var(--spacing-sm);
    }
    
    .filter-section {
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
    }
    
    .filter-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    
    .filter-section h4 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: 14px;
      font-weight: 500;
    }
    
    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--spacing-sm);
    }
    
    .checkbox-item {
      display: flex;
      align-items: center;
    }
    
    .checkbox-item input {
      margin-right: var(--spacing-sm);
    }
    
    @media (max-width: 768px) {
      .filter-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .filter-actions {
        margin-top: var(--spacing-sm);
        width: 100%;
      }
      
      .filter-actions button {
        flex: 1;
      }
      
      .checkbox-group {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SearchFiltersComponent implements OnInit {
  @Input() showCategoryFilter: boolean = true;
  @Input() showDepartmentFilter: boolean = true;
  @Input() availableCategories: string[] = [];
  @Input() availableDepartments: string[] = [];
  
  @Output() filtersChanged = new EventEmitter<SearchFilters>();
  
  filters: SearchFilters = {
    searchText: '',
    categories: [],
    departments: []
  };
  
  ngOnInit() {
    this.resetFilters();
  }
  
  isSelectedCategory(category: string): boolean {
    return this.filters.categories?.includes(category) || false;
  }
  
  isSelectedDepartment(department: string): boolean {
    return this.filters.departments?.includes(department) || false;
  }
  
  toggleCategory(category: string) {
    if (!this.filters.categories) {
      this.filters.categories = [];
    }
    
    if (this.isSelectedCategory(category)) {
      this.filters.categories = this.filters.categories.filter(c => c !== category);
    } else {
      this.filters.categories.push(category);
    }
  }
  
  toggleDepartment(department: string) {
    if (!this.filters.departments) {
      this.filters.departments = [];
    }
    
    if (this.isSelectedDepartment(department)) {
      this.filters.departments = this.filters.departments.filter(d => d !== department);
    } else {
      this.filters.departments.push(department);
    }
  }
  
  applyFilters() {
    this.filtersChanged.emit({...this.filters});
  }
  
  resetFilters() {
    this.filters = {
      searchText: '',
      categories: [],
      departments: []
    };
    this.filtersChanged.emit({...this.filters});
  }
}