// src/components/stockPage/StockItemPopup.jsx
import React from 'react';

export default function StockItemPopup({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white text-black rounded-lg p-6 max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-3 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex gap-4">
          <img
            src={item.image_url || '/placeholder.png'}
            alt={item.name}
            className="w-32 h-32 object-cover rounded"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p><strong>Part ID:</strong> {item.partId}</p>
            <p><strong>Cost to Make:</strong> ${item.cost || 'N/A'}</p>
            <p><strong>Qty:</strong> {item.quantity}</p>
            <p><strong>Barcode:</strong> {item.barcode}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Description:</strong> {item.description || 'None'}</p>
            {item.file_url && (
              <p>
                <strong>Attachment:</strong>{' '}
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>
            )}
            <div className="flex gap-4 pt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Edit</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
