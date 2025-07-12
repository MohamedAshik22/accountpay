import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  CartesianGrid,
} from 'recharts';

interface IncomeExpense {
  type: 'income' | 'expense';
  amount: number;
  updated_at: string; // Use 'created_at' directly to extract the date
}

interface Props {
  records: IncomeExpense[];
}

const LastFiveDaysSummary: React.FC<Props> = ({ records }) => {
  const getLastFiveDaysSummary = () => {
    const today = new Date();
    const dates: string[] = [];

    // Generate dates for the last 5 days in 'YYYY-MM-DD' format
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]); // Date in 'YYYY-MM-DD' format
    }

    const summary = dates.map(date => ({
      date,
      income: 0,
      expense: 0,
    }));

    // Process records
    records.forEach(item => {
      const recordDate = item.updated_at.split('T')[0];
      const daySummary = summary.find(s => s.date === recordDate);

      if (daySummary) {
        if (item.type === 'income') daySummary.income += item.amount;
        else if (item.type === 'expense') daySummary.expense += item.amount;
      }
    });

    return summary;
  };

  const data = getLastFiveDaysSummary();

  return (
    <div className="w-full max-w-3xl p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Last 5 Days Summary
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" interval={0} // Show all dates
           tickFormatter={(dateStr) => {
            const dateObj = new Date(dateStr);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('default', { month: 'short' }); // 'Apr'
            return `${day} ${month}`;
          }}
          tick={{ fontSize: 14 }} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `₹${value.toFixed(2)}`}
          />
          <Legend />
          <Bar dataKey="income" fill="#16a34a" name="Income" />
          <Bar dataKey="expense" fill="#dc2626" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LastFiveDaysSummary;
