import { Injectable } from '@angular/core';
//@ts-ignore
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee, Sale, Inventory, ReportSummary } from '../models/report.model';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
// ... (imports remain unchanged)

export class PdfService {

  constructor() { }

  generateEmployeeReport(employees: Employee[], summary: ReportSummary, title: string): jsPDF {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);

    doc.setFontSize(12);
    doc.text('Report Summary', 14, 40);

    doc.setFontSize(10);
    doc.text(`Total Employees: ${summary.count}`, 14, 50);

    if (summary.averages) {
      doc.text(`Average Salary: $${summary.averages['salary'].toLocaleString()}`, 14, 57);
      doc.text(`Average Performance Rating: ${summary.averages['performance']}`, 14, 64);
    }

    if (summary.totals) {
      doc.text(`Total Salary Expense: $${summary.totals['salary'].toLocaleString()}`, 14, 71);
    }

    autoTable(doc, {
      startY: 80,
      head: [['ID', 'Name', 'Department', 'Position', 'Salary', 'Hire Date', 'Performance']],
      body: employees.map(emp => [
        emp.id,
        emp.name,
        emp.department,
        emp.position,
        `$${emp.salary.toLocaleString()}`,
        format(emp.hireDate, 'MM/dd/yyyy'),
        emp.performance
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    return doc;
  }

  generateSalesReport(sales: Sale[], summary: ReportSummary, title: string): jsPDF {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);

    doc.setFontSize(12);
    doc.text('Report Summary', 14, 40);

    doc.setFontSize(10);
    doc.text(`Total Sales: ${summary.count}`, 14, 50);

    if (summary.averages) {
      doc.text(`Average Quantity: ${summary.averages['quantity']}`, 14, 57);
      doc.text(`Average Revenue: $${summary.averages['revenue'].toLocaleString()}`, 14, 64);
    }

    if (summary.totals) {
      doc.text(`Total Quantity Sold: ${summary.totals['quantity']}`, 14, 71);
      doc.text(`Total Revenue: $${summary.totals['revenue'].toLocaleString()}`, 14, 78);
    }

    autoTable(doc, {
      startY: 85,
      head: [['ID', 'Product', 'Category', 'Quantity', 'Unit Price', 'Total Price', 'Date', 'Customer']],
      body: sales.map(sale => [
        sale.id,
        sale.product,
        sale.category,
        sale.quantity,
        `$${sale.unitPrice.toLocaleString()}`,
        `$${sale.totalPrice.toLocaleString()}`,
        format(sale.date, 'MM/dd/yyyy'),
        sale.customer
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    return doc;
  }

  generateInventoryReport(inventory: Inventory[], summary: ReportSummary, title: string): jsPDF {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);

    doc.setFontSize(12);
    doc.text('Report Summary', 14, 40);

    doc.setFontSize(10);
    doc.text(`Total Inventory Items: ${summary.count}`, 14, 50);

    if (summary.averages) {
      doc.text(`Average Quantity per Item: ${summary.averages['quantity']}`, 14, 57);
    }

    if (summary.totals) {
      doc.text(`Total Quantity in Stock: ${summary.totals['quantity']}`, 14, 64);
    }

    autoTable(doc, {
      startY: 75,
      head: [['ID', 'Product', 'Category', 'Quantity', 'Location', 'Last Restocked', 'Min Required']],
      body: inventory.map(item => [
        item.id,
        item.product,
        item.category,
        item.quantity,
        item.location,
        format(item.lastRestocked, 'MM/dd/yyyy'),
        item.minimumRequired
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    return doc;
  }
}
