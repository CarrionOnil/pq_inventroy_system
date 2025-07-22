// src/components/stockPage/StockItemWidget.jsx
import React from 'react';
import { API_BASE } from '../../config';

export default function StockItemWidget({ item, onClick }) {
  return (
    <div
      className="cursor-pointer bg-white text-black rounded-lg shadow hover:shadow-md flex overflow-hidden"
      onClick={() => onClick(item)}
    >
    <img
        src={`${API_BASE}${item.image_url}`}
        alt={item.name}
        className="w-24 h-24 object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
    />
      <div className="flex flex-col justify-center px-4 py-2 flex-grow">
        <p className="text-lg font-semibold">{item.name}</p>
        <p className="text-sm text-gray-600">Part ID: {item.partId}</p>
        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
      </div>
      <div className="flex flex-col justify-end pr-3 pb-2">
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{item.status}</span>
      </div>
    </div>
  );
}
