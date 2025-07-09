import React from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';

const StockPage = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Stock</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-100">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
        <button className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-gray-100">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {['All', 'Warehouse', 'Production', 'Low Stock', 'Incoming'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-full text-sm bg-gray-200 hover:bg-gray-300"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow rounded-lg">
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
            {/* Sample row */}
            <tr className="border-t">
              <td className="px-4 py-2">
                <img src="/placeholder.png" alt="Item" className="w-10 h-10 rounded" />
              </td>
              <td className="px-4 py-2">Circuit Board</td>
              <td className="px-4 py-2">CB-302</td>
              <td className="px-4 py-2">Electronics</td>
              <td className="px-4 py-2">24</td>
              <td className="px-4 py-2">Warehouse A</td>
              <td className="px-4 py-2">123456789</td>
              <td className="px-4 py-2">
                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">In Stock</span>
              </td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:underline text-sm">Edit</button>
              </td>
            </tr>
            {/* Add dynamic rows here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPage;
