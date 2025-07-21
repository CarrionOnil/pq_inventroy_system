import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config';
import AddLocForm from '../components/LocPage/AddLocForm';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE}/locations`);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/locations/${id}`, { method: 'DELETE' });
      fetchLocations();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Locations</h1>
        <button onClick={() => { setSelectedLocation(null); setShowForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          + New
        </button>
      </div>

      <div className="mb-4">
        <input
          className="border px-3 py-2 rounded-md text-black"
          placeholder="Search Location Name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-white text-black rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Location</th>
            <th className="text-left px-4 py-2">Type</th>
            <th className="text-left px-4 py-2">Storage</th>
            <th className="text-left px-4 py-2">Company</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocations.map((loc) => (
            <tr key={loc.id} className="border-t">
              <td className="px-4 py-2">{loc.name}</td>
              <td className="px-4 py-2">{loc.locationType}</td>
              <td className="px-4 py-2">{loc.storageCategory || '-'}</td>
              <td className="px-4 py-2">{loc.company}</td>
              <td className="px-4 py-2">
                <button onClick={() => { setSelectedLocation(loc); setShowForm(true); }} className="text-blue-600 hover:underline mr-2">Edit</button>
                <button onClick={() => handleDelete(loc.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
          {filteredLocations.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 px-4 py-2">No locations found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <AddLocForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchLocations}
          initialData={selectedLocation}
        />
      )}
    </div>
  );
}
