import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Pencil } from 'lucide-react';
import { API_BASE } from '../../config';

const ItemDetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-6 bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-6xl p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <Dialog.Title className="text-2xl font-bold">{item.name}</Dialog.Title>
              <p className="text-sm text-gray-500">Part ID: {item.partId}</p>
            </div>
            <div className="flex gap-3">
              <button className="text-blue-600 hover:underline flex items-center gap-1">
                <Pencil size={16} />
                Edit
              </button>
              <button onClick={onClose} className="text-gray-600 hover:text-black">
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-2 gap-10">
            {/* Left Section */}
            <div>
              {/* Image */}
              {item.image_url ? (
                <img
                  src={`${API_BASE}${item.image_url}`}
                  alt={item.name}
                  className="w-full max-h-64 object-contain rounded-md border mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mb-4">
                  No Image
                </div>
              )}

              {/* Info List */}
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Cost to Make:</strong> ${item.cost_to_make || '0.00'}</p>
                <p><strong>Barcode:</strong> {item.barcode}</p>
                <p><strong>Lot #:</strong> {item.lot_number || 'N/A'}</p>
              </div>

              {/* Description */}
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Description</p>
                <p className="text-sm text-gray-600">{item.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Attachments */}
              <div>
                <p className="font-semibold text-sm mb-2">Attachments</p>
                {item.attachment_url ? (
                  <a
                    href={item.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-dashed rounded-md px-4 py-3 bg-gray-50 hover:bg-gray-100 text-blue-600 underline text-sm"
                  >
                    View Document
                  </a>
                ) : (
                  <div className="text-sm text-gray-500 border border-dashed rounded-md px-4 py-3 bg-gray-50">
                    No attachments
                  </div>
                )}
              </div>

              {/* Other Info */}
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-semibold">Other Info</p>
                <p><strong>Bin Number:</strong> {item.bin_numbers || 'N/A'}</p>
                <p><strong>Supplier:</strong> {item.supplier || 'N/A'}</p>
                <p><strong>Production Stage:</strong> {item.production_stage || 'N/A'}</p>
                <p><strong>Notes/Comments:</strong> {item.notes || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ItemDetailsModal;
