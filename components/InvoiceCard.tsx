import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { Button } from './Button';
import { FileText, Play, DollarSign, Calendar, User, Loader2 } from 'lucide-react';
import { generateSpeech, playAudioBuffer } from '../services/geminiService';

interface InvoiceCardProps {
  invoice: Invoice;
  onDelete: (id: string) => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    setIsPlaying(true);
    try {
      // Create a natural language summary for Arabic TTS
      const textToSpeak = `فاتورة للعميل ${invoice.clientName}. القيمة: ${invoice.amount} ريال. التاريخ: ${invoice.date}. الحالة: ${invoice.status}. ${invoice.description ? `الملاحظات: ${invoice.description}` : ''}`;
      
      const buffer = await generateSpeech(textToSpeak);
      await playAudioBuffer(buffer);
    } catch (error) {
      console.error("Failed to play audio", error);
      alert("حدث خطأ أثناء محاولة قراءة الفاتورة");
    } finally {
      setIsPlaying(false);
    }
  };

  const statusColors = {
    [InvoiceStatus.Paid]: "bg-green-100 text-green-800 border-green-200",
    [InvoiceStatus.Unpaid]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [InvoiceStatus.Overdue]: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{invoice.clientName}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[invoice.status]}`}>
              {invoice.status}
            </span>
          </div>
        </div>
        <div className="text-left">
          <div className="font-bold text-xl text-gray-900">{invoice.amount.toLocaleString()} ر.س</div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{invoice.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="truncate">{invoice.description}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleSpeak} 
          disabled={isPlaying}
          className="text-xs"
        >
          {isPlaying ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          <span className="mr-2">{isPlaying ? "جاري القراءة..." : "قراءة الفاتورة"}</span>
        </Button>
        
        <Button 
          variant="danger" 
          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none px-3 py-1.5 text-xs"
          onClick={() => onDelete(invoice.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  );
};