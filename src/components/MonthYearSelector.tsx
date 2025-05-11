import React, { useEffect, useState } from 'react';

interface MonthYearSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  userCreatedDate: Date;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  userCreatedDate
}) => {
  const [monthsList, setMonthsList] = useState<{ month: number; year: number }[]>([]);
  const [yearsList, setYearsList] = useState<number[]>([]);

  useEffect(() => {
    const startDate = new Date(userCreatedDate);
    const endDate = new Date();

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth(); // 0-based (Jan = 0)
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth(); // 0-based

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    setYearsList(years);

    const months = [];
    for (let year = startYear; year <= endYear; year++) {
      const from = year === startYear ? startMonth : 0;
      const to = year === endYear ? endMonth : 11;
      for (let month = from; month <= to; month++) {
        months.push({ month, year });
      }
    }

    // Log the months for debugging
    console.log('Generated months list:', months);

    setMonthsList(months);

    // Default to current month/year if not already set
    if (
      selectedYear === undefined || selectedYear === null ||
      selectedMonth === undefined || selectedMonth === null
    ) {
      setSelectedMonth(endMonth);
      setSelectedYear(endYear);
    }
  }, [userCreatedDate, selectedMonth, selectedYear]);

  return (
    <div className="flex space-x-4">
      {/* Month-Year Combined Selector */}
      <select
        className="px-2 py-1 border rounded bg-white"
        value={`${selectedMonth}-${selectedYear}`}
        onChange={(e) => {
          const [month, year] = e.target.value.split('-').map(Number);
          setSelectedMonth(month);
          setSelectedYear(year);
        }}
      >
        {monthsList.map(({ month, year }) => (
          <option key={`${month}-${year}`} value={`${month}-${year}`}>
            {new Date(year, month, 1).toLocaleString('default', { month: 'long' })} {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearSelector;
