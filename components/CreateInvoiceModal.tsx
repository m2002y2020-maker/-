import React, { useState } from 'react';
import { Button } from './Button';
import { InvoiceStatus } from '../types';
import { X } from 'lucide-react';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(InvoiceStatus.Unpaid);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName,
      amount: parseFloat(amount),
      date,
      status,
      description
    });
    // Reset
    setClientName('');
    setAmount('');
    setDescription('');
    setStatus(InvoiceStatus.Unpaid);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">إضافة فاتورة جديدة</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
            <input 
              required
              type="text" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="مثال: شركة التقنية الحديثة"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ر.س)</label>
              <input 
                required
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
              <input 
                required
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              {Object.values(InvoiceStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات (وصف الخدمة)</label>
             <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="اكتب وصفاً مختصراً..."
             />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit" className="w-full">حفظ الفاتورة</Button>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full">إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
};