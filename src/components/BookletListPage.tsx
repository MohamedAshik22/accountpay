import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookletList from "../components/BookletList";
import axios from "axios";
import { Pencil, Trash2, Check, X } from "lucide-react";
import DeleteConfirmation from "./Delete";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Booklet {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const BookletListPage: React.FC = () => {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW: edit/delete state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooklets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${apiUrl}/booklets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooklets(res.data || []);
      } catch (err) {
        console.error("Failed to fetch booklets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooklets();
  }, []);

  // NEW: start/cancel edit
  const startEdit = (b: Booklet) => {
    setEditingId(b.id);
    setNameInput(b.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNameInput("");
  };

  // NEW: save edit
  const saveEdit = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const trimmed = nameInput.trim();
    if (!trimmed) return;

    try {
      setSavingId(id);
      const res = await axios.put(
        `${apiUrl}/booklets/${id}`,
        { name: trimmed }, // add description if your API requires it
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newName = res.data?.name ?? trimmed;
      setBooklets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, name: newName } : b))
      );
      cancelEdit();
    } catch (err) {
      console.error("Failed to update booklet", err);
      alert("Could not update the booklet name.");
    } finally {
      setSavingId(null);
    }
  };

  // NEW: delete
  const deleteBooklet = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setDeletingId(id);
      await axios.delete(`${apiUrl}/booklets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooklets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete booklet", err);
      alert("Could not delete the booklet.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading booklets...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-fuchsia-600">All Booklets</h1>
          <Link
            to="/booklets/create"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700"
          >
            + Create
          </Link>
        </div>

        {booklets.length === 0 ? (
          <p className="text-gray-500">No booklets found. Create one!</p>
        ) : (
          <ul className="space-y-2">
            {booklets.map((b) => {
              const isEditing = editingId === b.id;
              const isSaving = savingId === b.id;
              const isDeleting = deletingId === b.id;

              return (
                <li
                  key={b.id}
                  className="p-3 rounded-lg hover:bg-gray-50 flex items-start justify-between gap-3"
                >
                  {/* Left: name/desc (clickable when not editing) */}
                  <div className="flex-1 min-w-0">
                    {!isEditing ? (
                      <Link to={`/booklets/${b.id}`} className="block">
                        <h3 className="font-medium text-black break-words">
                          {b.name}
                        </h3>
                        {b.description ? (
                          <p className="text-sm text-gray-500 break-words">
                            {b.description}
                          </p>
                        ) : null}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="border rounded px-2 py-1 text-base w-full"
                          disabled={isSaving}
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            startEdit(b);
                          }}
                          className="p-2 rounded hover:bg-gray-200"
                          title="Edit name"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        
                        <DeleteConfirmation onDelete={() => deleteBooklet(b.id)} />
                        
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isSaving) saveEdit(b.id);
                          }}
                          className="p-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                          title="Save"
                          disabled={isSaving}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isSaving) cancelEdit();
                          }}
                          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                          title="Cancel"
                          disabled={isSaving}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookletListPage;
