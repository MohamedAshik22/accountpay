import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LogOut from '../components/LogOut';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import LastFiveDaysSummary from '../components/LastSummary';
import { User } from 'lucide-react';
import UserList from '../components/UserList';
import UserByPhoneSearch from '../components/Credebt/UserByPhoneSearch';
import RecentUsers from '../components/RecentUsers';

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
    const userId = localStorage.getItem('userId') || '';
    
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

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
            } catch (err:any) {
                console.error('Failed to fetch user details', err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
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
        <div className=' bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100'>
            <div className="flex flex-col items-center pt-8">
                <h1 className="text-2xl font-bold text-fuchsia-600">Welcome {firstName}</h1>

                <div className="space-x-4 space-y-6 ">
                    <UserByPhoneSearch />
                    <RecentUsers loggedInUserId={userId} apiBaseUrl={apiUrl} />
                    {/* <UserList /> */}

                    {/* <AnalyticsDashboard records={incomeExpenses} /> */}
                    <LastFiveDaysSummary records={records} /> 
                </div>
            </div>
        </div>
    );
};

export default Home;
