import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumberRange, DateRange } from '../../models/report.model';

@Component({
  selector: 'app-range-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="range-selector card">
      <div class="range-header">
        <h3>{{ title }}</h3>
        <button class="btn btn-primary" (click)="applyFilter()">Apply</button>
      </div>

      <ng-container *ngIf="type === 'date'">
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input 
            type="date" 
            class="form-control" 
            [(ngModel)]="dateRange.start" 
            [max]="formatDate(dateRange.end)"
          />
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input 
            type="date" 
            class="form-control" 
            [(ngModel)]="dateRange.end" 
            [min]="formatDate(dateRange.start)"
          />
        </div>
      </ng-container>

      <ng-container *ngIf="type === 'number'">
        <div class="range-labels">
          <span>{{ min }}</span>
          <span>{{ max }}</span>
        </div>
        <div class="range-inputs">
          <input 
            type="range" 
            class="range-slider"
            [min]="min" 
            [max]="max" 
            [step]="step"
            [(ngModel)]="numberRange.min"
            (input)="onMinChange()"
          />
          <input 
            type="range" 
            class="range-slider"
            [min]="min" 
            [max]="max" 
            [step]="step"
            [(ngModel)]="numberRange.max"
            (input)="onMaxChange()"
          />
        </div>
        <div class="range-values">
          <span>{{ numberRange.min | number }}</span>
          <span>{{ numberRange.max | number }}</span>
        </div>
      </ng-container>

      <div class="range-actions">
        <button class="btn" (click)="resetFilter()">Reset</button>
      </div>
    </div>
  `,
  styles: [`
    .range-selector {
      margin-bottom: var(--spacing-md);
    }
    
    .range-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .range-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .range-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    .range-inputs {
      position: relative;
      height: 40px;
    }
    
    .range-slider {
      position: absolute;
      width: 100%;
      pointer-events: none;
      -webkit-appearance: none;
      appearance: none;
      height: 4px;
      background: transparent;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .range-slider::-webkit-slider-runnable-track {
      height: 4px;
      background: var(--primary-color);
    }
    
    .range-slider::-webkit-slider-thumb {
      pointer-events: auto;
      -webkit-appearance: none;
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      margin-top: -8px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .range-values {
      display: flex;
      justify-content: space-between;
      margin-top: var(--spacing-xs);
      font-size: 14px;
    }
    
    .range-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--spacing-md);
    }
  `]
})
export class RangeSelectorComponent {
  @Input() title: string = 'Range Filter';
  @Input() type: 'date' | 'number' = 'number';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  @Output() rangeChange = new EventEmitter<NumberRange | DateRange>();

  dateRange: DateRange = {
    start: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
    end: new Date()
  };

  numberRange: NumberRange = {
    min: 0,
    max: 100
  };

  ngOnInit() {
    // Initialize the number range to match the min/max props
    this.numberRange = {
      min: this.min,
      max: this.max
    };
  }

  onMinChange() {
    if (this.numberRange.min > this.numberRange.max) {
      this.numberRange.max = this.numberRange.min;
    }
  }

  onMaxChange() {
    if (this.numberRange.max < this.numberRange.min) {
      this.numberRange.min = this.numberRange.max;
    }
  }

  applyFilter() {
    if (this.type === 'date') {
      this.rangeChange.emit(this.dateRange);
    } else {
      this.rangeChange.emit(this.numberRange);
    }
  }

  resetFilter() {
    if (this.type === 'date') {
      this.dateRange = {
        start: new Date(new Date().getFullYear(), 0, 1),
        end: new Date()
      };
    } else {
      this.numberRange = {
        min: this.min,
        max: this.max
      };
    }
    this.applyFilter();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;

    return [year, month, day].join('-');
  }
}