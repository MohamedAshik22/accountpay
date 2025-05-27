import React, { useState } from "react";
import axios from "axios";

interface Props {
    userA: string;
    userB: string;
    netBalance: number;
    onClearSuccess: () => void;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const ClearRequestPanel: React.FC<Props> = ({ userA, userB, netBalance, onClearSuccess }) => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendClearRequest = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("User not authenticated.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await axios.post(
                `${apiUrl}/transactions/clear/request`,
                {
                    from_user: userA,
                    to_user: userB,
                    amount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onClearSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to send clear request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-xl border p-4 bg-white shadow space-y-3">
            {error && <p className="text-red-500">{error}</p>}


            {netBalance > 0 && (
                <div className="flex flex-col gap-2">
                    <input
                        type="number"
                        placeholder="Enter amount"
                        className="border p-2 rounded-lg"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                    <button
                        onClick={sendClearRequest}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Request Clear"}
                    </button>
                </div>

            )}

        </div>
    );
};
