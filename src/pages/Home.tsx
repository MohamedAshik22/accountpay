import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogOut from '../components/LogOut';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import LastFiveDaysSummary from '../components/LastSummary';
import { User } from 'lucide-react';
import UserList from '../components/UserList';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface IncomeExpense {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
    timestamp: string;
    updated_at: string;
}

interface DailySummary {
    date: string;
    income: number;
    expense: number;
}

const Home: React.FC = () => {
    const [records, setRecords] = useState<IncomeExpense[]>([]);
    const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpense[]>([]);
    const [firstName, setFirstName] = useState('');

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) return;

            try {
                const res = await axios.get(`${apiUrl}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setFirstName(res.data.firstName);
            } catch (err) {
                console.error('Failed to fetch user details', err);
            }
        };

        fetchUserDetails();
    }, []);

    // Fetch income-expense records
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`${apiUrl}/income-expenses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(response.data)) {
                    const processed = response.data.map((r) => ({
                        ...r,
                        timestamp: r.updated_at,
                    }));
                    setIncomeExpenses(processed);
                    setRecords(processed); // Storing the same data to `records` for use in LastFiveDaysSummary
                }
            } catch (err) {
                console.error('Failed to fetch analytics data', err);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <div className="flex flex-col items-center mt-10 space-y-6">
            <h1 className="text-2xl font-bold">Welcome {firstName}</h1>

            <div className="w-1/2 flex space-x-4">
            <UserList />
                {/* Pass the records to both AnalyticsDashboard and LastFiveDaysSummary components */}
                <AnalyticsDashboard records={incomeExpenses} />
                <LastFiveDaysSummary records={records} /> {/* Updated to use the `records` state */}
            </div>
            <LogOut />
        </div>
    );
};

export default Home;
