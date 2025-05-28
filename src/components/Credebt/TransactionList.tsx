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
    <div className="space-y-3 bg-white">
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        transactions.map((tx) => {
          const isSender = tx.from === userA;
          const isClearAccepted = tx.message === "Clear request accepted";

          return (
            <div
              key={tx.id}
              className={`flex ${isClearAccepted ? "w-full justify-center":isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={` p-3 rounded-lg shadow-md border ${
                  isClearAccepted
                    ? "bg-purple-100 text-purple-700 flex gap-4 items-center" : isSender ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
              >
                 <p className="font-bold text-right">
                  {isSender ? `₹${tx.amount}` : `₹${tx.amount}`}
                </p>
                <p className="font-semibold text-right">{tx.message || "(No message)"}</p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.CreatedAt).toLocaleString()}
                </p>
               
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
