import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function BarcodeScannerPage() {
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            html5QrCode.stop();
            fetchItem(decodedText);
          },
          (err) => {
            console.warn("Scan error:", err);
          }
        );
      }
    }).catch(err => setError("Camera not accessible"));

    return () => html5QrCode.stop().catch(() => {});
  }, []);

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
