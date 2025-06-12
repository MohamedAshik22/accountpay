import React, { useEffect, useRef } from 'react';


interface IncomeExpense {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  timestamp: string; // Add timestamp to the interface
}


interface EditRecordFormProps {
  editingRecord: IncomeExpense;
  setEditingRecord: React.Dispatch<React.SetStateAction<IncomeExpense | null>>;
  handleEdit: () => void;
}

const EditRecordForm: React.FC<EditRecordFormProps> = ({
  editingRecord,
  setEditingRecord,
  handleEdit
}) => {
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRecord && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [editingRecord]);

  return (
    <div className="flex flex-col w-full">
      <input
        type="number"
        ref={amountInputRef}
        value={editingRecord.amount}
        onChange={(e) => setEditingRecord({
          ...editingRecord,
          amount: parseFloat(e.target.value)
        })}
        className="w-full mb-2 p-1 border rounded"
        placeholder="Amount"
      />
      <input
        type="text"
        value={editingRecord.description}
        onChange={(e) => setEditingRecord({
          ...editingRecord,
          description: e.target.value
        })}
        className="w-full mb-2 p-1 border rounded"
        placeholder="Description"
      />
      <div className="flex justify-between">
        <button
          onClick={handleEdit}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Save
        </button>
        <button
          onClick={() => setEditingRecord(null)}
          className="bg-gray-500 text-white px-2 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditRecordForm;