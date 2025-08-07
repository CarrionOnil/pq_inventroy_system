// src/components/stockPage/ScrapItemModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
import { Dialog } from '@headlessui/react';

export default function ScrapItemModal({ item, onClose, onSuccess }) {
  const [locationId, setLocationId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  const handleScrap = async () => {
    if (!locationId || !quantity) {
      setError('Location and quantity are required.');
      return;
    }

    try {
      await axios.post(`${API_BASE}/stock/scrap`, {
        location_id: parseInt(locationId),
        quantity: parseInt(quantity),
        reason,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Scrap failed.');
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-6 bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white text-black rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Scrap Item</Dialog.Title>
          {error && <p className="text-red-600">{error}</p>}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Location</label>
              <select
                className="w-full p-2 border rounded"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">Select Location</option>
                {item.locations?.map((loc, idx) => (
                  <option key={idx} value={loc.location_id}>
                    {loc.location_name || `ID ${loc.location_id}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Reason (optional)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleScrap}>Scrap</button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
