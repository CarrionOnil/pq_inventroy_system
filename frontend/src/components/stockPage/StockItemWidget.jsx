// src/components/stockPage/StockItemWidget.jsx
import React from 'react';
import { API_BASE } from '../../config';

export default function StockItemWidget({ item, onClick }) {
  return (
        <div
          className="cursor-pointer bg-white text-black rounded-lg shadow hover:shadow-md flex flex-col items-center p-4 h-64 hover:scale-[1.02] transition-transform duration-150"
          onClick={() => onClick(item)}
        >
          <div className="w-full h-32 flex items-center justify-center">
            <img
              src={`${API_BASE}${item.image_url}`}
              alt={item.name}
              className="h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="text-center mt-2 flex-grow">
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">Part ID: {item.partId}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {item.status}
          </span>
        </div>
  );
}
