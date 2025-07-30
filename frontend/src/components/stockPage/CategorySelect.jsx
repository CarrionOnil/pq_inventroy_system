// src/components/StockPage/CategorySelect.jsx
import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newColor, setNewColor] = useState('#000000');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory, color: newColor }),
      });

      if (!res.ok) throw new Error('Failed to add category');
      setNewCategory('');
      setNewColor('#000000');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="col-span-2 space-y-2">
      <label className="text-white">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-md text-black"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New Category"
          className="border px-3 py-2 rounded-md text-black w-full"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 border rounded"
        />
        <button
          onClick={addCategory}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
