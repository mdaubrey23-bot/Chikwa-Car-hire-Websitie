/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Page {
  HOME = 'home',
  FLEET = 'fleet',
  QUOTE = 'quote',
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  ADMIN = 'admin',
}

export interface Car {
  id: string;
  name: string;
  category: 'Economy' | 'SUV' | 'Luxury' | 'Van';
  passengers: number;
  luggage: number;
  transmission: 'Automatic' | 'Manual';
  pricePerDay: number;
  image: string;
}

export interface QuoteData {
  reference: string;
  customerName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  dropoffDateTime: string;
  car: Car;
  extras: {
    driver: boolean;
    insurance: boolean;
    childSeat: boolean;
  };
  durationDays: number;
  baseRate: number;
  extrasCost: number;
  subtotal: number;
  tax: number;
  total: number;
  validityDate: string;
  createdAt: string;
}

export interface InvoiceData extends QuoteData {
  invoiceNumber: string;
  dueDate: string;
  status: 'UNPAID' | 'PAID';
}

export interface ReceiptData extends InvoiceData {
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer';
}
