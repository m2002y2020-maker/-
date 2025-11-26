import React, { useState, useMemo, useEffect } from 'react';
import { Invoice, InvoiceStatus, Stats } from './types';
import { InvoiceCard } from './components/InvoiceCard';
import { DashboardStats } from './components/DashboardStats';
import { CreateInvoiceModal } from './components/CreateInvoiceModal';
import { Button } from './components/Button';
import { Plus, Search, Layers, LayoutDashboard } from 'lucide-react';
import { generateSpeech, playAudioBuffer } from './services/geminiService';

// Mock Data
const MOCK_INVOICES: Invoice[] = [
  { id: '1', clientName: 'شركة الأفق الرقمي', amount: 4500.50, date: '2024-03-10', status: InvoiceStatus.Paid, description: 'تطوير موقع إلكتروني' },
  { id: '2', clientName: 'مؤسسة البناء الحديث', amount: 12000.00, date: '2024-03-15', status: InvoiceStatus.Unpaid, description: 'استشارات هندسية - المرحلة الأولى' },
  { id: '3', clientName: 'سالم محمد', amount: 750.00, date: '2024-02-28', status: InvoiceStatus.Overdue, description: 'تصميم شعار وهوية بصرية' },
  { id: '4', clientName: 'مطاعم السعادة', amount: 3200.00, date: '2024-03-20', status: InvoiceStatus.Unpaid, description: 'إدارة حملة إعلانية' },
];

const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [isReadingSummary, setIsReadingSummary] = useState(false);

  // Derived Stats
  const stats: Stats = useMemo(() => {
    return {
      total: invoices.length,
      paid: invoices.filter(i => i.status === InvoiceStatus.Paid).length,
      unpaid: invoices.filter(i => i.status === InvoiceStatus.Unpaid).length,
      overdue: invoices.filter(i => i.status === InvoiceStatus.Overdue).length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    };
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.clientName.includes(searchTerm) || inv.description.includes(searchTerm);
      const matchesFilter = filter === 'all' || inv.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, searchTerm, filter]);

  const handleAddInvoice = (newInvoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...newInvoiceData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      setInvoices(invoices.filter(i => i.id !== id));
    }
  };

  const handleReadSummary = async () => {
    setIsReadingSummary(true);
    try {
      const summaryText = `ملخص لوحة المعلومات. لديك ${stats.total} فواتير بإجمالي مبلغ ${stats.totalAmount} ريال. منها ${stats.paid} مدفوعة، و ${stats.unpaid} غير مدفوعة، و ${stats.overdue} متأخرة.`;
      const buffer = await generateSpeech(summaryText);
      await playAudioBuffer(buffer);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ في القراءة الصوتية');
    } finally {
      setIsReadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">فواتيري</h1>
            </div>
            <div className="flex items-center gap-2">
               <Button 
                variant="ghost" 
                onClick={handleReadSummary} 
                disabled={isReadingSummary}
                className="hidden md:flex"
              >
                {isReadingSummary ? 'جاري القراءة...' : 'قراءة الملخص'}
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={20} />
                <span className="mr-2">فاتورة جديدة</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="بحث باسم العميل أو الوصف..."
              className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              الكل
            </button>
            {Object.values(InvoiceStatus).map(status => (
              <button 
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice List */}
        {filteredInvoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map(invoice => (
              <InvoiceCard 
                key={invoice.id} 
                invoice={invoice} 
                onDelete={handleDeleteInvoice}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">لا توجد فواتير</h3>
            <p className="text-gray-500">جرب تغيير معايير البحث أو أضف فاتورة جديدة</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <CreateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddInvoice}
      />
    </div>
  );
};

export default App;