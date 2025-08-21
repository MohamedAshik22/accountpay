import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddRecordModal from './AddRecord';
import DeleteConfirmation from '../components/Delete';
import EditRecordForm from '../components/EditRecordForm';
import { MoreVertical } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Booklet {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface IncomeExpense {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
    timestamp: string;
}

const BookletView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booklet, setBooklet] = useState<Booklet | null>(null);
  const [records, setRecords] = useState<IncomeExpense[]>([]);
  const [loading, setLoading] = useState(true);

  // States for add record
  const [showOptions, setShowOptions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'income' | 'expense'>('income');
  const [newRecordAmount, setNewRecordAmount] = useState('');
  const [newRecordDescription, setNewRecordDescription] = useState('');

  // States for edit/delete
  const [editingRecord, setEditingRecord] = useState<IncomeExpense | null>(null);
  const [activeOptionsId, setActiveOptionsId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const resRecords = await axios.get(`${apiUrl}/booklets/${id}/income-expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(resRecords.data || []);
    } catch (error) {
      console.error('Error fetching records', error);
    }
  };

  useEffect(() => {
    const fetchBooklet = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const resBooklet = await axios.get(`${apiUrl}/booklets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooklet(resBooklet.data);

        await fetchRecords();
      } catch (err) {
        console.error('Failed to fetch booklet details', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooklet();
  }, [id, navigate]);

  const handleAdd = async () => {
    const amount = parseFloat(newRecordAmount);
    if (!amount) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `${apiUrl}/booklets/${id}/income-expenses`,
        {
          type: newRecordType,
          amount,
          description: newRecordDescription || 'N/A',
          date: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewRecordAmount('');
      setNewRecordDescription('');
      setIsAddModalOpen(false);

      fetchRecords();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingRecord) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(
        `${apiUrl}/booklets/income-expenses/${editingRecord.id}`,
        {
          type: editingRecord.type,
          amount: editingRecord.amount,
          description: editingRecord.description,
          date: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Error editing record:', error);
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${apiUrl}/booklets/income-expenses/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  if (loading) return <p className="text-gray-500">Loading booklet...</p>;
  if (!booklet) return <p className="text-red-500">Booklet not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-fuchsia-600">{booklet.name}</h1>
        <Link
          to="/"
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ← Back
        </Link>
      </div>

      {booklet.description && (
        <p className="text-gray-600 mb-4">{booklet.description}</p>
      )}

      {/* RECORDS LIST */}
      {records.length === 0 ? (
        <p className="text-gray-500">No records yet.</p>
      ) : (
        <ul className="space-y-2">
          {records.map((r) => (
            <li
              key={r.id}
              className={`p-3 border rounded-lg flex justify-between items-center ${
                r.type === 'income' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              {editingRecord && editingRecord.id === r.id ? (
                <EditRecordForm
                  editingRecord={editingRecord}
                  setEditingRecord={setEditingRecord}
                  handleEdit={handleEdit}
                />
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">{r.description}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-bold">
                      {r.type === 'income' ? '+' : '-'}₹{r.amount}
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOptionsId(prev =>
                            prev === r.id ? null : r.id
                          );
                        }}
                        className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeOptionsId === r.id && (
                        <div className="absolute right-0 top-full z-10 bg-white border rounded shadow-lg options-menu mt-1">
                          <button
                            onClick={() => {
                              setEditingRecord(r);
                              setActiveOptionsId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <DeleteConfirmation onDelete={() => handleDelete(r.id)} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* FAB BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
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
              + Add Income
            </button>
            <button
              onClick={() => {
                setShowOptions(false);
                setNewRecordType('expense');
                setIsAddModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg"
            >
              + Add Expense
            </button>
          </>
        )}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-700 transition"
        >
          {showOptions ? '×' : '+'}
        </button>
      </div>

      {/* ADD MODAL */}
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

export default BookletView;
