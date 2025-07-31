import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Pencil } from 'lucide-react';
import { API_BASE } from '../../config';

const ItemDetailsModal = ({ isOpen, onClose, item, onEdit }) => {
  const [scrapAmount, setScrapAmount] = useState('');
  const [scrapReason, setScrapReason] = useState('');
  const [scrapError, setScrapError] = useState('');
  const [scrapSuccess, setScrapSuccess] = useState('');

  if (!item) return null;

  const handleScrap = async () => {
    setScrapError('');
    setScrapSuccess('');
    if (!scrapAmount || isNaN(scrapAmount)) {
      setScrapError('Enter a valid quantity to scrap.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/stock/scrap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: item.barcode,
          amount: parseInt(scrapAmount),
          reason: scrapReason || 'No reason provided',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to scrap');

      setScrapSuccess('Scrapped successfully!');
      setScrapAmount('');
      setScrapReason('');
    } catch (err) {
      setScrapError(err.message);
    }
  };

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
              <button
                onClick={() => onEdit(item)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
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
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Scrapped:</strong> {item.scrap_count || 0}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Cost to Make:</strong> ${item.cost_to_make || '0.00'}</p>
                <p><strong>Barcode:</strong> {item.barcode}</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Description</p>
                <p className="text-sm text-gray-600">{item.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
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

              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-semibold">Other Info</p>
                <p><strong>Aisle #:</strong> {item.bin_numbers || 'N/A'}</p>
                <p><strong>Supplier:</strong> {item.supplier || 'N/A'}</p>
                <p><strong>Production Stage:</strong> {item.production_stage || 'N/A'}</p>
                <p><strong>Lot #:</strong> {item.lot_number || 'N/A'}</p>
                <p><strong>Notes/Comments:</strong> {item.notes || 'N/A'}</p>
              </div>

              {/* Scrap Form */}
              <div className="border-t pt-4">
                <p className="font-semibold mb-2 text-sm">Scrap Item</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="number"
                    value={scrapAmount}
                    onChange={(e) => setScrapAmount(e.target.value)}
                    placeholder="Qty to scrap"
                    className="border p-2 rounded w-full sm:w-32"
                  />
                  <input
                    type="text"
                    value={scrapReason}
                    onChange={(e) => setScrapReason(e.target.value)}
                    placeholder="Reason"
                    className="border p-2 rounded w-full"
                  />
                  <button
                    onClick={handleScrap}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Scrap
                  </button>
                </div>
                {scrapError && <p className="text-sm text-red-500 mt-2">{scrapError}</p>}
                {scrapSuccess && <p className="text-sm text-green-600 mt-2">{scrapSuccess}</p>}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ItemDetailsModal;
