import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddRecordModal from '../components/AddRecord';
import DeleteConfirmation from '../components/Delete';
import EditRecordForm from '../components/EditRecordForm';
import AdPlaceholder from '../components/Ad/AdPlaceholder';
import { MoreVertical, Pencil, Check, X } from 'lucide-react';


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
  // NEW state (put near your other useState hooks)
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

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

  // NEW handler (put with your other handlers)
  const handleUpdateBookletName = async () => {
    if (!booklet) return;
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === booklet.name) {
      setIsEditingName(false);
      setNameInput('');
      return;
    }

    try {
      setSavingName(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // assuming your API updates name at PUT /booklets/:id
      const res = await axios.put(
        `${apiUrl}/booklets/${booklet.id}`,
        { name: trimmed, description: booklet.description ?? '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update local state optimistically from response (or just set name)
      setBooklet(prev => (prev ? { ...prev, name: res.data?.name ?? trimmed } : prev));
      setIsEditingName(false);
      setNameInput('');
    } catch (err) {
      console.error('Failed to update booklet name', err);
      alert('Could not update the booklet name.');
    } finally {
      setSavingName(false);
    }
  };

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
        <div className="flex items-center gap-2">
          {!isEditingName ? (
            <>
              <h1 className="text-2xl font-bold text-fuchsia-600">{booklet.name}</h1>
              <button
                onClick={() => {
                  setNameInput(booklet.name);
                  setIsEditingName(true);
                }}
                className="p-1 rounded hover:bg-gray-100 text-gray-600"
                title="Edit name"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="border rounded px-2 py-1 text-lg"
                autoFocus
                disabled={savingName}
              />
              <button
                onClick={handleUpdateBookletName}
                disabled={savingName}
                className="p-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                title="Save"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNameInput('');
                }}
                disabled={savingName}
                className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                title="Cancel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <Link
          to="/"
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ← Back
        </Link>
      </div>
      <AdPlaceholder />
      {booklet.description && (
        <p className="text-gray-600 mb-4">{booklet.description}</p>
      )}

      {/* RECORDS LIST — bubbles: income left, expense right */}
      {records.length === 0 ? (
        <p className="text-gray-500">No records yet.</p>
      ) : (
        <ul className="space-y-2 flex flex-col w-full list-none">
          {records.map((r) => {
            const isIncome = r.type === 'income';
            return (
              <li
                key={r.id}
                className={[
                  'p-3 border rounded-lg shadow-sm flex items-center gap-3 w-fit max-w-[85%]',
                  isIncome
                    ? 'self-start bg-green-50 flex-row'      // income bubble left → row normal
                    : 'self-end bg-red-50 flex-row-reverse', // expense bubble right → row reversed
                ].join(' ')}
              >
                {editingRecord && editingRecord.id === r.id ? (
                  <EditRecordForm
                    editingRecord={editingRecord}
                    setEditingRecord={setEditingRecord}
                    handleEdit={handleEdit}
                  />
                ) : (
                  <>
                    {/* Text block */}
                    <div className={['flex-grow', isIncome ? 'text-left' : 'text-right'].join(' ')}>
                      <span
                        className={[
                          'text-lg font-bold',
                          isIncome ? 'text-green-700' : 'text-red-700',
                        ].join(' ')}
                      >
                        {isIncome ? '+' : '-'}₹{Number(r.amount).toFixed(2)}
                      </span>
                      <p className="text-gray-700 text-sm break-words">{r.description}</p>
                      <p className="text-gray-400 text-xs">{r.date}</p>
                    </div>

                    {/* Options menu – always on inside edge */}
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOptionsId(prev => (prev === r.id ? null : r.id));
                        }}
                        className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeOptionsId === r.id && (
                        <div
                          className={[
                            'absolute top-full z-10 bg-white border rounded shadow-lg options-menu mt-1',
                            isIncome ? 'right-0' : 'left-0', // anchor inward
                          ].join(' ')}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingRecord(r);
                              setActiveOptionsId(null);
                            }}
                            className="block w-full text-left p-3 hover:bg-gray-100"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>

                          <DeleteConfirmation
                            onDelete={async () => {
                              await handleDelete(r.id);
                              setActiveOptionsId(null);
                            }}
                            
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>

      )}


      {/* FAB BUTTONS */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end space-y-2">
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
