// src/components/stockPage/ItemDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Pencil } from 'lucide-react';
import { API_BASE } from '../../config';
import TransferItemModal from './TransferItemModal';
import ScrapItemModal from './ScrapItemModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-6 bg-red-100 text-red-700">Error: {this.state.error.message}</div>;
    }

    return this.props.children;
  }
}

const ItemDetailsModal = ({ isOpen, onClose, item, onEdit }) => {
  const [showTransfer, setShowTransfer] = useState(false);
  const [showScrap, setShowScrap] = useState(false);
  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      console.log("Fetching locations...");
      fetch(`${API_BASE}/locations`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch locations");
          return res.json();
        })
        .then(data => {
          console.log("Fetched locations:", data);
          setLocationsList(data || []);
        })
        .catch(err => console.error('Failed to fetch locations', err));
    }
  }, [isOpen]);

  if (!item) {
    console.warn("ItemDetailsModal loaded without item");
    return null;
  }

  console.log("ItemDetailsModal Rendered:", { isOpen, item });

  return (
    <ErrorBoundary>
      <Dialog open={!!isOpen} onClose={onClose}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                  <p><strong>Cost to Make:</strong> ${item.cost ?? '0.00'}</p>
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

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowScrap(true)} className="bg-red-600 text-white px-4 py-2 rounded">Scrap</button>
                  <button onClick={() => setShowTransfer(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Transfer</button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Standalone modals outside the Dialog hierarchy */}
      {showTransfer && (
        <TransferItemModal
          item={item}
          allLocations={locationsList}
          onClose={() => setShowTransfer(false)}
          onSuccess={() => setShowTransfer(false)}
        />
      )}

      {showScrap && (
        <ScrapItemModal
          item={item}
          onClose={() => setShowScrap(false)}
          onSuccess={() => setShowScrap(false)}
        />
      )}
    </ErrorBoundary>
  );
};

export default ItemDetailsModal;
