// src/components/StockActions.jsx
import { useState } from 'react';

export default function StockActions({ setRefresh }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);

  const addProduct = async () => {
    await fetch('http://localhost:8000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity: qty }),
    });
    setName('');
    setQty(1);
    setRefresh(r => !r);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Product</h2>
      <div className="flex items-center gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="border p-2 rounded"
        />
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border p-2 rounded w-20"
        />
        <button onClick={addProduct} className="bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
    </div>
  );
}
