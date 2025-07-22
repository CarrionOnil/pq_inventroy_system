import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import AddItemForm from '../components/stockPage/AddItemForm';
import StockSearchFilter from '../components/stockPage/StockSearchFilter';
import StockItemWidget from '../components/stockPage/StockItemWidget';
import StockItemPopup from '../components/stockPage/StockItemPopup';
import { API_BASE } from '../config';

const StockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [popupItem, setPopupItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    status: '',
    location: '',
  });

  const fetchStock = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const fullUrl = `${API_BASE}/stock?${params.toString()}`;
      const res = await fetch(fullUrl);
      const rawText = await res.clone().text();
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${rawText}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON: " + rawText);
      }

      const data = JSON.parse(rawText);
      setStockItems(data);
    } catch (error) {
      console.error("Failed to fetch stock:", error);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchStock();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/stock/${id}`, { method: 'DELETE' });
      fetchStock();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Stock</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-100">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              setShowForm(true);
              setEditItem(null);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, ID, or barcode"
          className="border px-4 py-2 rounded-md w-full max-w-md text-black"
          value={filters.query}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, query: e.target.value }))
          }
        />
        <button 
          className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-100"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Component */}
      {showFilters && (
        <StockSearchFilter filters={filters} setFilters={setFilters} />
      )}

      {/* Add/Edit Item Form */}
      {showForm && (
        <AddItemForm
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          onSuccess={fetchStock}
          initialData={editItem}
        />
      )}

      {/* Stock Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stockItems.length > 0 ? (
          stockItems.map(item => (
            <StockItemWidget key={item.id} item={item} onClick={setPopupItem} />
          ))
        ) : (
          <p className="text-gray-400">No stock items found.</p>
        )}
      </div>

      {/* Popup for Details */}
      {popupItem && (
        <StockItemPopup
          item={popupItem}
          onClose={() => setPopupItem(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default StockPage;
