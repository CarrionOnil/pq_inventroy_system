import React, { useEffect, useState } from 'react';
import { Filter, Plus, Download } from 'lucide-react';
import AddItemForm from '../components/stockPage/AddItemForm';
import StockSearchFilter from '../components/stockPage/StockSearchFilter';
import StockItemWidget from '../components/stockPage/StockItemWidget';
import ItemDetailsModal from '../components/stockPage/ItemDetailsModal';

const StockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState(4);

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: '',
  });

  const columnClassMap = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
  };
  const columnClass = columnClassMap[columns] || 'grid-cols-4';

  const fetchStock = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);

      const res = await fetch(`http://localhost:8000/stock?${params.toString()}`);
      const data = await res.json();
      setStockItems(data);
    } catch (error) {
      console.error("Failed to fetch stock:", error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/stock/${id}`, { method: 'DELETE' });
      fetchStock();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleView = (item) => {
    setViewItem(item);
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
        <button
          className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-100"
          onClick={() => setShowFilters(prev => !prev)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
        <select
          className="border px-2 py-1 rounded-md bg-white text-black"
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
        >
          {[3, 4, 5, 6, 7].map((num) => (
            <option key={num} value={num}>
              {num} per row
            </option>
          ))}
        </select>
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

      <ItemDetailsModal
        isOpen={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
        onEdit={(item) => {
          setEditItem(item);
          setShowForm(true);
          setViewItem(null);
        }}
      />

      {/* Grid Widget Layout */}
      <div className={`grid ${columnClass} gap-6`}>
        {stockItems.map((item) => (
          <StockItemWidget
            key={item.id}
            item={item}
            onClick={() => handleView(item)}
          />
        ))}
        {stockItems.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">No stock items found.</p>
        )}
      </div>
    </div>
  );
};

export default StockPage;
