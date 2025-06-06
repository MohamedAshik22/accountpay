import React from 'react';

interface IncomeExpense {
  type: 'income' | 'expense';
  amount: number;
  updated_at: string; // Use 'created_at' directly to extract the date
}

interface Summary {
  [date: string]: { income: number; expense: number };
}

interface Props {
  records: IncomeExpense[];
}

const LastFiveDaysSummary: React.FC<Props> = ({ records }) => {
  const getLastFiveDaysSummary = (): Summary => {
    const today = new Date();
    const dates: string[] = [];

    // Generate dates for the last 5 days in 'YYYY-MM-DD' format
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]); // Date in 'YYYY-MM-DD' format
    }

    const summary: Summary = {};
    dates.forEach(date => {
      summary[date] = { income: 0, expense: 0 };
    });

    // Process records
    records.forEach(item => {
      // Extract only the 'YYYY-MM-DD' portion of the date
      const recordDate = item.updated_at.split('T')[0]; // This extracts the date part

      // Check if the record's date is in the last 5 days' dates
      if (summary[recordDate]) {
        if (item.type === 'income') summary[recordDate].income += item.amount;
        else if (item.type === 'expense') summary[recordDate].expense += item.amount;
      }
    });

    return summary;
  };

  const summary = getLastFiveDaysSummary();

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Last 5 Days Summary</h2>
      <ul className="space-y-3">
        {Object.entries(summary).map(([date, { income, expense }]) => (
          <li key={date} className="grid grid-cols-2 gap-4 items-center py-2 border-b border-gray-200 last:border-none">
            <span className="text-gray-700">{date}</span>
            <div className="flex items-center justify-end space-x-4">
              <span className="text-green-600 font-medium">₹{income.toFixed(2)}</span>
              <span className="text-red-600 font-medium">₹{expense.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LastFiveDaysSummary;
