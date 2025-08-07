// src/components/stockPage/TransferItemModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
import { Dialog } from '@headlessui/react';

export default function TransferItemModal({ item, allLocations = [], onClose, onSuccess }) {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  const handleTransfer = async () => {
    if (!fromLocation || !toLocation || !quantity) {
      setError('All fields are required.');
      return;
    }
    if (fromLocation === toLocation) {
      setError('Source and destination locations must differ.');
      return;
    }

    const payload = {
      stock_id: item.id,
      location_id: parseInt(fromLocation),
      to_location_id: parseInt(toLocation),
      quantity: parseInt(quantity),
      reason,
    };

    console.log('Transfer Payload:', payload);

    try {
      await axios.post(`${API_BASE}/stock/transfer`, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Transfer failed:', err);
      setError(err.response?.data?.detail || 'Transfer failed.');
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white text-black rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Transfer Item</Dialog.Title>
          {error && <p className="text-red-600 mb-2">{error}</p>}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">From Location</label>
              <select
                className="w-full p-2 border rounded"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              >
                <option value="">Select Source</option>
                {allLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">To Location</label>
              <select
                className="w-full p-2 border rounded"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              >
                <option value="">Select Destination</option>
                {allLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleTransfer}>Transfer</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
