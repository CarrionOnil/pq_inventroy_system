import React, { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function BarcodeScannerPage() {
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

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
      const res = await fetch(`http://localhost:8000/stock/barcode/${barcode}`);
      if (!res.ok) throw new Error("Item not found");
      const data = await res.json();
      setScannedData(data);
    } catch (err) {
      setError(err.message);
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
        <div className="mt-4 bg-white text-black p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Scanned Item</h2>
          <p><strong>Name:</strong> {scannedData.name}</p>
          <p><strong>Quantity:</strong> {scannedData.quantity}</p>
          <p><strong>Location:</strong> {scannedData.location}</p>
          <p><strong>Status:</strong> {scannedData.status}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </div>
  );
}

