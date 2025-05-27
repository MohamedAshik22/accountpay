import React from 'react';

interface BalanceCardProps {
  netBalance: number | undefined; // or number | null
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ netBalance }) => {
  const formattedBalance =
    typeof netBalance === 'number' ? netBalance.toFixed(2) : '0.00';

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Net Balance</h2>
      <p className={`text-2xl font-bold ${netBalance && netBalance < 0 ? 'text-green-500' : 'text-red-600'}`}>
        ₹ {formattedBalance}
      </p>
    </div>
  );
};
