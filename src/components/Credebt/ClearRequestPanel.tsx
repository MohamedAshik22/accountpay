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
    const [showForm, setShowForm] = useState(false); // track form visibility

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
            setShowForm(false); // hide form after sending
            setAmount(0);       // reset input
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to send clear request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-xl bg-gray-100">
            {error && <p className="text-red-500">{error}</p>}

            {netBalance > 0 && (
                <div>
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                        >
                            Request Clear
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 mt-2">
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="border p-2 rounded-lg"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={sendClearRequest}
                                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Submit"}
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
