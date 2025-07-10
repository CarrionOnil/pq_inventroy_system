import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import AddItemForm from '../components/stockPage/AddItemForm';
import StockSearchFilter from '../components/stockPage/StockSearchFilter';


const StockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    status: '',
    location: '',
  });

  const fetchStock = async () => {
    try {
      const res = await fetch('http://localhost:8000/stock');
      const data = await res.json();
      setStockItems(data);
    } catch (error) {
      console.error("Failed to fetch stock:", error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

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
            onClick={() => setShowForm(true)}
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
          className="border px-4 py-2 rounded-md w-full max-w-md"
        />
        <button 
          className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-100"
          onClick={() => setShowFilters(prev => !prev)}
        >
          <Filter className="w-4 h-4" />
          
          
          Filters
        </button>
      </div>

       {/* Filter Component */}
      {showFilters && (
        <StockSearchFilter filters={filters} setFilters={setFilters} />
      )}




      {/* Add Item Form */}
      {showForm && (
        <AddItemForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchStock}
        />
      )}

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded-lg text-black">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Part Name</th>
              <th className="px-4 py-2 text-left">Part ID</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Barcode</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map(item => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">
                  <img src="/placeholder.png" alt="Item" className="w-10 h-10 rounded" />
                </td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.partId}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.location}</td>
                <td className="px-4 py-2">{item.barcode}</td>
                <td className="px-4 py-2">
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
            {stockItems.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-400" colSpan="9">
                  No stock items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPage;


