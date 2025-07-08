// src/components/ScanBarcode.jsx
import { useState } from 'react';

export default function ScanBarcode({ setRefresh }) {
  const [barcode, setBarcode] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode }),
    });
    setBarcode('');
    setRefresh(r => !r);
  };

  return (
    <form onSubmit={handleScan} className="flex items-center space-x-4">
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan or enter barcode"
        className="border p-2 rounded w-full max-w-sm"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
