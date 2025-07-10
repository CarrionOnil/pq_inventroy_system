import React, { useState } from 'react';

export default function AddItemForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    partId: '',
    category: '',
    quantity: '',
    location: '',
    barcode: '',
    status: 'In Stock',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });
      onSuccess(); // refetch stock
      onClose();   // close form
    } catch (err) {
      console.error("Failed to add stock:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border rounded-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={formData[key]}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded-md text-black"
          />
        ))}
      </div>
      <div className="flex gap-4">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
