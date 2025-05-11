import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

interface Record {
    type: 'income' | 'expense';
    amount: number;
    timestamp: string;
}

interface Props {
    records: Record[];
}

const AnalyticsDashboard: React.FC<Props> = ({ records }) => {
    const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const getGroupedData = (timePeriod: 'daily' | 'weekly' | 'monthly') => {
        let groupedData: { [key: string]: { income: number; expense: number; net: number } } = {};

        records.forEach(r => {
            const date = new Date(r.timestamp);
            let groupKey = '';

            switch (timePeriod) {
                case 'daily':
                    // Use the full date (YYYY-MM-DD) as the key for daily grouping
                    groupKey = date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    // Calculate the week number for weekly grouping
                    const weekNumber = Math.floor(date.getDate() / 7);
                    groupKey = `${date.getFullYear()}-W${weekNumber + 1}`;
                    break;
                case 'monthly':
                    // Use the month name for monthly grouping
                    groupKey = new Date(0, date.getMonth()).toLocaleString('default', { month: 'short' });
                    break;
            }

            if (!groupedData[groupKey]) {
                groupedData[groupKey] = { income: 0, expense: 0, net: 0 };
            }

            if (r.type === 'income') {
                groupedData[groupKey].income += r.amount;
            } else {
                groupedData[groupKey].expense += r.amount;
            }

            groupedData[groupKey].net = groupedData[groupKey].income - groupedData[groupKey].expense;
        });

        return Object.entries(groupedData).map(([key, value]) => ({
            period: key,
            income: value.income,
            expense: value.expense,
            net: value.net
        }));
    };

    const groupedData = getGroupedData(timePeriod);

    return (
        <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>

            {/* Time period selection */}
            <div className="mb-4">
                <button
                    className={`px-4 py-2 mr-2 ${timePeriod === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTimePeriod('daily')}
                >
                    Daily
                </button>
                <button
                    className={`px-4 py-2 mr-2 ${timePeriod === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTimePeriod('weekly')}
                >
                    Weekly
                </button>
                <button
                    className={`px-4 py-2 ${timePeriod === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTimePeriod('monthly')}
                >
                    Monthly
                </button>
            </div>

            {/* Bar Chart: Income vs Expense */}
            <div className="mb-8">
                <h3 className="text-md font-semibold mb-2">{`${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Income vs Expense`}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={groupedData}>
                        <CartesianGrid strokeDasharray="6 " />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="income" fill="#4ade80" />
                        <Bar dataKey="expense" fill="#f87171" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
