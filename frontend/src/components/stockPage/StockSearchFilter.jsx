import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function StockSearchFilter({ filters, setFilters }) {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE}/locations`);
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchLocations();
    fetchCategories();
  }, []);

  const clearFilters = () => {
    setFilters({ category: '', status: '', location: '' });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      {/* Category dropdown */}
      <select
        name="category"
        value={filters.category}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, category: e.target.value }))
        }
        className="border px-4 py-2 rounded-md text-black"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Status dropdown */}
      <select
        name="status"
        value={filters.status}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, status: e.target.value }))
        }
        className="border px-4 py-2 rounded-md text-black"
      >
        <option value="">All Status</option>
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      {/* Location dropdown */}
      <select
        name="location"
        value={filters.location}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, location: e.target.value }))
        }
        className="border px-4 py-2 rounded-md text-black"
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="ml-2 text-sm text-blue-600 hover:underline"
      >
        Clear Filters
      </button>
    </div>
  );
}
