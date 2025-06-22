export interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  performance: number;
}

export interface Sale {
  id: number;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: Date;
  customer: string;
}

export interface Inventory {
  id: number;
  product: string;
  category: string;
  quantity: number;
  location: string;
  lastRestocked: Date;
  minimumRequired: number;
}

export type ReportItem = Employee | Sale | Inventory;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface NumberRange {
  min: number;
  max: number;
}

export interface SearchFilters {
  dateRange?: DateRange;
  salaryRange?: NumberRange;
  quantityRange?: NumberRange;
  priceRange?: NumberRange;
  searchText?: string;
  categories?: string[];
  departments?: string[];
}

export interface ReportConfig {
  title: string;
  description: string;
  type: 'employee' | 'sales' | 'inventory';
}

export interface ReportSummary {
  count: number;
  dateRange?: DateRange;
  averages?: { [key: string]: number };
  totals?: { [key: string]: number };
}