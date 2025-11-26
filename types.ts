export enum InvoiceStatus {
  Paid = 'مدفوعة',
  Unpaid = 'غير مدفوعة',
  Overdue = 'متأخرة',
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  date: string; // ISO date string
  status: InvoiceStatus;
  description: string;
}

export interface Stats {
  total: number;
  paid: number;
  unpaid: number;
  overdue: number;
  totalAmount: number;
}