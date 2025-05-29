import React from 'react';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amount: string, description: string) => void;
  newRecordType: 'income' | 'expense';
  newRecordAmount: string;
  setNewRecordAmount: React.Dispatch<React.SetStateAction<string>>;
  newRecordDescription: string;
  setNewRecordDescription: React.Dispatch<React.SetStateAction<string>>;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  newRecordType,
  newRecordAmount,
  setNewRecordAmount,
  newRecordDescription,
  setNewRecordDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Add {newRecordType === 'income' ? 'Income' : 'Expense'}
        </h2>
        <input
          type="number"
          placeholder="Amount"
          value={newRecordAmount}
          onChange={(e) => setNewRecordAmount(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newRecordDescription}
          onChange={(e) => setNewRecordDescription(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(newRecordAmount, newRecordDescription)}
            className={`px-4 py-2 rounded ${newRecordType === 'income' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordModal;
