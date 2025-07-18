import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function StockFilter({ filters, setFilters }) {
  const [locations, setLocations] = useState([]);

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
    fetchLocations();
  }, []);

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
        {locations.map((loc) => (
          <option key={loc.id} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}


