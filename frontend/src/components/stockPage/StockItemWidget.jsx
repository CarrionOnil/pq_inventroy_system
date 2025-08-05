import React from 'react';
import { API_BASE } from '../../config';

export default function StockItemWidget({ item, onClick, selectedLocation }) {
  let displayedQty = 0;

  if (selectedLocation) {
    const locData = item.locations?.find(
      (loc) =>
        loc.location_name?.toLowerCase() === selectedLocation.toLowerCase() ||
        String(loc.location_id) === String(selectedLocation)
    );
    displayedQty = locData ? locData.quantity : 0;
  } else {
    displayedQty = item.locations
      ? item.locations.reduce((sum, loc) => sum + loc.quantity, 0)
      : 0;
  }

  return (
    <div
      className="cursor-pointer bg-white text-black rounded-lg shadow hover:shadow-md flex flex-col items-center p-4 h-64 hover:scale-[1.02] transition-transform duration-150"
      onClick={() => onClick(item)}
    >
      <div className="w-full h-32 flex items-center justify-center">
        {item.image_url ? (
          <img
            src={`${API_BASE}${item.image_url}`}
            alt={item.name}
            className="h-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="text-center mt-2 flex-grow">
        <p className="text-lg font-semibold">{item.name}</p>
        <p className="text-sm text-gray-600">Part ID: {item.partId}</p>
        <p className="text-sm text-gray-600">Qty: {displayedQty}</p>
      </div>

      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
        {item.status}
      </span>
    </div>
  );
}
