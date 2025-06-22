import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSummary } from '../../models/report.model';

@Component({
  selector: 'app-report-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-summary.component.html',
  styles: [`
    .summary-card {
      background-color: var(--background-light);
      margin-bottom: var(--spacing-md);
    }
    
    .summary-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-sm);
      border-bottom: 1px solid var(--border-color);
    }
    
    .summary-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-md);
    }
    
    .summary-stat {
      display: flex;
      flex-direction: column;
    }
    
    .stat-label {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: var(--spacing-xs);
    }
    
    .stat-value {
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    @media (max-width: 768px) {
      .summary-content {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .summary-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportSummaryComponent {
  @Input() summary: ReportSummary | null = null;
  @Input() reportType: 'employee' | 'sales' | 'inventory' = 'employee';
}