import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000'); // default color

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });

      if (!res.ok) throw new Error('Failed to add category');
      setName('');
      setColor('#000000');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white text-black space-y-4">
      <h2 className="text-lg font-semibold">Manage Categories</h2>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Category name"
          className="border px-2 py-1 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 p-0 border rounded"
        />
        <button
          onClick={addCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name}</span>
            </div>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
