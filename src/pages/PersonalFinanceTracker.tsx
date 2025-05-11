import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import DeleteConfirmation from '../components/Delete';
import AddRecordModal from '../components/AddRecord';
import { MoreVertical } from 'lucide-react';
import MonthYearSelector from '../components/MonthYearSelector';
import EditRecordForm from '../components/EditRecordForm';

interface IncomeExpense {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  timestamp: string; // Add timestamp to the interface
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
          const timestamp = record.updated_at;
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
          description: newRecordDescription || 'N/A',
          timestamp: new Date().toISOString() // Explicitly set timestamp to current time
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
          description: editingRecord.description,
          timestamp: new Date().toISOString() // Explicitly set timestamp to current time
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
      setEditingRecord(null);
    } catch (error) {
      console.error('Error editing record:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/income-expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh the list after successful deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
      // Optional: Add user-friendly error handling
      alert('Failed to delete the record. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-md min-h-screen flex flex-col">
      <div className="page-container flex flex-col space-y-4">

        {/* HEADER SECTION */}
        <div className="header-section bg-zinc-200 p-4 rounded-t-lg shadow-sm">
          <div className="flex items-center justify-between">
            <MonthYearSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">
                Balance:{" "}
                <span className={summary.netBalance >= 0 ? "text-green-600" : "text-red-600"}>
                  ₹{summary.netBalance.toFixed(2)}
                </span>
              </h2>
              <Link to="/" className="text-blue-500 hover:underline">Home</Link>
            </div>
          </div>
        </div>

        <div className="summary-section bg-zinc-100 p-2 border-t border-zinc-200 shadow-inner">
          <div className="flex justify-between">
            <div className="text-green-700 bg-green-100 p-2 rounded flex-1 mr-2">
              <span className="font-semibold block mb-1">
                Total Income ₹{summary.income.toFixed(2)}
              </span>
            </div>
            <div className="text-red-700 bg-red-100 p-2 rounded flex-1 ml-2">
              <span className="font-semibold block mb-1">
                Total Expenses ₹{summary.expense.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* RECORDS LIST SECTION */}
        <div className="records-section space-y-2 pb-20 flex flex-col w-full px-2 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {Array.isArray(incomeExpenses) &&
            incomeExpenses
              .filter(record => {
                const recordDate = new Date(record.timestamp);
                return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
              })
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((record) => (
                <li
                  key={record.id}
                  className={`bg-white rounded-lg shadow-md p-3 flex items-center space-x-3 w-fit 
            ${record.type === "income" ? "self-start justify-start" : "self-end justify-end"}
          `}
                >
                  {editingRecord && editingRecord.id === record.id ? (
                    <EditRecordForm
                      editingRecord={editingRecord}
                      setEditingRecord={setEditingRecord}
                      handleEdit={handleEdit}
                    />
                  ) : (
                    <div className="flex w-full justify-between items-center">
                      <div className={`flex-grow ${record.type === "income" ? "text-left" : "text-right"}`}>
                        <span className={`text-lg font-bold ${record.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          ₹{record.amount.toFixed(2)}
                        </span>
                        <p className="text-gray-600 text-sm">{record.description}</p>
                        <p className="text-gray-600 text-sm">{new Date(record.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="relative ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOptionsId(prevId => prevId === record.id ? null : record.id);
                          }}
                          className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                        >
                          <MoreVertical className="h-5 w-5" />
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
                            <DeleteConfirmation onDelete={() => handleDelete(record.id)} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
        </div>

        {/* ADD BUTTON SECTION - Appears AFTER records list, not floating */}
        <div className="absolute bottom-14 left-0 right-0  p-4 bg-white shadow-top mt-4">
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
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <AddRecordModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAdd}
          newRecordType={newRecordType}
          newRecordAmount={newRecordAmount}
          setNewRecordAmount={setNewRecordAmount}
          newRecordDescription={newRecordDescription}
          setNewRecordDescription={setNewRecordDescription}
        />
      )}

    </div>
  );
};

export default IncomeExpense;
