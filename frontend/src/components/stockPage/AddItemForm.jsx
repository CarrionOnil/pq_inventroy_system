// src/components/stockPage/AddItemForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import CategorySelect from "./CategorySelect";

const API_BASE = import.meta.env.VITE_API_BASE;

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-200">
    {children}
  </label>
);

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null;

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

  const [errors, setErrors] = useState({});
  const [locationsList, setLocationsList] = useState([]);

  const imagePreview = useMemo(() => {
    if (!formData.image) return null;
    try {
      return URL.createObjectURL(formData.image);
    } catch {
      return null;
    }
  }, [formData.image]);

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

  const setValue = (name, value) =>
    setFormData((p) => ({ ...p, [name]: value }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleCategoryChange = (value) => setValue("category", value);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setValue(e.target.name, file);
  };

  const handleLocationChange = (index, field, value) => {
    const updated = [...formData.locations];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, locations: updated }));
  };

  const addLocationRow = () =>
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, { location_id: "", quantity: "" }],
    }));

  const removeLocationRow = (index) =>
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = "Name is required.";
    if (!formData.partId?.trim()) errs.partId = "Part ID is required.";
    const validLocations = formData.locations.filter(
      (l) => l.location_id && l.quantity
    );
    if (!validLocations.length) errs.locations = "Add at least one location.";
    if (formData.cost !== "" && Number(formData.cost) < 0)
      errs.cost = "Cost cannot be negative.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const validLocations = formData.locations
      .filter((loc) => loc.location_id && loc.quantity)
      .map((loc) => ({ ...loc }));

    try {
      if (initialData) {
        const jsonPayload = {
          ...formData,
          cost: formData.cost !== "" ? parseFloat(formData.cost) : 0,
          locations: validLocations.map((loc) => ({
            location_id: parseInt(loc.location_id),
            quantity: parseInt(loc.quantity),
          })),
        };

        await fetch(`${API_BASE}/stock/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonPayload),
        });
      } else {
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (["image", "file"].includes(key)) {
            if (value) payload.append(key, value);
          } else if (key !== "locations") {
            if (key === "cost" && value !== "") {
              payload.append(key, parseFloat(value));
            } else {
              payload.append(key, value ?? "");
            }
          }
        });
        validLocations.forEach((loc) => {
          payload.append("locations", loc.location_id);
          payload.append("quantities", loc.quantity);
        });
        await fetch(`${API_BASE}/stock`, { method: "POST", body: payload });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit stock item:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-6"
    >
      {/* Essentials */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Grip"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <FieldError msg={errors.name} />
        </div>

        <div>
          <Label htmlFor="partId">Part ID</Label>
          <input
            id="partId"
            name="partId"
            value={formData.partId}
            onChange={handleInputChange}
            placeholder="P-00123"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <FieldError msg={errors.partId} />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          {/* If CategorySelect supports hiding its own label, pass hideLabel */}
          <CategorySelect value={formData.category} onChange={handleCategoryChange} hideLabel />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <input
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              placeholder="Scan or enter"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <Label htmlFor="cost">Cost to Make</Label>
            <input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="0.00"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <FieldError msg={errors.cost} />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
          >
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        <div>
          <Label htmlFor="lot_number">Lot #</Label>
          <input
            id="lot_number"
            name="lot_number"
            value={formData.lot_number}
            onChange={handleInputChange}
            placeholder="Optional"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Short description"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Thin divider */}
      <div className="my-4 h-px w-full bg-slate-700/50" />

      {/* Ops + Notes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="bin_numbers">Aisle #</Label>
          <input
            id="bin_numbers"
            name="bin_numbers"
            value={formData.bin_numbers}
            onChange={handleInputChange}
            placeholder="A-12"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <input
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            placeholder="Company"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <Label htmlFor="production_stage">Production Stage</Label>
          <input
            id="production_stage"
            name="production_stage"
            value={formData.production_stage}
            onChange={handleInputChange}
            placeholder="Prototype"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <Label htmlFor="notes">Notes / Comments</Label>
          <input
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any special handling or remarks"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Thin divider */}
      <div className="my-4 h-px w-full bg-slate-700/50" />

      {/* Locations (compact) */}
      <div>
        <div className="flex items-center justify-between">
          <Label>Locations & Quantities</Label>
          {errors.locations ? <FieldError msg={errors.locations} /> : null}
        </div>

        <div className="mt-2 space-y-2">
          {formData.locations.map((loc, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={loc.location_id}
                onChange={(e) =>
                  handleLocationChange(idx, "location_id", e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Location</option>
                {locationsList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                placeholder="Qty"
                value={loc.quantity}
                onChange={(e) =>
                  handleLocationChange(idx, "quantity", e.target.value)
                }
                className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-right text-slate-100 focus:border-blue-500 focus:outline-none"
              />
              {formData.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocationRow(idx)}
                  className="rounded-lg border border-red-700/60 bg-red-900/30 px-3 py-2 text-sm text-red-300 hover:bg-red-800/40"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLocationRow}
            className="mt-1 inline-flex items-center rounded-lg border border-blue-700/60 bg-blue-900/30 px-3 py-2 text-sm text-blue-200 hover:bg-blue-800/40"
          >
            + Add Location
          </button>
        </div>
      </div>

      {/* Thin divider */}
      <div className="my-4 h-px w-full bg-slate-700/50" />

      {/* Files (simple, with optional preview) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="image">Item Image</Label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-28 w-full rounded-lg border border-slate-700 bg-slate-900 object-contain p-2"
            />
          ) : null}
        </div>

        <div>
          <Label htmlFor="file">Attachment (PDF)</Label>
          <input
            id="file"
            type="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-slate-600 file:px-3 file:py-2 file:text-white hover:file:bg-slate-500"
          />
          {formData.file ? (
            <p className="mt-2 text-xs text-slate-400">{formData.file.name}</p>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
        >
          {initialData ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
