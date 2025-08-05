import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Pencil } from 'lucide-react';
import { API_BASE } from '../../config';

const ItemDetailsModal = ({ isOpen, onClose, item, onEdit }) => {
  const [scrapAmount, setScrapAmount] = useState('');
  const [scrapReason, setScrapReason] = useState('');
  const [scrapError, setScrapError] = useState('');
  const [scrapSuccess, setScrapSuccess] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  if (!item) return null;

  const handleScrap = async () => {
    setScrapError('');
    setScrapSuccess('');
    if (!scrapAmount || isNaN(scrapAmount)) {
      setScrapError('Enter a valid quantity to scrap.');
      return;
    }
    if (!selectedLocation) {
      setScrapError('Select a location to scrap from.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/stock/scrap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_id: parseInt(selectedLocation),
          quantity: parseInt(scrapAmount),
          reason: scrapReason || 'No reason provided',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to scrap');

      setScrapSuccess('Scrapped successfully!');
      setScrapAmount('');
      setScrapReason('');
      setSelectedLocation('');
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
              <button onClick={() => onEdit(item)} className="text-blue-600 hover:underline flex items-center gap-1">
                <Pencil size={16} /> Edit
              </button>
              <button onClick={onClose} className="text-gray-600 hover:text-black">
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              {item.image_url ? (
                <img src={`${API_BASE}${item.image_url}`} alt={item.name} className="w-full max-h-64 object-contain rounded-md border mb-4" />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Scrapped:</strong> {item.scrap_count || 0}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Cost to Make:</strong> ${item.cost_to_make || '0.00'}</p>
                <p><strong>Barcode:</strong> {item.barcode}</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Locations & Quantities</p>
                {item.locations?.length ? (
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {item.locations.map((loc, idx) => (
                      <li key={idx}>{loc.location_name || `ID ${loc.location_id}`} — {loc.quantity}</li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-500">No location data</p>}
              </div>
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Description</p>
                <p className="text-sm text-gray-600">{item.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="font-semibold text-sm mb-2">Attachments</p>
                {item.file_url ? (
                  <a href={`${API_BASE}${item.file_url}`} target="_blank" rel="noopener noreferrer" className="block border px-4 py-3 text-blue-600 underline">
                    View Document
                  </a>
                ) : <div className="text-sm text-gray-500 border px-4 py-3">No attachments</div>}
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-semibold">Other Info</p>
                <p><strong>Aisle #:</strong> {item.bin_numbers || 'N/A'}</p>
                <p><strong>Supplier:</strong> {item.supplier || 'N/A'}</p>
                <p><strong>Production Stage:</strong> {item.production_stage || 'N/A'}</p>
                <p><strong>Lot #:</strong> {item.lot_number || 'N/A'}</p>
                <p><strong>Notes:</strong> {item.notes || 'N/A'}</p>
              </div>

              {/* Scrap Form */}
              <div className="border-t pt-4">
                <p className="font-semibold mb-2 text-sm">Scrap Item</p>
                <div className="flex flex-col gap-2">
                  <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="border p-2 rounded">
                    <option value="">Select Location</option>
                    {item.locations?.map((loc, idx) => (
                      <option key={idx} value={loc.location_id}>
                        {loc.location_name || `ID ${loc.location_id}`}
                      </option>
                    ))}
                  </select>
                  <input type="number" value={scrapAmount} onChange={(e) => setScrapAmount(e.target.value)} placeholder="Qty to scrap" className="border p-2 rounded" />
                  <input type="text" value={scrapReason} onChange={(e) => setScrapReason(e.target.value)} placeholder="Reason" className="border p-2 rounded" />
                  <button onClick={handleScrap} className="bg-red-600 text-white px-4 py-2 rounded">Scrap</button>
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
