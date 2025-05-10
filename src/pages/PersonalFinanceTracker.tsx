import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

interface IncomeExpense {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  timestamp: string;
  createdAt: string;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const IncomeExpense: React.FC = () => {
  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpense[]>([]);
  const [summary, setSummary] = useState<{ income: number; expense: number; netBalance: number }>({ income: 0, expense: 0, netBalance: 0 });
  const [editingRecord, setEditingRecord] = useState<IncomeExpense | null>(null);
  const [activeOptionsId, setActiveOptionsId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // New state for adding records
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'income' | 'expense'>('income');
  const [newRecordAmount, setNewRecordAmount] = useState('');
  const [newRecordDescription, setNewRecordDescription] = useState('');

  // State for delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    record: IncomeExpense | null;
  }>({
    isOpen: false,
    record: null
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view records');
        return;
      }

      const recordsResponse = await axios.get(`${apiUrl}/income-expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Records Response:', recordsResponse.data);

      if (Array.isArray(recordsResponse.data)) {
        const processedRecords = recordsResponse.data.map(record => {
          const timestamp = record.createdAt
            ? record.createdAt
            : (record.timestamp
              ? record.timestamp
              : new Date().toISOString());

          return {
            ...record,
            timestamp
          };
        });

        setIncomeExpenses(processedRecords);

        const selectedMonthRecords = processedRecords.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
        });

        const selectedMonthSummary = selectedMonthRecords.reduce((acc, record) => {
          if (record.type === 'income') {
            acc.income += record.amount;
          } else {
            acc.expense += record.amount;
          }
          acc.netBalance = acc.income - acc.expense;
          return acc;
        }, { income: 0, expense: 0, netBalance: 0 });

        setSummary(selectedMonthSummary);
      } else {
        setIncomeExpenses([]);
        console.error('Unexpected data format:', recordsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.options-menu')) {
        setActiveOptionsId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAdd = async () => {
    const amount = parseFloat(newRecordAmount);

    if (!amount) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add records');
        return;
      }

      const response = await axios.post(`${apiUrl}/income-expenses`,
        {
          type: newRecordType,
          amount,
          description: newRecordDescription || 'N/A'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset form and close modal
      setNewRecordAmount('');
      setNewRecordDescription('');
      setIsAddModalOpen(false);

      fetchData();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingRecord) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to edit records');
        return;
      }

      const response = await axios.put(`${apiUrl}/income-expenses/${editingRecord.id}`,
        {
          type: editingRecord.type,
          amount: editingRecord.amount,
          description: editingRecord.description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
      setEditingRecord(null);
    } catch (error) {
      console.error('Error editing record:', error);
    }
  };

  const handleDeleteConfirmation = (record: IncomeExpense) => {
    setDeleteConfirmation({
      isOpen: true,
      record: record
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.record) return;

    try {
      const recordToDelete = deleteConfirmation.record;
      
      console.group('Delete Record Confirmation');
      console.log('Deleting record:', recordToDelete);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete records');
        console.groupEnd();
        return;
      }

      const recordId = 
        recordToDelete.id || 
        (recordToDelete as any).recordId;

      if (!recordId) {
        console.error('No valid ID found for deletion');
        alert('Cannot delete record: Invalid ID');
        console.groupEnd();
        return;
      }

      const response = await axios.delete(`${apiUrl}/income-expenses/${recordId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete successful', response.data);
      await fetchData();
      
      // Reset confirmation state
      setDeleteConfirmation({ isOpen: false, record: null });
      setActiveOptionsId(null);

      console.groupEnd();
    } catch (error) {
      console.error('Delete Error:', error);
      alert(`Failed to delete record: ${axios.isAxiosError(error) ? error.response?.data?.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-md h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-zinc-200 p-4 rounded-t-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <select
              className="px-2 py-1 border rounded bg-white"
              defaultValue={`${selectedMonth + 1}-${selectedYear}`}
              onChange={(e) => {
                const [month, year] = e.target.value.split('-');
                setSelectedMonth(parseInt(month) - 1);
                setSelectedYear(parseInt(year));
              }}
            >
              {Array.from({ length: 12 }, (_, index) => index).map((month) => (
                <option key={month + 1} value={`${month + 1}-${selectedYear}`}>
                  {new Date(selectedYear, month, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              className="px-2 py-1 border rounded bg-white"
              defaultValue={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">
              Balance:{" "}
              <span className={summary.netBalance >= 0 ? "text-green-600" : "text-red-600"}>
                ₹{summary.netBalance.toFixed(2)}
              </span>
            </h2>
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-zinc-100 p-2 border-t border-zinc-200 shadow-inner">
        <div className="flex justify-between">
          <div className="text-green-700 bg-green-100 p-2 rounded flex-1 mr-2">
            <span className="font-semibold block mb-1">Total Income ₹{summary.income.toFixed(2)}</span>
          </div>
          <div className="text-red-700 bg-red-100 p-2 rounded flex-1 ml-2">
            <span className="font-semibold block mb-1">Total Expenses ₹{summary.expense.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-20 flex flex-col w-full px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto max-h-[calc(100vh-250px)]">
        {Array.isArray(incomeExpenses) && incomeExpenses
          .filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((record) => (
            <li
              key={record.id}
              className={`
                bg-white rounded-lg shadow-md p-3 flex items-center space-x-3 w-fit 
                ${record.type === "income"
                  ? "self-start justify-start"
                  : "self-end justify-end"}
              `}
            >
              {editingRecord && editingRecord.id === record.id ? (
                <div className="flex flex-col w-full">
                  <input
                    type="number"
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
              ) : (
                <div className="flex w-full justify-between items-center">
                  <div className={`flex-grow ${record.type === "income" ? "text-left" : "text-right"}`}>
                    <span className={`
                      text-lg font-bold 
                      ${record.type === "income" ? "text-green-600" : "text-red-600"}
                    `}>
                      ₹{record.amount.toFixed(2)}
                    </span>
                    <p className="text-gray-600 text-sm">{record.description}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(record.timestamp).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <div className="relative ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOptionsId(prevId =>
                          prevId === record.id ? null : record.id
                        );
                      }}
                      className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {activeOptionsId === record.id && (
                      <div className="absolute right-0 top-full z-10 bg-white border rounded shadow-lg options-menu mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRecord(record);
                            setActiveOptionsId(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirmation(record);
                          }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
      </div>

      <div className="absolute bottom-14 left-0 right-0 p-4 bg-white shadow-top">
        {selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear() && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setNewRecordType('income');
                setIsAddModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Income
            </button>
            <button
              onClick={() => {
                setNewRecordType('expense');
                setIsAddModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
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
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className={`px-4 py-2 rounded ${newRecordType === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
                  }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to delete this record?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteConfirmation({ isOpen: false, record: null })}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeExpense;
