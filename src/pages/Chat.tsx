import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BalanceCard } from "../components/Credebt/BalanceCard";
import { Transaction, TransactionList } from "../components/Credebt/TransactionList";
import { ClearRequestPanel } from "../components/Credebt/ClearRequestPanel";
import { NewTransactionForm } from "../components/Credebt/NewTransactionForm";
import { ClearRequestList } from "../components/Credebt/ClearRequestList";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ChatPage: React.FC = () => {
    const { userA, userB } = useParams<{ userA: string; userB: string }>();
    const [userBInfo, setUserBInfo] = useState<{ firstName: string } | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [clearRequests, setClearRequests] = useState<Transaction[]>([]); // reusing Transaction type
    const combinedTransactions = [...transactions, ...clearRequests];



    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("User not authenticated.");
            return;
        }

        try {
            setError(null); // clear previous errors

            const [txRes, balRes, userRes] = await Promise.all([
                axios.get(`${apiUrl}/chat/${userA}/${userB}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${apiUrl}/transactions/balance/${userA}/${userB}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${apiUrl}/users/${userB}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setTransactions(txRes.data.transactions || []);
            setBalance(balRes.data.net_balance ?? 0);
            setUserBInfo(userRes.data);
            console.log(userRes.data);

        } catch (err: any) {
            console.error("Failed to fetch transaction data", err);
            setError(err.response?.data?.error || "Something went wrong while fetching data.");
        }
    };

    const handleAccept = () => {
        console.log("Clear request accepted");
    };

    useEffect(() => {
        if (userA && userB) {
            fetchData();
        }
    }, [userA, userB]);

    if (!userA || !userB) return <p className="text-center mt-10">Invalid users.</p>;

    return (
        <div className="bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100">
        <div className="p-6 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 max-w-4xl mx-auto h-[90vh] flex flex-col space-y-4">
        {/* <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6 flex flex-col"> */}
            <h1 className="text-2xl font-bold">{userBInfo?.firstName}</h1>

            {error && <p className="text-red-500">{error}</p>}
            <div className=" flex justify-between bg-gray-100">
                <BalanceCard netBalance={balance} />
                {balance > 0 && (
                    <ClearRequestPanel userA={userA} userB={userB} netBalance={balance} onClearSuccess={fetchData} />
                )}
            </div>

                <ClearRequestList
                    senderId={userB}
                    receiverId={userA}
                    onAccept={handleAccept}
                />
                  <div className="flex-1 overflow-y-auto  rounded-xl p-2 bg-white shadow">
            <TransactionList transactions={combinedTransactions} userA={userA} />
            </div>
            <NewTransactionForm userA={userA} userB={userB} onTransactionCreated={fetchData} />
        </div>
        </div>
    );
};

export default ChatPage;
