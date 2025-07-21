import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AddLocForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    locationType: 'Internal Location',
    storageCategory: '',
    company: 'My Company',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit location:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-black">
        <h2 className="text-xl font-bold mb-4">Add New Location</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Location Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="storageCategory"
            placeholder="Storage Category"
            value={formData.storageCategory}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            name="locationType"
            placeholder="Location Type"
            value={formData.locationType}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



