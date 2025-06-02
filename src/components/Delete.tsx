import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmationProps {
  onDelete: () => Promise<void> | void;  // Support async deletes
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 shadow"
      >
        Delete
      </button>

      <Dialog open={isOpen} onClose={() => !isDeleting && setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <DialogPanel className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 z-50">
            <DialogTitle className="text-lg font-bold">Confirm Deletion</DialogTitle>
            <button
              onClick={() => !isDeleting && setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              disabled={isDeleting}
            >
              <X />
            </button>

            <div className="mt-4 text-gray-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteConfirmation;
