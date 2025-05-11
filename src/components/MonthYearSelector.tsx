import React from 'react';

interface MonthYearSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear
}) => {
  return (
    <div className="flex space-x-4">
      <select
        className="px-2 py-1 border rounded bg-white"
        defaultValue={`${selectedMonth + 1}-${selectedYear}`}
        onChange={(e) => {
          const [month, year] = e.target.value.split('-');
          setSelectedMonth(parseInt(month) - 1);
          setSelectedYear(parseInt(year));
        }}
      >
        {Array.from({ length: 12 }, (_, index) => index).map((month) => (
          <option key={month + 1} value={`${month + 1}-${selectedYear}`}>
            {new Date(selectedYear, month, 1).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      <select
        className="px-2 py-1 border rounded bg-white"
        defaultValue={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
      >
        {[2024, 2025, 2026].map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearSelector;