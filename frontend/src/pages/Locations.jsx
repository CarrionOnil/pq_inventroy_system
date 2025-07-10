// frontend/src/pages/LocationsPage.jsx
import React, { useEffect, useState } from 'react';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [filter, setFilter] = useState('');

  const fetchLocations = async () => {
    try {
      const res = await fetch('http://localhost:8000/locations');
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;
    try {
      await fetch('http://localhost:8000/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLocation }),
      });
      setNewLocation('');
      fetchLocations();
    } catch (err) {
      console.error('Failed to add location:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc =>
  loc.name.toLowerCase().includes(filter.toLowerCase())
);


  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Locations</h1>
        <div className="flex gap-2">
          <input
            className="border px-3 py-2 rounded-md text-black"
            placeholder="New Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <button
            onClick={handleAddLocation}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + New
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <input
          className="border px-3 py-2 rounded-md text-black"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-white text-black rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Location</th>
            <th className="text-left px-4 py-2">Location Type</th>
            <th className="text-left px-4 py-2">Storage Category</th>
            <th className="text-left px-4 py-2">Company</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocations.map((loc, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{loc.name}</td>
              <td className="px-4 py-2">Internal Location</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">My Company</td>
            </tr>
          ))}
          {filteredLocations.length === 0 && (
            <tr>
              <td className="px-4 py-2 text-center text-gray-400" colSpan={4}>
                No locations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}