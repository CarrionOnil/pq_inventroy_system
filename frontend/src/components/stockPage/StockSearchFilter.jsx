import React from 'react';

export default function StockFilter({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
 
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="border px-4 py-2 rounded-md text-black"
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Hardware">Hardware</option>
      </select>
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="border px-4 py-2 rounded-md text-black"
      >
        <option value="">All Status</option>
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
      <select
        name="location"
        value={filters.location}
        onChange={handleChange}
        className="border px-4 py-2 rounded-md text-black"
      >
        <option value="">All Locations</option>
        <option value="Warehouse A">Warehouse A</option>
        <option value="Production">Production</option>
      </select>
    </div>
  );
}

