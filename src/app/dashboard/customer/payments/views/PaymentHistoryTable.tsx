'use client';

import React from 'react';
import { PaymentRecord } from '@/types';
import { Download, Receipt, CheckCircle, ExternalLink } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface Props {
  payments: PaymentRecord[];
}

export default function PaymentHistoryTable({ payments }: Props) {
  // Download clean PDF invoice
  const handleDownloadInvoice = (p: PaymentRecord) => {
    try {
      const doc = new jsPDF();

      // FixMate Header
      doc.setFillColor(37, 99, 235); // Blue
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('FixMate Repair Receipt', 14, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Smart Device & Appliance Repair Hub', 130, 20);

      // Invoice metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Receipt Details', 14, 45);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Receipt ID: ${p.transactionId}`, 14, 55);
      doc.text(`Date: ${new Date(p.paidAt).toLocaleDateString()}`, 14, 62);
      doc.text(`Payment Gateway: Stripe Checkout`, 14, 69);
      doc.text(`Payment Status: PAID`, 14, 76);

      // Customer and Technician Box
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', 14, 90);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${p.customerName}`, 14, 98);
      doc.text(`Email: ${p.customerEmail}`, 14, 105);

      doc.setFont('helvetica', 'bold');
      doc.text('Technician Information', 120, 90);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${p.technicianName}`, 120, 98);
      doc.text(`Email: ${p.technicianEmail}`, 120, 105);

      // Item Table Line
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 120, 182, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Service Item', 18, 127);
      doc.text('Amount (USD)', 160, 127);

      doc.setFont('helvetica', 'normal');
      doc.text(p.serviceTitle, 18, 140);
      doc.text(`$${p.amount.toFixed(2)}`, 160, 140);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 150, 196, 150);

      // Total
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total Paid:', 130, 160);
      doc.text(`$${p.amount.toFixed(2)}`, 160, 160);

      // Footer notice
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Thank you for trusting FixMate. This is a computer-generated invoice with verified Stripe confirmation.',
        14,
        280
      );

      doc.save(`FixMate-Invoice-${p.transactionId.slice(-8)}.pdf`);
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      toast.error('Could not generate PDF invoice');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service Title</th>
              <th className="py-4 px-4">Technician</th>
              <th className="py-4 px-4">Amount Paid</th>
              <th className="py-4 px-4">Transaction ID</th>
              <th className="py-4 px-4">Payment Date</th>
              <th className="py-4 px-6 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="line-clamp-1">{p.serviceTitle}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-800">
                  {p.technicianName}
                </td>
                <td className="py-4 px-4 font-black text-slate-900 text-sm">
                  ${p.amount}
                </td>
                <td className="py-4 px-4 text-slate-500 font-mono text-[11px] truncate max-w-[150px]">
                  {p.transactionId}
                </td>
                <td className="py-4 px-4 text-slate-500">
                  {new Date(p.paidAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleDownloadInvoice(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Receipt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
