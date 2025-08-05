import React, { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AddItemForm({ onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    partId: "",
    category: "",
    barcode: "",
    status: "In Stock",
    cost: "",
    lot_number: "",
    description: "",
    bin_numbers: "",
    supplier: "",
    production_stage: "",
    notes: "",
    image: null,
    file: null,
    locations: [{ location_id: "", quantity: "" }],
  });

  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/locations`)
      .then((res) => res.json())
      .then(setLocationsList)
      .catch((err) => console.error("Failed to fetch locations:", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        image: null,
        file: null,
        locations: initialData.locations || [{ location_id: "", quantity: "" }],
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

  const handleLocationChange = (index, field, value) => {
    const updated = [...formData.locations];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, locations: updated }));
  };

  const addLocationRow = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, { location_id: "", quantity: "" }],
    }));
  };

  const removeLocationRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validLocations = formData.locations.filter(
      (loc) => loc.location_id && loc.quantity
    );
    if (!validLocations.length) {
      alert("Please add at least one location with a quantity.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (["image", "file"].includes(key)) {
        if (value) payload.append(key, value);
      } else if (key !== "locations") {
        payload.append(key, value);
      }
    });

    if (initialData) {
      // PUT expects JSON locations
      payload.append("locations", JSON.stringify(validLocations));
    } else {
      // POST expects separate arrays
      validLocations.forEach((loc) => {
        payload.append("locations", loc.location_id);
        payload.append("quantities", loc.quantity);
      });
    }

    try {
      const method = initialData ? "PUT" : "POST";
      const endpoint = initialData
        ? `${API_BASE}/stock/${initialData.id}`
        : `${API_BASE}/stock`;

      await fetch(endpoint, { method, body: payload });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit stock item:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border rounded-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Basic Info */}
        <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="partId" placeholder="Part ID" value={formData.partId} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <CategorySelect value={formData.category} onChange={handleCategoryChange} />
        <input name="barcode" placeholder="Barcode" value={formData.barcode} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
        <input name="cost" type="number" placeholder="Cost to Make" value={formData.cost} onChange={handleInputChange} className="border px-3 py-2 rounded-md text-black" />
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

        {/* Location Rows */}
        <div className="col-span-2 space-y-2">
          <label className="text-white font-medium">Locations & Quantities</label>
          {formData.locations.map((loc, idx) => (
            <div key={idx} className="flex gap-2">
              <select value={loc.location_id} onChange={(e) => handleLocationChange(idx, "location_id", e.target.value)} className="border px-3 py-2 rounded-md text-black flex-1">
                <option value="">Select Location</option>
                {locationsList.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <input type="number" placeholder="Quantity" value={loc.quantity} onChange={(e) => handleLocationChange(idx, "quantity", e.target.value)} className="border px-3 py-2 rounded-md text-black w-28" />
              {formData.locations.length > 1 && (
                <button type="button" onClick={() => removeLocationRow(idx)} className="px-3 py-2 bg-red-600 text-white rounded-md">×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addLocationRow} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md">+ Add Location</button>
        </div>

        {/* Files */}
        <div>
          <label className="text-sm text-white mb-1 block">Item Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="block w-full text-white file:bg-blue-600" />
        </div>
        <div>
          <label className="text-sm text-white mb-1 block">Attachment (PDF)</label>
          <input type="file" name="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-white file:bg-gray-600" />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">{initialData ? "Update" : "Save"}</button>
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
      </div>
    </form>
  );
}
