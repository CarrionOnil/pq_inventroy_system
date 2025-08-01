import React, { useEffect, useState } from 'react';
import CategorySelect from './CategorySelect';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AddItemForm({ onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    partId: '',
    category: '',
    quantity: '',
    location: '',
    barcode: '',
    status: 'In Stock',
    cost: '',
    lot_number: '',
    description: '',
    bin_numbers: '',
    supplier: '',
    production_stage: '',
    notes: '',
    image: null,
    file: null,
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE}/locations`);
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        image: null,
        file: null,
      }));
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [e.target.name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    try {
      const method = initialData ? 'PUT' : 'POST';
      const endpoint = initialData
        ? `${API_BASE}/stock/${initialData.id}`
        : `${API_BASE}/stock`;

      await fetch(endpoint, {
        method,
        body: payload,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit stock item:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border rounded-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="partId" placeholder="Part ID" value={formData.partId} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />

        <CategorySelect value={formData.category} onChange={handleCategoryChange} />

        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />

        <select name="location" value={formData.location} onChange={handleInputChange} required className="border px-3 py-2 rounded-md text-black">
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>{loc.name}</option>
          ))}
        </select>

        <input name="cost" type="number" placeholder="Cost to Make" value={formData.cost} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="barcode" placeholder="Barcode" value={formData.barcode} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="lot_number" placeholder="Lot #" value={formData.lot_number} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black col-span-2" />

        <select name="status" value={formData.status} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black col-span-2">
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <input name="bin_numbers" placeholder="Aisle #" value={formData.bin_numbers} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="supplier" placeholder="Supplier" value={formData.supplier} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="production_stage" placeholder="Production Stage" value={formData.production_stage} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="notes" placeholder="Notes/Comments" value={formData.notes} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black col-span-2" />

        <div className="col-span-1">
          <label className="text-sm text-white mb-1 block">Item Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
          {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview" className="mt-2 h-24 rounded-md" />}
        </div>

        <div className="col-span-1">
          <label className="text-sm text-white mb-1 block">Attachment (PDF)</label>
          <input type="file" name="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-gray-600 file:text-white hover:file:bg-gray-700" />
          {formData.file && <p className="text-xs text-green-400 mt-1">{formData.file.name}</p>}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          {initialData ? 'Update' : 'Save'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </form>
  );
}
