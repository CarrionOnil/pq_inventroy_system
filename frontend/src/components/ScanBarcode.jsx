import { useState } from 'react';

export default function ScanBarcode({ setRefresh }) {
  const [barcode, setBarcode] = useState('');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add');

  const handleScan = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode, action, amount: parseInt(amount) }),
    });
    setBarcode('');
    setAmount('');
    setRefresh(r => !r);
  };

  return (
    <form onSubmit={handleScan} className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Enter barcode"
        className="border p-2 rounded w-full max-w-sm"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Qty"
        className="border p-2 rounded w-24"
      />
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="add">Add</option>
        <option value="remove">Remove</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

