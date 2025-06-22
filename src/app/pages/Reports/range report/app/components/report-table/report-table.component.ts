import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee, Sale, Inventory } from '../../models/report.model';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent {
  @Input() title: string = 'Report Results';
  @Input() data: any[] = [];
  @Input() reportType: 'employee' | 'sales' | 'inventory' = 'employee';
  
  @Output() generatePdf = new EventEmitter<void>();

  formatDate(date: Date): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString();
  }
}