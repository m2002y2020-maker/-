import React from 'react';
import { Stats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const data = [
    { name: 'مدفوعة', value: stats.paid, color: '#22c55e' },
    { name: 'غير مدفوعة', value: stats.unpaid, color: '#eab308' },
    { name: 'متأخرة', value: stats.overdue, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Cards Column */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">إجمالي المبيعات</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalAmount.toLocaleString()} ر.س</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">عدد الفواتير</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">الفواتير المدفوعة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">الفواتير المتأخرة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Chart Column */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 self-start">توزيع الحالات</h3>
        {data.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-gray-400 text-sm flex items-center justify-center h-48">
            لا توجد بيانات للعرض
          </div>
        )}
      </div>
    </div>
  );
};