import React, { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { API_BASE } from '../config';

export default function BarcodeScannerPage() {
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices.length) {
        setError("No camera available on this device.");
        return;
      }

      setScanning(true);
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await html5QrCode.stop();
          setScanning(false);
          fetchItem(decodedText);
        },
        (err) => console.warn("Scan error:", err)
      );
    } catch (err) {
      setError("Failed to access camera: " + err.message);
    }
  };

  const fetchItem = async (barcode) => {
    try {
      const res = await fetch(`${API_BASE}/stock/barcode/${barcode}`);
      if (!res.ok) throw new Error("Item not found");
      const data = await res.json();
      setScannedData(data);
      setError('');
    } catch (err) {
      setScannedData(null);
      setError(err.message);
    }
  };

  const applyQuantityChange = async (direction) => {
    if (!adjustAmount || isNaN(adjustAmount)) return;

    setAdjusting(true);
    try {
      const res = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: scannedData.barcode,
          action: direction,
          amount: parseInt(adjustAmount),
        }),
      });

      if (!res.ok) throw new Error("Failed to update stock");

      const updatedItem = await res.json();
      setScannedData(updatedItem);
      setAdjustAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode</h1>

      <button
        onClick={startScanner}
        disabled={scanning}
        className="mb-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {scanning ? "Scanning..." : "Start Scan"}
      </button>

      <div id="qr-reader" className="w-full max-w-md h-64 bg-gray-700" ref={scannerRef}></div>

      {scannedData && (
        <div className="mt-4 bg-white text-black p-4 rounded shadow space-y-2">
          <h2 className="text-lg font-semibold">Scanned Item</h2>
          <p><strong>Name:</strong> {scannedData.name}</p>
          <p><strong>Quantity:</strong> {scannedData.quantity}</p>
          <p><strong>Location:</strong> {scannedData.location}</p>
          <p><strong>Status:</strong> {scannedData.status}</p>

          <div className="mt-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="number"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              placeholder="Enter quantity"
              className="border p-2 rounded w-full max-w-xs"
            />
            <button
              onClick={() => applyQuantityChange('add')}
              disabled={adjusting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => applyQuantityChange('remove')}
              disabled={adjusting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </div>
  );
}




