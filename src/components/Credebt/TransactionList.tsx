import React from "react";

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  message: string;
  CreatedAt: string;
}

interface Props {
  transactions?: Transaction[];
  userA: string;
}

export const TransactionList: React.FC<Props> = ({ transactions = [], userA }) => {
  return (
    <div className="border rounded-xl p-4 space-y-3 shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        transactions.map((tx) => {
          const isSender = tx.from === userA;

          return (
            <div
              key={tx.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs w-fit p-3 rounded-lg shadow-md border ${
                  isSender ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
              >
                <p className="font-semibold">{tx.message || "(No message)"}</p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.CreatedAt).toLocaleString()}
                </p>
                <p className="font-bold mt-1 text-right">
                  {isSender ? `₹${tx.amount}` : `₹${tx.amount}`}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
