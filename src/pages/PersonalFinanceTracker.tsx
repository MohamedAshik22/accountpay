import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import DeleteConfirmation from '../components/Delete';
import AddRecordModal from '../components/AddRecord';
import { ChevronDownIcon, ChevronUpIcon, MoreVertical } from 'lucide-react';
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
  const [showOptions, setShowOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // New state for adding records
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'income' | 'expense'>('income');
  const [newRecordAmount, setNewRecordAmount] = useState('');
  const [newRecordDescription, setNewRecordDescription] = useState('');
  const [userCreatedDate, setUserCreatedDate] = useState<Date>(new Date()); // Replace with actual user created date

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);

    const userDateString = localStorage.getItem('userCreatedDate'); // Example
    if (userDateString) {
      setUserCreatedDate(new Date(userDateString));
    }
  }, []);

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
    <div className='h-[93vh] bg-white'>
      <div className="max-w-lg  mx-auto px-2 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 rounded-lg shadow-md flex flex-col">
        <div className="page-container flex flex-col space-y-2">

          {/* HEADER SECTION */}
          <div className="header-section bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-4 rounded-t-lg shadow-sm">
            <div className="flex items-center justify-between">
              {userCreatedDate && (
                <MonthYearSelector
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  setSelectedMonth={setSelectedMonth}
                  setSelectedYear={setSelectedYear}
                  userCreatedDate={userCreatedDate}
                />
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="focus:outline-none"
                >
                  {showSummary ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <h2 className="text-xl font-bold">
                  Balance:{" "}
                  <span className={summary.netBalance >= 0 ? "text-green-600" : "text-red-600"}>
                    ₹{summary.netBalance.toFixed(2)}
                  </span>
                </h2>
              </div>
              <Link to="/" className="text-blue-500 hover:underline">Home</Link>
            </div>
          </div>

          {showSummary && (
            <div className="absolute top-[140px] left-0 w-full px-2 z-50">
              <div className="flex justify-between max-w-lg mx-auto bg-zinc-200 rounded-lg shadow-md">
                <div className="text-green-500 p-2 rounded flex-1 mr-2">
                  <span className="font-semibold block mb-1">
                    Total Income ₹{summary.income.toFixed(2)}
                  </span>
                </div>
                <div className="text-red-500 p-2 rounded flex-1 ml-2">
                  <span className="font-semibold block mb-1">
                    Total Expenses ₹{summary.expense.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}


          {/* RECORDS LIST SECTION */}
          <div className="bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 space-y-2 flex flex-col w-full px-2 overflow-y-auto max-h-[calc(110vh-250px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
          <div className="fixed bottom-20 z-50 flex flex-col items-start space-y-2">
            {showOptions && (
              <>
                <button
                  onClick={() => {
                    setShowOptions(false);
                    setNewRecordType('income');
                    setIsAddModalOpen(true);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Income
                </button>
                <button
                  onClick={() => {
                    setShowOptions(false);
                    setNewRecordType('expense');
                    setIsAddModalOpen(true);
                  }}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Expense
                </button>
              </>
            )}
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="w-10 h-10 rounded-full  text-blue-500 flex items-center justify-center shadow-xl hover:bg-blue-700 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showOptions ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
            </button>
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
    </div>
  );
};

export default IncomeExpense;
